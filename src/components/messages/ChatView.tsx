
import { useRef, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck, Check, Send, Smile, Image, Paperclip, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const [isTyping, setIsTyping] = useState(false);
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

  // Simulate typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      // In a real app, you would send a typing indicator to the backend here
      setTimeout(() => setIsTyping(false), 3000);
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
              <Paperclip className="h-4 w-4" />
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
            <div className="bg-white p-2 text-sm flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Localisation partagée</span>
            </div>
          </div>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <img src={recipientAvatar} alt={recipientName} />
          </Avatar>
          <div>
            <h3 className="font-medium">{recipientName}</h3>
            <span className="text-xs text-green-500">En ligne</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
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
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex flex-col gap-2">
          <Textarea 
            placeholder="Tapez votre message..." 
            value={newMessage}
            onChange={handleTyping}
            className="min-h-[60px] resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <Image className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            <Button type="submit" size="sm" className="px-4">
              <Send className="h-4 w-4 mr-1" />
              Envoyer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
