import { regionCoordinates } from '@/components/search/constants/regionCoordinates';

/** Haversine distance in kilometres between two lat/lng pairs. */
const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

/**
 * Return the name of the closest Tunisian gouvernorat to the given coordinates.
 * `regionCoordinates` stores tuples as [lng, lat].
 */
export const nearestRegion = (lat: number, lng: number): string => {
  let bestName = '';
  let bestDist = Number.POSITIVE_INFINITY;
  for (const [name, [rLng, rLat]] of Object.entries(regionCoordinates)) {
    const d = haversineKm(lat, lng, rLat, rLng);
    if (d < bestDist) {
      bestDist = d;
      bestName = name;
    }
  }
  return bestName;
};

/**
 * Resolve the closest gouvernorat using the browser geolocation API.
 * Rejects if geolocation is unavailable, denied, or times out.
 */
export const getCurrentRegion = (): Promise<string> =>
  new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          const region = nearestRegion(pos.coords.latitude, pos.coords.longitude);
          if (!region) reject(new Error('No region matched'));
          else resolve(region);
        } catch (e) {
          reject(e instanceof Error ? e : new Error('Region lookup failed'));
        }
      },
      (err) => reject(new Error(err.message || 'Geolocation error')),
      { timeout: 8000, maximumAge: 60_000 },
    );
  });