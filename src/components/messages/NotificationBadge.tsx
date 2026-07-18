import { useState, useEffect, useCallback } from "react";
import { Bell, MessageSquare, Briefcase, Star, CheckCircle, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
  type AppNotification,
} from "@/services/notificationService";

const ICONS: Record<string, JSX.Element> = {
  new_message: <MessageSquare className="h-4 w-4" />,
  application_received: <Briefcase className="h-4 w-4" />,
  application_status: <CheckCircle className="h-4 w-4" />,
  mission_to_rate: <ClipboardCheck className="h-4 w-4" />,
  rating_received: <Star className="h-4 w-4" />,
};

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
};

const NotificationBadge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setNotifications(await getMyNotifications(user.id));
    } catch {
      /* silent: the badge must never break the navbar */
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    load();
    const channel = subscribeToNotifications(user.id, (n) => {
      setNotifications((prev) => [n, ...prev].slice(0, 30));
    });
    return () => {
      channel.unsubscribe();
    };
  }, [user, load]);

  const handleClick = async (n: AppNotification) => {
    if (!n.is_read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      await markAsRead(n.id);
    }
    setIsOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleMarkAll = async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await markAllAsRead(user.id);
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={handleMarkAll}
            >
              Tout marquer comme lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-gray-500 text-sm">Aucune notification</div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`p-3 cursor-pointer ${n.is_read ? "opacity-70" : "font-medium"}`}
              onClick={() => handleClick(n)}
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="p-2 rounded-full bg-olive/10 text-olive shrink-0">
                  {ICONS[n.type] ?? <Bell className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{n.title}</div>
                  {n.body && <div className="text-xs text-gray-500 truncate">{n.body}</div>}
                  <div className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</div>
                </div>
                {!n.is_read && <div className="w-2 h-2 bg-olive rounded-full mt-1 shrink-0" />}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBadge;
