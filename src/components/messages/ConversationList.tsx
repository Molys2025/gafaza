import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/services/messageService";

interface ConversationListProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
}

const formatTimestamp = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const sameDay = date.toDateString() === new Date().toDateString();

  return sameDay
    ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
};

const ConversationList = ({ conversations, selectedId, onSelect }: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Aucune conversation
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <button
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3",
              selectedId === conversation.id && "bg-olive/5",
            )}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {conversation.otherParticipant?.picture ? (
                <img
                  src={conversation.otherParticipant.picture}
                  alt={conversation.otherParticipant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-olive-dark truncate">
                  {conversation.otherParticipant?.name ?? "Utilisateur"}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {formatTimestamp(conversation.last_message_at)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage ?? "Nouvelle conversation"}
                </span>
                {conversation.unreadCount > 0 && (
                  <span className="flex-shrink-0 bg-olive text-white text-xs rounded-full px-2 py-0.5">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ConversationList;
