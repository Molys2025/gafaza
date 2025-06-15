
import mapboxgl from 'mapbox-gl';

export const createMarker = (result: any) => {
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

  return { markerElement, popup };
};
