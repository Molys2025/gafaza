
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface Message {
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
  unread: number;
  status: "normal" | "important" | "archived";
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ConversationList = ({ conversations, selectedId, onSelect }: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucune conversation trouvée
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
            selectedId === conversation.id && "bg-gray-100 hover:bg-gray-100",
            conversation.status === "archived" && "opacity-70"
          )}
          onClick={() => onSelect(conversation.id)}
        >
          <div className="flex items-start">
            <div className="relative mr-3">
              <Avatar className="h-10 w-10">
                <img src={conversation.user.avatar} alt={conversation.user.name} />
              </Avatar>
              {conversation.user.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 truncate">
                  {conversation.user.name}
                </h4>
                <div className="flex items-center space-x-1">
                  {conversation.status === "important" && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-500">
                    {conversation.lastMessage.timestamp}
                  </span>
                </div>
              </div>
              
              <p className={cn(
                "text-sm truncate mt-1",
                conversation.unread > 0 ? "font-medium text-gray-900" : "text-gray-500"
              )}>
                {conversation.lastMessage.text}
              </p>
              
              {conversation.unread > 0 && (
                <div className="mt-1 flex justify-end">
                  <span className="bg-olive text-white text-xs rounded-full px-2 py-0.5">
                    {conversation.unread}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
