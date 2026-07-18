import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ConversationList from "@/components/messages/ConversationList";
import ChatView from "@/components/messages/ChatView";
import {
  getMyConversations,
  getMessages,
  sendMessage,
  markConversationAsRead,
  getOrCreateConversation,
  subscribeToConversation,
  type ConversationSummary,
  type MessageRow,
} from "@/services/messageService";

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Guards the one-shot conversation opening driven by ?user=<id>.
  const pendingContactRef = useRef<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!user) return [];
    setIsLoadingConversations(true);
    setLoadError(null);
    try {
      const data = await getMyConversations(user.id);
      setConversations(data);
      return data;
    } catch (error: any) {
      console.error("Error loading conversations:", error);
      setLoadError(error?.message || "Erreur lors du chargement des conversations");
      return [];
    } finally {
      setIsLoadingConversations(false);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ?user=<id> opens (or creates) the conversation with that person, so the
  // "Contacter" buttons elsewhere in the app can deep-link here.
  useEffect(() => {
    const contactId = searchParams.get("user");
    if (!user || !contactId || pendingContactRef.current === contactId) return;

    pendingContactRef.current = contactId;
    const jobId = searchParams.get("job");

    getOrCreateConversation(user.id, contactId, jobId)
      .then(async (conversationId) => {
        setSelectedId(conversationId);
        await loadConversations();
        setSearchParams({}, { replace: true });
      })
      .catch((error: any) => {
        console.error("Error opening conversation:", error);
        toast({
          title: "Erreur",
          description: error?.message || "Impossible d'ouvrir la conversation.",
          variant: "destructive",
        });
      });
  }, [user, searchParams, setSearchParams, loadConversations, toast]);

  // Messages of the selected conversation + realtime subscription.
  useEffect(() => {
    if (!selectedId || !user) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setIsLoadingMessages(true);

    getMessages(selectedId)
      .then((data) => {
        if (cancelled) return;
        setMessages(data);
        return markConversationAsRead(selectedId, user.id);
      })
      .catch((error: any) => {
        console.error("Error loading messages:", error);
        toast({
          title: "Erreur",
          description: error?.message || "Erreur lors du chargement des messages.",
          variant: "destructive",
        });
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMessages(false);
      });

    const channel = subscribeToConversation(selectedId, (message) => {
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
      // A message coming in while the thread is open is read straight away.
      if (message.receiver_id === user.id) {
        markConversationAsRead(selectedId, user.id);
      }
    });

    return () => {
      cancelled = true;
      channel.unsubscribe();
    };
  }, [selectedId, user, toast]);

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  const handleSend = async (content: string) => {
    if (!user || !selectedConversation?.otherParticipant) return;

    setIsSending(true);
    try {
      const message = await sendMessage(
        selectedConversation.id,
        user.id,
        selectedConversation.otherParticipant.id,
        content,
        selectedConversation.job_id,
      );
      // Optimistic append: the realtime echo is de-duplicated by id.
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
      loadConversations();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Le message n'a pas pu être envoyé.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-olive-dark mb-6">Messages</h1>

      {loadError ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-red-600 mb-4">{loadError}</div>
          <Button variant="outline" onClick={loadConversations}>Réessayer</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden grid md:grid-cols-3 h-[70vh]">
          {/* Liste des conversations */}
          <div
            className={cn(
              "md:col-span-1 border-r overflow-y-auto",
              isMobile && selectedId && "hidden",
            )}
          >
            {isLoadingConversations ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-olive" />
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Fil sélectionné */}
          <div
            className={cn(
              "md:col-span-2 flex flex-col",
              isMobile && !selectedId && "hidden",
            )}
          >
            {selectedConversation ? (
              <>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="m-2 self-start"
                    onClick={() => setSelectedId(null)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Conversations
                  </Button>
                )}
                <div className="flex-1 min-h-0">
                  <ChatView
                    messages={messages}
                    currentUserId={user.id}
                    recipientName={selectedConversation.otherParticipant?.name ?? "Utilisateur"}
                    recipientAvatar={selectedConversation.otherParticipant?.picture ?? null}
                    isLoading={isLoadingMessages}
                    isSending={isSending}
                    onSend={handleSend}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Inbox className="h-10 w-10 text-gray-300 mb-3" />
                <div className="text-gray-500 mb-2">
                  {conversations.length === 0
                    ? "Vous n'avez pas encore de conversation"
                    : "Sélectionnez une conversation"}
                </div>
                {conversations.length === 0 && (
                  <Button
                    className="bg-olive hover:bg-olive-dark mt-2"
                    onClick={() => navigate("/jobs")}
                  >
                    Parcourir les annonces
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
