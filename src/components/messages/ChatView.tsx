
import { useRef, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck, Check, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "text" | "image" | "file" | "location";
}

interface ChatViewProps {
  conversationId: string;
  recipientName: string;
  recipientAvatar: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatView = ({ 
  conversationId, 
  recipientName, 
  recipientAvatar, 
  messages, 
  onSendMessage 
}: ChatViewProps) => {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentUserId = "currentUser"; // This would normally come from authentication
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case "image":
        return (
          <div className="rounded-lg overflow-hidden max-w-xs">
            <img 
              src="/placeholder.svg" 
              alt="Image" 
              className="w-full h-auto object-cover"
            />
          </div>
        );
      case "file":
        return (
          <div className="bg-gray-100 rounded-lg p-3 flex items-center">
            <div className="bg-gray-200 p-2 rounded mr-3">
              {/* File icon would go here */}
            </div>
            <div>
              <div className="font-medium">Document.pdf</div>
              <div className="text-xs text-gray-500">2.4 MB</div>
            </div>
          </div>
        );
      case "location":
        return (
          <div className="rounded-lg overflow-hidden max-w-xs">
            <img 
              src="/placeholder.svg" 
              alt="Location" 
              className="w-full h-32 object-cover"
            />
            <div className="bg-white p-2 text-sm">Localisation partagée</div>
          </div>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <img src={recipientAvatar} alt={recipientName} />
        </Avatar>
        <div>
          <h3 className="font-medium">{recipientName}</h3>
        </div>
      </div>
      
      <ScrollArea 
        className="flex-1 p-4 bg-gray-50"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message) => {
            const isSelf = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id} 
                className={cn(
                  "flex",
                  isSelf ? "justify-end" : "justify-start"
                )}
              >
                <div className="flex max-w-[80%]">
                  {!isSelf && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <img src={recipientAvatar} alt={recipientName} />
                    </Avatar>
                  )}
                  
                  <div>
                    <div 
                      className={cn(
                        "rounded-lg p-3",
                        isSelf 
                          ? "bg-olive text-white rounded-tr-none" 
                          : "bg-white border rounded-tl-none"
                      )}
                    >
                      {renderMessageContent(message)}
                    </div>
                    
                    <div 
                      className={cn(
                        "flex items-center mt-1 text-xs text-gray-500",
                        isSelf ? "justify-end" : "justify-start"
                      )}
                    >
                      <span>{message.timestamp}</span>
                      {isSelf && (
                        <span className="ml-1">
                          {message.read ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input 
          type="text" 
          placeholder="Tapez votre message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatView;
