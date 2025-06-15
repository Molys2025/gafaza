
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapboxToken = async () => {
    try {
      console.log('Récupération du token Mapbox depuis l\'Edge Function...');
      
      // Utilisation directe de la fonction get-secret existante
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { name: 'MAPBOX_PUBLIC_TOKEN' }
      });

      console.log('Réponse Edge Function:', { data, error });

      if (error) {
        console.error('Erreur lors de la récupération du token:', error);
        throw new Error(`Erreur Edge Function: ${error.message}`);
      }

      if (data && data.value) {
        console.log('Token Mapbox récupéré avec succès, longueur:', data.value.length);
        setMapboxToken(data.value);
        setError(null);
      } else {
        console.error('Token non trouvé dans la réponse:', data);
        throw new Error('Token Mapbox non configuré. Vérifiez que MAPBOX_PUBLIC_TOKEN est défini dans les secrets Supabase.');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du token:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapboxToken();
  }, []);

  return { mapboxToken, isLoading, error, refetch: fetchMapboxToken };
};
