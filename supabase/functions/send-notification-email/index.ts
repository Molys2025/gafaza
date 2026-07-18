// Sends the email counterpart of an in-app notification.
//
// Triggered by a Supabase Database Webhook on INSERT into public.notifications
// (configured once in the dashboard). The webhook posts the inserted row; this
// function resolves the recipient's email, checks their opt-out preference and
// delivers via Resend.
//
// Auth model: this is a server-to-server call, not a signed-in user. The
// webhook must send a shared secret in the `x-webhook-secret` header, matched
// against the NOTIFICATION_WEBHOOK_SECRET env var. No secret lives in git.
//
// Required env (Edge Function secrets):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (read user email + prefs)
//   RESEND_API_KEY                           (send)
//   NOTIFICATION_FROM                        (e.g. "Zeytna <no-reply@ton-domaine.tn>")
//   NOTIFICATION_WEBHOOK_SECRET              (shared with the DB webhook)
//   APP_BASE_URL (optional)                  (prefix for notification links)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  // 1. Verify the shared webhook secret.
  const expected = Deno.env.get('NOTIFICATION_WEBHOOK_SECRET');
  if (!expected || req.headers.get('x-webhook-secret') !== expected) {
    return json({ error: 'unauthorized' }, 401);
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('NOTIFICATION_FROM');
  if (!resendKey || !from) {
    return json({ error: 'email not configured' }, 500);
  }

  // 2. Extract the notification row from the webhook payload.
  //    Supabase DB webhooks send { type, table, record, old_record, ... }.
  let record: NotificationRow;
  try {
    const payload = await req.json();
    record = (payload.record ?? payload) as NotificationRow;
  } catch {
    return json({ error: 'invalid payload' }, 400);
  }
  if (!record?.user_id || !record?.title) {
    return json({ error: 'missing fields' }, 400);
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // 3. Respect the recipient's email opt-out.
  const { data: prefs } = await admin
    .from('notification_preferences')
    .select('email_enabled')
    .eq('user_id', record.user_id)
    .maybeSingle();
  if (prefs && prefs.email_enabled === false) {
    return json({ skipped: 'email disabled by user' });
  }

  // 4. Resolve the recipient email from auth.
  const { data: userRes, error: userErr } = await admin.auth.admin.getUserById(record.user_id);
  const email = userRes?.user?.email;
  if (userErr || !email) {
    return json({ error: 'recipient email not found' }, 404);
  }

  // 5. Build and send the email.
  const base = Deno.env.get('APP_BASE_URL') ?? '';
  const actionUrl = record.link ? `${base}${record.link}` : base || null;
  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:auto">
      <h2 style="color:#4d5c2e">${escapeHtml(record.title)}</h2>
      ${record.body ? `<p style="color:#333;font-size:15px">${escapeHtml(record.body)}</p>` : ''}
      ${actionUrl ? `<p><a href="${actionUrl}" style="display:inline-block;background:#4d5c2e;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Ouvrir Zeytna</a></p>` : ''}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">Vous recevez cet email car les notifications par email sont activées sur votre compte Zeytna. Vous pouvez les désactiver dans Mon compte.</p>
    </div>`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [email], subject: record.title, html }),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    console.error('Resend error', resp.status, detail);
    return json({ error: 'send failed', status: resp.status }, 502);
  }

  return json({ sent: true });
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
