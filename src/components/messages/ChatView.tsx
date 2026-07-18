import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCheck, Check, Send, User, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { messageModerator } from "@/utils/messageModeration";
import type { MessageRow } from "@/services/messageService";

interface ChatViewProps {
  messages: MessageRow[];
  currentUserId: string;
  recipientName: string;
  recipientAvatar: string | null;
  isLoading?: boolean;
  isSending?: boolean;
  onSend: (content: string) => Promise<void> | void;
}

const formatTime = (value: string | null) =>
  value
    ? new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

const ChatView = ({
  messages,
  currentUserId,
  recipientName,
  recipientAvatar,
  isLoading,
  isSending,
  onSend,
}: ChatViewProps) => {
  const [draft, setDraft] = useState("");
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content) return;

    // Anti-désintermédiation : on bloque l'échange de coordonnées
    // tant que la transaction n'est pas sécurisée.
    const moderation = messageModerator.moderateMessage(content);
    if (!moderation.isAllowed) {
      setModerationWarning(
        moderation.suggestedMessage ||
          "Le partage de coordonnées n'est pas autorisé avant l'acceptation de la mission.",
      );
      return;
    }

    setModerationWarning(null);
    await onSend(content);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {recipientAvatar ? (
            <img src={recipientAvatar} alt={recipientName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="font-medium text-olive-dark">{recipientName}</div>
      </div>

      {/* Fil */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-olive" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            Aucun message. Écrivez le premier.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isMine = message.sender_id === currentUserId;

              return (
                <div
                  key={message.id}
                  className={cn("flex", isMine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                      isMine ? "bg-olive text-white" : "bg-gray-100 text-gray-800",
                    )}
                  >
                    <p className="whitespace-pre-line break-words">{message.content}</p>
                    <div
                      className={cn(
                        "flex items-center gap-1 mt-1 text-[10px]",
                        isMine ? "text-white/70 justify-end" : "text-gray-400",
                      )}
                    >
                      {formatTime(message.created_at)}
                      {isMine &&
                        (message.status === "read" ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Saisie */}
      <div className="border-t p-4 space-y-2">
        {moderationWarning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{moderationWarning}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Écrivez votre message..."
            rows={2}
            className="resize-none"
          />
          <Button
            onClick={handleSend}
            className="bg-olive hover:bg-olive-dark self-end"
            disabled={isSending || !draft.trim()}
            aria-label="Envoyer le message"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
