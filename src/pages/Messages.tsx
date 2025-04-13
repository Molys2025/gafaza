
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationList from "@/components/messages/ConversationList";
import ChatView from "@/components/messages/ChatView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, Archive, Inbox, Bell, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "image" | "text" | "file" | "location";
}

interface Conversation {
  id: string;
  user: User;
  lastMessage: {
    text: string;
    timestamp: string;
    read: boolean;
  };
  unread: number;
  status: "normal" | "important" | "archived";
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mock conversation data
  const allConversations: Conversation[] = [
    {
      id: "conv1",
      user: {
        id: "user1",
        name: "Ahmed Ben Ali",
        avatar: "/placeholder.svg",
        online: true,
      },
      lastMessage: {
        text: "J'ai une oliveraie à Nabeul, êtes-vous disponible en Novembre?",
        timestamp: "10:30",
        read: false,
      },
      unread: 2,
      status: "normal",
    },
    {
      id: "conv2",
      user: {
        id: "user2",
        name: "Leila Turki",
        avatar: "/placeholder.svg",
        online: false,
      },
      lastMessage: {
        text: "Nous avons besoin de 5 cueilleurs pour notre oliveraie à Sfax",
        timestamp: "Hier",
        read: true,
      },
      unread: 0,
      status: "important",
    },
    {
      id: "conv3",
      user: {
        id: "user3",
        name: "Mohamed Kassem",
        avatar: "/placeholder.svg",
        online: true,
      },
      lastMessage: {
        text: "Pouvez-vous partager votre tarif journalier?",
        timestamp: "Lun",
        read: true,
      },
      unread: 0,
      status: "normal",
    },
    {
      id: "conv4",
      user: {
        id: "user4",
        name: "Sami Maatoug",
        avatar: "/placeholder.svg",
        online: false,
      },
      lastMessage: {
        text: "Je confirme le rendez-vous pour le 15 octobre",
        timestamp: "12/09",
        read: true,
      },
      unread: 0,
      status: "archived",
    },
  ];

  // Filter conversations based on the active tab
  const getFilteredConversations = (): Conversation[] => {
    switch (activeTab) {
      case "all":
        return allConversations.filter(
          (conv) => conv.status !== "archived"
        );
      case "unread":
        return allConversations.filter(
          (conv) => conv.unread > 0 && conv.status !== "archived"
        );
      case "important":
        return allConversations.filter(
          (conv) => conv.status === "important"
        );
      case "archived":
        return allConversations.filter(
          (conv) => conv.status === "archived"
        );
      default:
        return allConversations;
    }
  };

  // Get the selected conversation
  const getSelectedConversation = (): Conversation | undefined => {
    return allConversations.find((conv) => conv.id === selectedConversation);
  };

  // Mock message data for the selected conversation
  const getMessagesForConversation = (): MessageItem[] => {
    if (!selectedConversation) return [];

    return [
      {
        id: "msg1",
        senderId: "user1",
        content: "Bonjour, j'ai une oliveraie à Nabeul d'environ 3 hectares.",
        timestamp: "10:15",
        read: true,
        type: "text",
      },
      {
        id: "msg2",
        senderId: "currentUser",
        content: "Bonjour! Je suis intéressé. Combien d'oliviers environ?",
        timestamp: "10:18",
        read: true,
        type: "text",
      },
      {
        id: "msg3",
        senderId: "user1",
        content: "Environ 300 oliviers. Êtes-vous disponible en Novembre?",
        timestamp: "10:20",
        read: true,
        type: "text",
      },
      {
        id: "msg4",
        senderId: "user1",
        content: "Voici une photo de l'oliveraie",
        timestamp: "10:25",
        read: true,
        type: "image",
      },
      {
        id: "msg5",
        senderId: "currentUser",
        content: "Elle semble en bon état. Je suis disponible du 10 au 25 novembre.",
        timestamp: "10:28",
        read: true,
        type: "text",
      },
      {
        id: "msg6",
        senderId: "user1",
        content: "Parfait. Voici la localisation exacte de l'oliveraie.",
        timestamp: "10:30",
        read: false,
        type: "location",
      },
      {
        id: "msg7",
        senderId: "user1",
        content: "Et voici le contrat type pour les cueilleurs.",
        timestamp: "10:32",
        read: false,
        type: "file",
      },
    ];
  };

  // Handle sending a new message
  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    // In a real app, this would send the message to Supabase
  };

  // Mobile view with conversation/chat sheets
  if (isMobile) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messagerie</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {!selectedConversation ? (
          <div className="space-y-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  <span className="hidden sm:inline">Tous</span>
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex items-center gap-2">
                  <span>Non lus</span>
                </TabsTrigger>
                <TabsTrigger value="important" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Importants</span>
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  <span className="hidden sm:inline">Archivés</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="h-[calc(100vh-220px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="unread" className="h-[calc(100vh-220px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="important" className="h-[calc(100vh-220px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="archived" className="h-[calc(100vh-220px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="h-[calc(100vh-120px)] border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <ChatView 
              conversationId={selectedConversation}
              recipientName={getSelectedConversation()?.user.name || ""}
              recipientAvatar={getSelectedConversation()?.user.avatar || ""}
              messages={getMessagesForConversation()}
              onSendMessage={handleSendMessage}
            />
            <div className="p-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedConversation(null)}
                className="w-full"
              >
                Retour aux conversations
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view with split layout
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messagerie</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Mode "Ne pas déranger"
              </DropdownMenuItem>
              <DropdownMenuItem>
                Exporter les conversations
              </DropdownMenuItem>
              <DropdownMenuItem>
                Paramètres de notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)]">
        <div className="w-full md:w-1/3 flex flex-col border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  <span className="hidden sm:inline">Tous</span>
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Non lus</span>
                </TabsTrigger>
                <TabsTrigger value="important" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Importants</span>
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  <span className="hidden sm:inline">Archivés</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="h-[calc(100vh-280px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="unread" className="h-[calc(100vh-280px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="important" className="h-[calc(100vh-280px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="archived" className="h-[calc(100vh-280px)] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 border rounded-lg shadow-sm overflow-hidden">
          {selectedConversation ? (
            <ChatView 
              conversationId={selectedConversation}
              recipientName={getSelectedConversation()?.user.name || ""}
              recipientAvatar={getSelectedConversation()?.user.avatar || ""}
              messages={getMessagesForConversation()}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune conversation sélectionnée
                </h3>
                <p className="text-gray-500 mb-4">
                  Sélectionnez une conversation dans la liste pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
