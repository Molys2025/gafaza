// Support Assistant (SAV) v1.
//
// Second AI assistant of the app, focused on customer support:
//   - answers strictly from the local FAQ (supabase/functions/support-assistant/faq.ts)
//   - can read the caller's own transactions (read-only, RLS-scoped)
//   - can create a support ticket and escalate it to a human
//
// Hard rules baked into the system prompt:
//   * never triggers a refund, escrow release, subscription cancel, contact
//     unlock or any money/billing action itself — only prepares a ticket.
//   * if unsure, says so and offers to escalate rather than invent.
//
// Security: the Supabase client for user-data reads is built with the caller's
// JWT (Authorization header), so RLS applies. The service role is only used
// for the escalation email lookup (admin address).

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, guardRequest } from "../_shared/guard.ts";
import { formatFaqForPrompt } from "./faq.ts";

type Category = 'howto' | 'payment' | 'bug' | 'report' | 'other';

interface RequestBody {
  message: string;
  ticketId?: string;
  category?: Category;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  pageContext?: Record<string, unknown>;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ADMIN_SUPPORT_EMAIL = Deno.env.get('ADMIN_SUPPORT_EMAIL') ?? '';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const SYSTEM_PROMPT = `Tu es l'Assistant Support de Zeytna, une marketplace tunisienne qui met en relation propriétaires d'oliveraies et cueilleurs. Tu réponds en français, ton chaleureux et concis (2-4 phrases max par message).

RÈGLES ABSOLUES :
- Tu ne déclenches JAMAIS toi-même : remboursement, libération ou retrait d'escrow, annulation d'abonnement, déblocage de contact payant, ni aucune action déplaçant de l'argent ou modifiant la facturation. Tu PRÉPARES la demande via un ticket (create_ticket), puis l'utilisateur ou un admin confirme.
- Tu réponds uniquement à partir de la FAQ ci-dessous et des données que tu peux consulter avec les outils. Si tu ne sais pas, dis-le clairement et propose d'escalader — n'invente jamais.
- Après 2 échanges sans résolution claire, propose spontanément « parler à un humain » (escalate_to_human).
- Si la question porte sur un paiement précis, utilise get_my_transactions avant de répondre.

FAQ officielle :
${formatFaqForPrompt()}
`;

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_my_transactions',
      description:
        "Lit les 10 dernières transactions de l'utilisateur courant (lecture seule, scoped par RLS).",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_ticket',
      description:
        "Crée un ticket de support. À utiliser dès qu'une demande nécessite un suivi humain ou une action sensible (paiement, litige, signalement, bug reproductible).",
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['howto', 'payment', 'bug', 'report', 'other'],
          },
          subject: { type: 'string' },
          context: {
            type: 'object',
            description: "Contexte utile (transaction_id, url, étapes…).",
          },
        },
        required: ['category', 'subject'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'escalate_to_human',
      description:
        "Passe un ticket existant en statut 'escalated' et notifie l'équipe support.",
      parameters: {
        type: 'object',
        properties: {
          ticketId: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['ticketId', 'reason'],
      },
    },
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const guard = await guardRequest(req, { limit: 30, windowMs: 5 * 60 * 1000 });
  if ('response' in guard) return guard.response;
  const userId = guard.user.id;

  const authHeader = req.headers.get('Authorization') ?? '';
  // JWT-scoped client — RLS enforced. Used for anything that reads/writes user data.
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  // Service role — only used for the admin email lookup on escalation.
  const adminClient = SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    : null;

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const { message, ticketId: initialTicketId, category, history = [], pageContext } = body;
  if (!message || typeof message !== 'string') {
    return jsonResponse({ error: 'missing_message' }, 400);
  }

  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) return jsonResponse({ error: 'openai_not_configured' }, 500);

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(category ? [{ role: 'system', content: `Catégorie choisie par l'utilisateur : ${category}.` }] : []),
    ...(pageContext ? [{ role: 'system', content: `Contexte page : ${JSON.stringify(pageContext)}` }] : []),
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  let currentTicketId: string | null = initialTicketId ?? null;
  let action: 'escalated' | 'ticket_created' | null = null;

  // Single tool round-trip (v1). Enough for the current UX where the assistant
  // typically calls at most one tool per turn.
  const first = await callOpenAI(openaiKey, messages);
  if (!first.ok) {
    console.error('OpenAI error', first.status, first.detail);
    return jsonResponse({ error: 'ai_error', response: "Désolé, je n'ai pas pu répondre. Réessayez dans un instant." }, 502);
  }

  const choice = first.data.choices?.[0]?.message;
  const toolCalls = choice?.tool_calls ?? [];

  if (toolCalls.length > 0) {
    const toolResults: Array<{ tool_call_id: string; role: 'tool'; content: string }> = [];

    for (const tc of toolCalls) {
      const name = tc.function?.name;
      let args: Record<string, unknown> = {};
      try { args = JSON.parse(tc.function?.arguments ?? '{}'); } catch { /* ignore */ }

      if (name === 'get_my_transactions') {
        const { data, error } = await userClient
          .from('transactions')
          .select('id, status, amount, created_at')
          .order('created_at', { ascending: false })
          .limit(10);
        toolResults.push({
          tool_call_id: tc.id,
          role: 'tool',
          content: JSON.stringify(error ? { error: error.message } : { transactions: data ?? [] }),
        });
      } else if (name === 'create_ticket') {
        const ticketCategory = (args.category as Category) ?? category ?? 'other';
        const subject = String(args.subject ?? message.slice(0, 80));
        const ctx = { ...(args.context as object ?? {}), pageContext };
        const { data, error } = await userClient
          .from('support_tickets')
          .insert({
            user_id: userId,
            category: ticketCategory,
            status: 'ai_handling',
            subject,
            context: ctx,
          })
          .select('id')
          .single();
        if (!error && data) {
          currentTicketId = data.id;
          action = 'ticket_created';
          // Log the user's originating message on the ticket so the human agent
          // sees the full conversation later.
          await userClient.from('support_messages').insert([
            { ticket_id: data.id, role: 'user', content: message },
          ]);
        }
        toolResults.push({
          tool_call_id: tc.id,
          role: 'tool',
          content: JSON.stringify(error ? { error: error.message } : { ticketId: data?.id }),
        });
      } else if (name === 'escalate_to_human') {
        const tid = String(args.ticketId ?? currentTicketId ?? '');
        const reason = String(args.reason ?? 'Escalade demandée');
        if (!tid) {
          toolResults.push({ tool_call_id: tc.id, role: 'tool', content: JSON.stringify({ error: 'no_ticket' }) });
        } else {
          const { error } = await userClient
            .from('support_tickets')
            .update({ status: 'escalated' })
            .eq('id', tid);
          if (!error) {
            currentTicketId = tid;
            action = 'escalated';
            // Fire-and-forget email — never blocks the reply.
            if (ADMIN_SUPPORT_EMAIL && adminClient) {
              adminClient
                .from('notifications')
                .insert({
                  user_id: userId, // recipient wrapping is handled by send-notification-email
                  type: 'support_escalation',
                  title: `Escalade support (${tid.slice(0, 8)})`,
                  body: reason,
                  link: `/admin?ticket=${tid}`,
                })
                .then((r) => r.error && console.error('escalation notification error', r.error));
            } else {
              console.log('Escalation logged (no ADMIN_SUPPORT_EMAIL configured)', { tid, reason });
            }
          }
          toolResults.push({
            tool_call_id: tc.id,
            role: 'tool',
            content: JSON.stringify(error ? { error: error.message } : { ok: true }),
          });
        }
      } else {
        toolResults.push({ tool_call_id: tc.id, role: 'tool', content: JSON.stringify({ error: 'unknown_tool' }) });
      }
    }

    // Second call so the model can phrase a user-facing answer from tool results.
    const followupMessages = [...messages, choice, ...toolResults];
    const second = await callOpenAI(openaiKey, followupMessages);
    if (!second.ok) {
      console.error('OpenAI follow-up error', second.status, second.detail);
      return jsonResponse({
        response: "Votre demande a bien été enregistrée.",
        ticketId: currentTicketId ?? undefined,
        action,
      });
    }
    const finalText = second.data.choices?.[0]?.message?.content ?? "Votre demande a bien été enregistrée.";

    if (currentTicketId) {
      await userClient.from('support_messages').insert([
        { ticket_id: currentTicketId, role: 'assistant', content: finalText },
      ]);
    }

    return jsonResponse({ response: finalText, ticketId: currentTicketId ?? undefined, action });
  }

  // No tool call — plain assistant reply.
  const finalText = choice?.content ?? '';
  if (currentTicketId) {
    await userClient.from('support_messages').insert([
      { ticket_id: currentTicketId, role: 'user', content: message },
      { ticket_id: currentTicketId, role: 'assistant', content: finalText },
    ]);
  }
  return jsonResponse({ response: finalText, ticketId: currentTicketId ?? undefined, action });
});

async function callOpenAI(
  apiKey: string,
  messages: unknown[],
): Promise<{ ok: true; data: any } | { ok: false; status: number; detail: string }> {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      temperature: 0.4,
      max_tokens: 500,
    }),
  });
  if (!resp.ok) return { ok: false, status: resp.status, detail: await resp.text() };
  return { ok: true, data: await resp.json() };
}