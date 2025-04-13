import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationList from "@/components/messages/ConversationList";
import ChatView from "@/components/messages/ChatView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, Archive, Inbox } from "lucide-react";

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
    ];
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Messagerie</h1>
      
      <div className="flex flex-col md:flex-row gap-6 h-[700px]">
        <div className="w-full md:w-1/3 flex flex-col border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="relative mb-4">
              <Input placeholder="Rechercher une conversation..." className="pl-9" />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            
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
              
              <TabsContent value="all" className="h-[550px] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="unread" className="h-[550px] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="important" className="h-[550px] overflow-y-auto">
                <ConversationList 
                  conversations={getFilteredConversations()}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              
              <TabsContent value="archived" className="h-[550px] overflow-y-auto">
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
              onSendMessage={(message) => console.log("Sending message:", message)}
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
