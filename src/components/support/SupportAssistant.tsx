import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, HelpCircle, CreditCard, Bug, LifeBuoy, Send, CheckCircle2 } from 'lucide-react';

type Category = 'howto' | 'payment' | 'bug' | 'report' | 'other';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MenuOption {
  key: 'howto' | 'payment' | 'bug' | 'escalate';
  label: string;
  icon: typeof HelpCircle;
  category: Category;
  seed: string;
}

const MENU: MenuOption[] = [
  {
    key: 'howto',
    label: 'Comment ça marche ?',
    icon: HelpCircle,
    category: 'howto',
    seed: "J'aimerais comprendre comment fonctionne Zeytna.",
  },
  {
    key: 'payment',
    label: 'Où en est mon paiement ?',
    icon: CreditCard,
    category: 'payment',
    seed: 'Peux-tu vérifier où en est mon dernier paiement ?',
  },
  {
    key: 'bug',
    label: 'Signaler un bug',
    icon: Bug,
    category: 'bug',
    seed: "Je rencontre un bug que je souhaite signaler.",
  },
  {
    key: 'escalate',
    label: 'Parler à un humain',
    icon: LifeBuoy,
    category: 'other',
    seed: "Je souhaite parler directement à un membre de l'équipe.",
  },
];

const SupportAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<Category | undefined>();
  const [ticketId, setTicketId] = useState<string | undefined>();
  const [escalated, setEscalated] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const pageContext = useMemo(
    () => ({
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    }),
    [],
  );

  const sendMessage = useCallback(
    async (text: string, cat?: Category) => {
      if (!user) {
        toast({ title: 'Connexion requise', description: 'Connectez-vous pour utiliser le support.', variant: 'destructive' });
        return;
      }
      const trimmed = text.trim();
      if (!trimmed) return;

      const effectiveCategory = cat ?? category;
      if (cat) setCategory(cat);

      const nextMessages = [...messages, { role: 'user' as const, content: trimmed }];
      setMessages(nextMessages);
      setInput('');
      setLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke('support-assistant', {
          body: {
            message: trimmed,
            ticketId,
            category: effectiveCategory,
            history: messages,
            pageContext,
          },
        });
        if (error) throw error;

        const responseText: string = data?.response ?? "Je n'ai pas de réponse pour l'instant.";
        setMessages([...nextMessages, { role: 'assistant', content: responseText }]);
        if (data?.ticketId) setTicketId(data.ticketId);
        if (data?.action === 'escalated') setEscalated(true);
      } catch (err) {
        console.error('support-assistant error', err);
        toast({
          title: 'Erreur',
          description: "Impossible de contacter l'assistant, réessayez.",
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [user, category, messages, ticketId, pageContext, toast],
  );

  const handleMenuClick = (option: MenuOption) => {
    sendMessage(option.seed, option.category);
  };

  const showMenu = messages.length === 0;

  return (
    <Card className="border-olive/20 bg-sand-light/40 p-4 md:p-6">
      {showMenu && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MENU.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleMenuClick(opt)}
                className="flex items-center gap-3 rounded-lg border border-olive/30 bg-white p-4 text-left transition hover:border-olive hover:bg-sand-light"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-olive/10 text-olive">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium text-olive-dark">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto bg-olive text-white'
                  : 'mr-auto bg-white text-olive-dark border border-olive/15'
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="mr-auto flex items-center gap-2 rounded-2xl border border-olive/15 bg-white px-4 py-2 text-sm text-olive-dark">
              <Loader2 className="h-4 w-4 animate-spin" /> L'assistant réfléchit…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {escalated && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-olive/30 bg-olive/5 p-3 text-sm text-olive-dark">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-olive" />
          <div>
            <div className="font-medium">Votre demande a été transmise à l'équipe</div>
            <div className="text-olive-dark/80">Un membre du support Zeytna vous recontactera très vite.</div>
          </div>
        </div>
      )}

      <form
        className="mt-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={showMenu ? 'Ou décrivez votre besoin…' : 'Votre message…'}
          disabled={loading}
          className="flex-1 bg-white"
        />
        <Button type="submit" disabled={loading || !input.trim()} className="bg-olive hover:bg-olive-dark">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
};

export default SupportAssistant;