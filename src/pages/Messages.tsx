
import { useState } from "react";
import { 
  Search, 
  MessageCircle, 
  Archive, 
  Star, 
  Send, 
  Image, 
  Paperclip, 
  MapPin,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ConversationList from "@/components/messages/ConversationList";
import ChatView from "@/components/messages/ChatView";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockConversations = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Ahmed Ben Ali",
      avatar: "/placeholder.svg",
      online: true,
    },
    lastMessage: {
      text: "Bonjour, je suis intéressé par votre oliverie...",
      timestamp: "09:45",
      read: true,
    },
    unread: 0,
    status: "normal",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Fatima Zahra",
      avatar: "/placeholder.svg",
      online: false,
    },
    lastMessage: {
      text: "Est-ce que vous êtes disponible pour la récolte en Novembre?",
      timestamp: "Hier",
      read: false,
    },
    unread: 3,
    status: "important",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Mohamed Karim",
      avatar: "/placeholder.svg",
      online: false,
    },
    lastMessage: {
      text: "Merci pour votre aide pendant la saison dernière",
      timestamp: "15/03/24",
      read: true,
    },
    unread: 0,
    status: "archived",
  },
];

// Mock message data
const mockMessages = [
  {
    id: "m1",
    senderId: "u2",
    content: "Bonjour, je recherche des cueilleurs pour la saison prochaine",
    timestamp: "10:30",
    read: true,
    type: "text",
  },
  {
    id: "m2",
    senderId: "self",
    content: "Bonjour! Oui, je suis disponible. Pour quelle période avez-vous besoin de cueilleurs?",
    timestamp: "10:32",
    read: true,
    type: "text",
  },
  {
    id: "m3",
    senderId: "u2",
    content: "Nous prévoyons de commencer la récolte mi-novembre",
    timestamp: "10:35",
    read: true,
    type: "text",
  },
  {
    id: "m4",
    senderId: "u2",
    content: "Voici une photo de notre domaine",
    timestamp: "10:36",
    read: true,
    type: "text",
  },
  {
    id: "m5",
    senderId: "u2",
    content: "/placeholder.svg",
    timestamp: "10:36",
    read: true,
    type: "image",
  },
  {
    id: "m6",
    senderId: "self",
    content: "C'est magnifique! Je suis disponible à partir du 10 novembre. Quel est votre tarif journalier?",
    timestamp: "10:40",
    read: false,
    type: "text",
  },
];

const Messages = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<string | null>("2");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const filteredConversations = mockConversations.filter((conv) => {
    // Filter based on tab
    if (activeTab === "unread" && conv.unread === 0) return false;
    if (activeTab === "archived" && conv.status !== "archived") return false;
    if (activeTab === "important" && conv.status !== "important") return false;
    
    // Filter based on search
    if (searchQuery && !conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Here we would typically send the message to a backend
    // For demo, we'll just show a toast
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès.",
    });
    
    setNewMessage("");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-olive-dark mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Conversations Panel */}
        <div className="md:col-span-4 lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Rechercher..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="px-4 py-2">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="unread">Non lus</TabsTrigger>
                <TabsTrigger value="important">
                  <Star className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="archived">
                  <Archive className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="flex-1 h-[calc(100%-120px)]">
              <TabsContent value="all" className="m-0">
                <ConversationList 
                  conversations={filteredConversations} 
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <ConversationList 
                  conversations={filteredConversations} 
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              <TabsContent value="important" className="m-0">
                <ConversationList 
                  conversations={filteredConversations} 
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              <TabsContent value="archived" className="m-0">
                <ConversationList 
                  conversations={filteredConversations} 
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        {/* Chat Panel */}
        <div className="md:col-span-8 lg:col-span-9 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-white">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <img 
                      src={mockConversations.find(c => c.id === selectedConversation)?.user.avatar} 
                      alt="Avatar" 
                    />
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {mockConversations.find(c => c.id === selectedConversation)?.user.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      {mockConversations.find(c => c.id === selectedConversation)?.user.online ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          En ligne
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                          Hors ligne
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Star className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Archive className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Chat Messages */}
              <ChatView 
                messages={mockMessages} 
                currentUserId="self" 
              />
              
              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <div className="flex-1 flex items-center relative">
                    <Input 
                      placeholder="Écrivez votre message..." 
                      className="pr-24"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Vos messages</h3>
              <p className="text-gray-500 max-w-md text-center mt-2">
                Sélectionnez une conversation ou commencez une nouvelle discussion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
