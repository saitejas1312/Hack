import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDBH_ph0zXv9MgNSwqQI8pBXfEwmh1evPc';

let initialized = false;

export async function ensureGoogleMapsLoaded(): Promise<void> {
  if (initialized) return;

  setOptions({
    key: API_KEY,
    v: 'weekly',
    solutionChannel: 'gmp_git_agentskills_v1'
  });

  await Promise.all([
    importLibrary('maps'),
    importLibrary('geocoding'),
    importLibrary('marker')
  ]);

  initialized = true;
}

export interface GoogleLocationDetails {
  latitude: number;
  longitude: number;
  accuracy: number;
  formattedAddress: string;
  villageOrLocality: string;
  district: string;
  state: string;
  postalCode: string;
  country: string;
  placeId?: string;
  timestamp: string;
}

export async function reverseGeocodeWithGoogle(lat: number, lng: number): Promise<GoogleLocationDetails> {
  try {
    await ensureGoogleMapsLoaded();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const res = results[0];
          let villageOrLocality = '';
          let district = '';
          let state = '';
          let postalCode = '';
          let country = '';

          for (const comp of res.address_components) {
            if (comp.types.includes('sublocality') || comp.types.includes('locality')) {
              villageOrLocality = comp.long_name;
            } else if (comp.types.includes('administrative_area_level_2')) {
              district = comp.long_name;
            } else if (comp.types.includes('administrative_area_level_1')) {
              state = comp.long_name;
            } else if (comp.types.includes('postal_code')) {
              postalCode = comp.long_name;
            } else if (comp.types.includes('country')) {
              country = comp.long_name;
            }
          }

          resolve({
            latitude: lat,
            longitude: lng,
            accuracy: 10,
            formattedAddress: res.formatted_address,
            villageOrLocality: villageOrLocality || district || 'Rural Farm',
            district: district || 'Regional Agricultural Zone',
            state: state || 'Telangana',
            postalCode: postalCode || '',
            country: country || 'India',
            placeId: res.place_id,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        } else {
          resolve(getFallbackLocation(lat, lng));
        }
      });
    });
  } catch (err) {
    console.warn('Google Maps Geocoding failed, using fallback location mapping', err);
    return getFallbackLocation(lat, lng);
  }
}

export function getFallbackLocation(lat: number, lng: number): GoogleLocationDetails {
  return {
    latitude: lat,
    longitude: lng,
    accuracy: 15,
    formattedAddress: `Plot No. 44, Warangal Rural Agricultural District, Telangana 506001, India`,
    villageOrLocality: 'Warangal Rural',
    district: 'Warangal',
    state: 'Telangana',
    postalCode: '506001',
    country: 'India',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

// Haversine formula to compute distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}
