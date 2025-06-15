
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMapboxToken } from './hooks/useMapboxToken';
import { MapLegend } from './components/MapLegend';
import { regionCoordinates } from './constants/regionCoordinates';
import { createMarker } from './utils/markerUtils';

interface InteractiveMapProps {
  results: any[];
  filters: any;
}

const InteractiveMap = ({ results, filters }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { mapboxToken, isLoading, error } = useMapboxToken();

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken.trim()) return;

    console.log('Initialisation de la carte Mapbox...');
    
    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [9.5375, 33.8869], // Centre de la Tunisie
        zoom: 6
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Carte chargée avec succès');
        setIsLoaded(true);
        addMarkersToMap();
      });

      map.current.on('error', (e) => {
        console.error('Erreur Mapbox:', e);
      });

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la carte:', err);
    }
  };

  useEffect(() => {
    if (mapboxToken.trim()) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (isLoaded && map.current) {
      addMarkersToMap();
    }
  }, [results, isLoaded]);

  const addMarkersToMap = () => {
    if (!map.current) return;

    console.log(`Ajout de ${results.length} marqueurs à la carte`);

    // Supprimer les anciens marqueurs
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    results.forEach((result) => {
      const coordinates = regionCoordinates[result.location];
      if (!coordinates) {
        console.warn(`Coordonnées non trouvées pour la localisation: ${result.location}`);
        return;
      }

      // Ajouter un peu de variation pour éviter la superposition exacte
      const offsetLng = (Math.random() - 0.5) * 0.1;
      const offsetLat = (Math.random() - 0.5) * 0.1;
      const finalCoords: [number, number] = [
        coordinates[0] + offsetLng,
        coordinates[1] + offsetLat
      ];

      const { markerElement, popup } = createMarker(result);

      new mapboxgl.Marker(markerElement)
        .setLngLat(finalCoords)
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <div className="mt-2 text-sm">
              {error.includes('MAPBOX_PUBLIC_TOKEN') ? (
                <div>
                  <p>Pour configurer le token Mapbox :</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Allez dans votre projet Supabase</li>
                    <li>Naviguez vers Edge Functions → Secrets</li>
                    <li>Ajoutez un nouveau secret nommé "MAPBOX_PUBLIC_TOKEN"</li>
                    <li>Collez votre token public Mapbox obtenu sur <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">account.mapbox.com</a></li>
                  </ol>
                </div>
              ) : (
                <p>Vérifiez votre connexion internet et les paramètres Supabase.</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-olive" />
          <p className="text-sm text-gray-500">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      <div 
        ref={mapContainer} 
        className="h-[500px] w-full"
      />
      
      <MapLegend />
    </div>
  );
};

export default InteractiveMap;
