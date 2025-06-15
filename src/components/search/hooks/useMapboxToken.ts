
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapboxToken = async () => {
    try {
      console.log('Récupération du token Mapbox depuis l\'Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { name: 'MAPBOX_PUBLIC_TOKEN' }
      });

      if (error) {
        console.error('Erreur lors de la récupération du token:', error);
        throw new Error(`Erreur Edge Function: ${error.message}`);
      }

      if (data && data.value) {
        console.log('Token Mapbox récupéré avec succès');
        setMapboxToken(data.value);
        setError(null);
      } else {
        console.error('Token non trouvé dans la réponse:', data);
        throw new Error('Token Mapbox non configuré dans Supabase. Veuillez ajouter MAPBOX_PUBLIC_TOKEN dans les secrets Edge Function.');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du token:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion à Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapboxToken();
  }, []);

  return { mapboxToken, isLoading, error };
};
