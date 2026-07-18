import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

/**
 * GDPR controls: export a copy of one's data (art. 20) and deactivate the
 * account (art. 17). Both are backed by SECURITY DEFINER RPCs that only ever
 * touch the caller's own rows.
 */
const DataPrivacySection = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.rpc('export_my_data');
      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gafaza-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export prêt",
        description: "Le fichier a été téléchargé.",
      });
    } catch (error: unknown) {
      logger.error('Error exporting user data', error);
      toast({
        title: "Erreur",
        description: "L'export de vos données a échoué.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeactivate = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('soft_delete_user');
      if (error) throw error;

      toast({
        title: "Compte désactivé",
        description: "Votre profil n'est plus visible. Contactez-nous pour le réactiver.",
      });

      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error: unknown) {
      logger.error('Error deactivating account', error);
      toast({
        title: "Erreur",
        description: "La désactivation du compte a échoué.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="font-semibold text-olive-dark mb-1">Mes données</h2>
      <p className="text-sm text-gray-600 mb-4">
        Vous pouvez récupérer une copie de vos données ou désactiver votre compte à tout moment.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Télécharger mes données
        </Button>

        <Button
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => setConfirmOpen(true)}
        >
          <ShieldAlert className="mr-2 h-4 w-4" />
          Désactiver mon compte
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Désactiver votre compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Votre profil et vos annonces ne seront plus visibles et vous serez déconnecté.
              Vos données sont conservées : contactez-nous pour réactiver le compte ou
              demander une suppression définitive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeactivate();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Désactiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataPrivacySection;
