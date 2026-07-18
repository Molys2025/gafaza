import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { RealtimeChannel } from '@supabase/supabase-js';

// The generated Database types don't yet include the notifications tables
// (regenerate types.ts after the migration is applied). Until then we type the
// rows locally and access the tables through an untyped view of the client.
const db = supabase as unknown as {
  from: (table: string) => any;
};

export type NotificationType =
  | 'application_received'
  | 'application_status'
  | 'new_message'
  | 'mission_to_rate'
  | 'rating_received';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType | string;
  title: string;
  body: string | null;
  link: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

const PAGE_SIZE = 30;

/** Most recent notifications for the current user, newest first. */
export const getMyNotifications = async (
  userId: string,
  limit = PAGE_SIZE,
): Promise<AppNotification[]> => {
  const { data, error } = await db
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Error fetching notifications:', error);
    throw new Error(`Erreur lors de la récupération des notifications: ${error.message}`);
  }
  return (data ?? []) as AppNotification[];
};

/** Count of unread notifications, for the badge. */
export const getUnreadCount = async (userId: string): Promise<number> => {
  const { count, error } = await db
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    logger.error('Error counting notifications:', error);
    return 0;
  }
  return count ?? 0;
};

export const markAsRead = async (id: string): Promise<void> => {
  const { error } = await db.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) logger.error('Error marking notification read:', error);
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  const { error } = await db
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) logger.error('Error marking all notifications read:', error);
};

/**
 * Subscribes to new notifications for a user via Realtime.
 * Returns the channel so the caller can unsubscribe on unmount.
 */
export const subscribeToNotifications = (
  userId: string,
  onInsert: (n: AppNotification) => void,
): RealtimeChannel => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onInsert(payload.new as AppNotification),
    )
    .subscribe();
};

// ---- Email preferences -------------------------------------------------

export const getEmailEnabled = async (userId: string): Promise<boolean> => {
  const { data, error } = await db
    .from('notification_preferences')
    .select('email_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    logger.error('Error fetching notification preferences:', error);
  }
  // Default: opted in when no row exists yet.
  return data ? data.email_enabled !== false : true;
};

export const setEmailEnabled = async (userId: string, enabled: boolean): Promise<void> => {
  const { error } = await db
    .from('notification_preferences')
    .upsert({ user_id: userId, email_enabled: enabled, updated_at: new Date().toISOString() });
  if (error) {
    logger.error('Error updating notification preferences:', error);
    throw new Error(`Erreur lors de la mise à jour des préférences: ${error.message}`);
  }
};
