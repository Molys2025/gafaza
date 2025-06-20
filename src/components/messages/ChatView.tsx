
import { useRef, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck, Check, Send, Smile, Image, Paperclip, MapPin, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { messageModerator } from "@/utils/messageModeration";
import PlatformBenefitsAlert from "./PlatformBenefitsAlert";
import ContactUnlock from "./ContactUnlock";

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
  recipientPhone?: string;
  recipientWhatsapp?: string;
  messages: Message[];
  applicationStatus?: 'pending' | 'accepted' | 'paid' | 'completed';
  onSendMessage: (message: string) => void;
}

const ChatView = ({ 
  conversationId, 
  recipientName, 
  recipientAvatar,
  recipientPhone,
  recipientWhatsapp,
  applicationStatus = 'pending',
  messages, 
  onSendMessage 
}: ChatViewProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<{
    show: boolean;
    type: 'contact_info' | 'external_link' | 'bypass_attempt' | null;
  }>({ show: false, type: null });
  const [showBenefitsAlert, setShowBenefitsAlert] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentUserId = "currentUser";
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Afficher périodiquement les avantages de la plateforme
  useEffect(() => {
    const timer = setInterval(() => {
      if (applicationStatus === 'pending' && Math.random() < 0.3) {
        setShowBenefitsAlert(true);
        setTimeout(() => setShowBenefitsAlert(false), 8000);
      }
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(timer);
  }, [applicationStatus]);

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case "text":
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
      case "image":
        return (
          <div className="space-y-2">
            <img 
              src={message.content} 
              alt="Image partagée" 
              className="max-w-sm rounded-lg"
            />
          </div>
        );
      case "file":
        return (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm">{message.content}</span>
          </div>
        );
      case "location":
        return (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Position partagée</span>
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Modération du message
    const moderationResult = messageModerator.moderateMessage(newMessage, applicationStatus);
    
    if (!moderationResult.isAllowed) {
      setModerationWarning({
        show: true,
        type: moderationResult.warningType
      });
      
      // Auto-hide warning après 5 secondes
      setTimeout(() => {
        setModerationWarning({ show: false, type: null });
      }, 5000);
      
      return;
    }

    onSendMessage(newMessage);
    setNewMessage("");
    setModerationWarning({ show: false, type: null });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Vérification en temps réel pour avertir l'utilisateur
    if (value.length > 10) {
      const moderationResult = messageModerator.moderateMessage(value, applicationStatus);
      if (!moderationResult.isAllowed && !moderationWarning.show) {
        setModerationWarning({
          show: true,
          type: moderationResult.warningType
        });
      } else if (moderationResult.isAllowed && moderationWarning.show) {
        setModerationWarning({ show: false, type: null });
      }
    }
    
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  // Si aucune conversation n'est sélectionnée, afficher un message
  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune conversation sélectionnée
          </h3>
          <p className="text-gray-500">
            Sélectionnez une conversation dans la liste pour commencer à discuter
          </p>
        </div>
      </div>
    );
  }

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

      {/* Alerte des avantages de la plateforme */}
      {showBenefitsAlert && (
        <div className="p-4 border-b">
          <PlatformBenefitsAlert 
            type="info" 
            onClose={() => setShowBenefitsAlert(false)}
          />
        </div>
      )}

      {/* Composant de déblocage des contacts */}
      <div className="p-4 border-b">
        <ContactUnlock
          applicationStatus={applicationStatus}
          recipientPhone={recipientPhone}
          recipientWhatsapp={recipientWhatsapp}
          onRequestContact={() => {}}
        />
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
        {/* Alerte de modération */}
        {moderationWarning.show && (
          <div className="mb-3">
            <PlatformBenefitsAlert 
              type="warning" 
              warningType={moderationWarning.type || undefined}
            />
          </div>
        )}
        
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
            <Button 
              type="submit" 
              size="sm" 
              className="px-4"
              disabled={!newMessage.trim()}
            >
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
