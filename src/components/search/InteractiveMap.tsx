
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
  const { mapboxToken, isLoading, error, refetch } = useMapboxToken();

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken.trim()) {
      console.log('Conditions non remplies pour initialiser la carte:', {
        hasContainer: !!mapContainer.current,
        hasToken: !!mapboxToken.trim(),
        tokenLength: mapboxToken.length
      });
      return;
    }

    console.log('Initialisation de la carte Mapbox avec token de longueur:', mapboxToken.length);
    
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
            <div className="space-y-3">
              <p className="font-medium">Erreur de chargement de la carte:</p>
              <p className="text-sm">{error}</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Réessayer
                </Button>
              </div>
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
