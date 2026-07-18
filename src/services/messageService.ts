import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type MessageRow = Database['public']['Tables']['messages']['Row'];
export type ConversationRow = Database['public']['Tables']['conversations']['Row'];

/** A conversation plus the resolved other participant and its last message. */
export interface ConversationSummary extends ConversationRow {
  otherParticipant: {
    id: string;
    name: string;
    picture: string | null;
  } | null;
  lastMessage: string | null;
  unreadCount: number;
}

/**
 * Finds the existing one-to-one conversation or creates it.
 * Backed by the get_or_create_conversation RPC so the lookup and the
 * insert stay in a single round trip.
 */
export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string,
  jobId?: string | null,
): Promise<string> => {
  const { data, error } = await supabase.rpc('get_or_create_conversation', {
    user1_id: currentUserId,
    user2_id: otherUserId,
    job_id_param: jobId ?? undefined,
  });

  if (error) {
    console.error('Error creating conversation:', error);
    throw new Error(`Erreur lors de l'ouverture de la conversation: ${error.message}`);
  }

  return data as string;
};

/** Conversations of the caller, most recent first, with participant details. */
export const getMyConversations = async (userId: string): Promise<ConversationSummary[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw new Error(`Erreur lors de la récupération des conversations: ${error.message}`);
  }

  const conversations = data || [];
  if (conversations.length === 0) return [];

  const otherIds = [...new Set(
    conversations
      .map(c => (c.participant1_id === userId ? c.participant2_id : c.participant1_id))
      .filter(Boolean) as string[],
  )];

  // public.users only exposes active rows to other users, so a missing
  // profile degrades to an unnamed participant rather than failing.
  const { data: users } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_picture')
    .in('id', otherIds);

  const usersById = new Map((users || []).map(u => [u.id, u]));

  // Last message + unread count per conversation, in one query.
  const { data: messages } = await supabase
    .from('messages')
    .select('conversation_id, content, created_at, receiver_id, status')
    .in('conversation_id', conversations.map(c => c.id))
    .order('created_at', { ascending: false });

  const lastByConversation = new Map<string, string>();
  const unreadByConversation = new Map<string, number>();

  for (const message of messages || []) {
    if (!message.conversation_id) continue;
    if (!lastByConversation.has(message.conversation_id)) {
      lastByConversation.set(message.conversation_id, message.content ?? '');
    }
    if (message.receiver_id === userId && message.status !== 'read') {
      unreadByConversation.set(
        message.conversation_id,
        (unreadByConversation.get(message.conversation_id) ?? 0) + 1,
      );
    }
  }

  return conversations.map(conversation => {
    const otherId = conversation.participant1_id === userId
      ? conversation.participant2_id
      : conversation.participant1_id;
    const other = otherId ? usersById.get(otherId) : null;

    return {
      ...conversation,
      otherParticipant: otherId
        ? {
            id: otherId,
            name: other
              ? `${other.first_name || ''} ${other.last_name || ''}`.trim() || 'Utilisateur'
              : 'Utilisateur',
            picture: other?.profile_picture ?? null,
          }
        : null,
      lastMessage: lastByConversation.get(conversation.id) ?? null,
      unreadCount: unreadByConversation.get(conversation.id) ?? 0,
    };
  });
};

export const getMessages = async (conversationId: string): Promise<MessageRow[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw new Error(`Erreur lors de la récupération des messages: ${error.message}`);
  }

  return data || [];
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string,
  jobId?: string | null,
): Promise<MessageRow> => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      job_id: jobId ?? null,
      message_type: 'text',
      status: 'sent',
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
  }

  return data;
};

/** Marks every message received by the user in this conversation as read. */
export const markConversationAsRead = async (
  conversationId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('receiver_id', userId)
    .neq('status', 'read');

  // Non-blocking: failing to flag messages as read must not break the chat.
  if (error) {
    console.error('Error marking conversation as read:', error);
  }
};

/**
 * Subscribes to new messages of a conversation.
 * Returns the channel so the caller can unsubscribe on unmount.
 */
export const subscribeToConversation = (
  conversationId: string,
  onMessage: (message: MessageRow) => void,
): RealtimeChannel => {
  return supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as MessageRow),
    )
    .subscribe();
};
