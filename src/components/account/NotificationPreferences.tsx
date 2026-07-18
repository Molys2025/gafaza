import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getEmailEnabled, setEmailEnabled } from "@/services/notificationService";

/**
 * Email notification opt-out. In-app notifications are always on; this only
 * governs whether the same events are also emailed (via the send-notification-email
 * edge function, gated on notification_preferences.email_enabled).
 */
const NotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getEmailEnabled(user.id)
      .then(setEnabled)
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggle = async (next: boolean) => {
    if (!user) return;
    setEnabled(next);
    setSaving(true);
    try {
      await setEmailEnabled(user.id, next);
      toast({
        title: next ? "Emails activés" : "Emails désactivés",
        description: next
          ? "Vous recevrez aussi les notifications par email."
          : "Vous ne recevrez plus de notifications par email.",
      });
    } catch (e: any) {
      setEnabled(!next); // rollback
      toast({ title: "Erreur", description: e?.message ?? "Échec de la mise à jour.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="font-semibold text-olive-dark mb-4 flex items-center gap-2">
        <Mail className="h-4 w-4" /> Notifications
      </h2>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-gray-800">Notifications par email</div>
          <div className="text-xs text-gray-500">
            Candidatures, messages et évaluations. Les notifications dans l'application restent actives.
          </div>
        </div>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-olive" />
        ) : (
          <Switch checked={enabled} onCheckedChange={handleToggle} disabled={saving} aria-label="Notifications par email" />
        )}
      </div>
    </div>
  );
};

export default NotificationPreferences;
