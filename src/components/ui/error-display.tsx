
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { SupabaseErrorInfo } from '@/hooks/useSupabaseError';

interface ErrorDisplayProps {
  error: SupabaseErrorInfo;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export const ErrorDisplay = ({ error, onDismiss, showDetails = false }: ErrorDisplayProps) => {
  const getErrorType = (code?: string) => {
    if (!code) return 'Erreur';
    
    switch (code) {
      case '23505': return 'Conflit de données';
      case '23503': return 'Référence manquante';
      case '42501': return 'Permission refusée';
      case '23514': return 'Contrainte violée';
      case '23502': return 'Champ requis manquant';
      default: return `Erreur ${code}`;
    }
  };

  const getErrorSolution = (code?: string) => {
    if (!code) return null;
    
    switch (code) {
      case '23505': 
        return 'Cet enregistrement existe déjà. Veuillez modifier vos données.';
      case '23503': 
        return 'Une référence nécessaire est manquante. Vérifiez les données liées.';
      case '42501': 
        return 'Vous n\'avez pas les permissions nécessaires pour cette action.';
      case '23514': 
        return 'Les données ne respectent pas les règles de validation.';
      case '23502': 
        return 'Tous les champs obligatoires doivent être remplis.';
      default: 
        return null;
    }
  };

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium text-red-800">
            {getErrorType(error.code)}
          </div>
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="h-auto p-1 text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <AlertDescription className="text-red-700 mt-1">
          {error.message}
        </AlertDescription>

        {getErrorSolution(error.code) && (
          <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-800">
            <strong>Solution suggérée:</strong> {getErrorSolution(error.code)}
          </div>
        )}

        {error.hint && (
          <div className="mt-2 text-sm text-red-600">
            <strong>Conseil:</strong> {error.hint}
          </div>
        )}

        {showDetails && error.details && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-red-600">
              Détails techniques
            </summary>
            <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto text-red-800">
              {error.details}
            </pre>
          </details>
        )}
      </div>
    </Alert>
  );
};
