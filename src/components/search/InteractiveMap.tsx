import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InteractiveMapProps {
  results: any[];
  filters: any;
}

const InteractiveMap = ({ results, filters }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Remplacez cette ligne par votre token public Mapbox
  const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsdm5vMGIyMzFjaHAyanBjZmZpNms0ejgifQ.qQVVw-2Yh7Cr17wTbxjVbA';

  // Coordonnées approximatives des régions tunisiennes
  const regionCoordinates: { [key: string]: [number, number] } = {
    'Tunis': [10.1815, 36.8065],
    'Sfax': [10.7600, 34.7406],
    'Nabeul': [10.7372, 36.4560],
    'Monastir': [10.8264, 35.7643],
    'Sousse': [10.6411, 35.8256],
    'Bizerte': [9.8739, 37.2746],
    'Gabès': [10.0982, 33.8815],
    'Kairouan': [10.0963, 35.6781],
    'Gafsa': [8.7842, 34.4250],
    'Ariana': [10.1956, 36.8663],
    'Ben Arous': [10.2187, 36.7545],
    'Manouba': [10.0963, 36.8081],
    'Zaghouan': [10.1425, 36.4029],
    'Béja': [9.1834, 36.7256],
    'Jendouba': [8.7800, 36.5011],
    'Le Kef': [8.7049, 36.1699],
    'Siliana': [9.3706, 36.0837],
    'Mahdia': [11.0622, 35.5047],
    'Kasserine': [8.8363, 35.1675],
    'Sidi Bouzid': [9.4844, 35.0381],
    'Medenine': [10.5055, 33.3548],
    'Tataouine': [10.4500, 32.9297],
    'Tozeur': [8.1335, 33.9197],
    'Kebili': [8.9690, 33.7047]
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('Initialisation de la carte Mapbox avec token...');
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      setIsLoading(false);

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
        setError('Erreur lors du chargement de la carte. Vérifiez votre token Mapbox.');
      });

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la carte:', err);
      setError('Erreur lors de l\'initialisation de la carte');
      setIsLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

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

      // Créer l'élément du marqueur
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${result.type === 'harvester' 
          ? 'background-color: #22c55e;' 
          : 'background-color: #3b82f6;'
        }
      `;
      markerElement.textContent = result.type === 'harvester' ? 'C' : 'P';

      // Créer le contenu de la popup
      const popupContent = `
        <div style="max-width: 200px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            ${result.photo ? `<img src="${result.photo}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 8px; object-fit: cover;" alt="${result.name}">` : ''}
            <div>
              <h3 style="margin: 0; font-size: 14px; font-weight: bold;">${result.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${result.location}</p>
            </div>
          </div>
          ${result.type === 'harvester' ? `
            <p style="margin: 4px 0; font-size: 12px;"><strong>Expérience:</strong> ${result.experience}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Tarif:</strong> ${result.rate} TND/jour</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Note:</strong> ${result.rating}/5 ⭐</p>
          ` : `
            <p style="margin: 4px 0; font-size: 12px;"><strong>Période:</strong> ${result.harvestPeriod}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Surface:</strong> ${result.surfaceArea} hectares</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Oliviers:</strong> ${result.treeCount}</p>
          `}
          <button onclick="window.location.href='#'" style="
            margin-top: 8px;
            background-color: #7c8b7a;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            width: 100%;
          ">Voir le profil</button>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupContent);

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
              Pour utiliser Mapbox, vous devez remplacer le token par défaut par votre propre token public Mapbox dans le code.
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
      
      {/* Légende */}
      <div className="absolute top-4 left-4 bg-white rounded-md shadow-lg p-3 z-10 border">
        <div className="text-xs font-semibold mb-2 text-gray-800">Légende</div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border border-gray-300"></div>
          <span className="text-xs text-gray-700">Cueilleurs</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 border border-gray-300"></div>
          <span className="text-xs text-gray-700">Propriétaires</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
