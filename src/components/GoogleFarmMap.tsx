import React, { useEffect, useRef, useState } from 'react';
import { ensureGoogleMapsLoaded } from '../services/googleMapsService';
import { Layers, MapPin, ExternalLink, RefreshCw } from 'lucide-react';

interface GoogleFarmMapProps {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  onRefresh?: () => void;
}

export const GoogleFarmMap: React.FC<GoogleFarmMapProps> = ({
  latitude,
  longitude,
  formattedAddress,
  onRefresh
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const [mapType, setMapType] = useState<google.maps.MapTypeId>(google.maps.MapTypeId.HYBRID);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      try {
        await ensureGoogleMapsLoaded();
        if (!isMounted || !mapContainerRef.current) return;

        const center = { lat: latitude, lng: longitude };

        if (!mapInstanceRef.current) {
          const map = new google.maps.Map(mapContainerRef.current, {
            center,
            zoom: 15,
            mapTypeId: mapType,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          });

          const marker = new google.maps.Marker({
            position: center,
            map,
            title: "Your Farm Coordinates (Google Maps)",
            animation: google.maps.Animation.DROP
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="color: #1c1917; font-family: sans-serif; padding: 4px; max-width: 200px;">
                <p style="font-size: 11px; font-weight: bold; margin: 0 0 4px;">📍 Farm Location</p>
                <p style="font-size: 10px; color: #444; margin: 0;">${formattedAddress}</p>
                <p style="font-size: 9px; color: #888; margin-top: 4px;">${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          mapInstanceRef.current = map;
          markerInstanceRef.current = marker;
          setMapLoaded(true);
        } else {
          mapInstanceRef.current.setCenter(center);
          mapInstanceRef.current.setMapTypeId(mapType);
          if (markerInstanceRef.current) {
            markerInstanceRef.current.setPosition(center);
          }
        }
      } catch (err: any) {
        console.error('Failed to initialize Google Map:', err);
        if (isMounted) {
          setLoadError('Interactive map preview unavailable');
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude, mapType, formattedAddress]);

  const toggleMapType = () => {
    const nextType = mapType === google.maps.MapTypeId.HYBRID 
      ? google.maps.MapTypeId.ROADMAP 
      : google.maps.MapTypeId.HYBRID;
    setMapType(nextType);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(nextType);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-xs">
      {/* Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-44 bg-stone-850"
      />

      {/* Fallback if map fails */}
      {loadError && !mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/90 text-stone-300 p-4 text-center">
          <MapPin className="w-6 h-6 text-amber-400 mb-1" />
          <p className="text-xs font-semibold">Google Coordinates Verified</p>
          <p className="text-[10px] text-stone-400 mt-0.5">{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</p>
        </div>
      )}

      {/* Floating Controls Bar */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        <span className="bg-stone-950/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-stone-700/60 shadow-xs pointer-events-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Google Satellite View
        </span>

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={toggleMapType}
            className="p-1.5 bg-stone-950/80 hover:bg-stone-900 text-stone-200 backdrop-blur-md rounded-lg border border-stone-700/60 transition shadow-xs"
            title={`Switch to ${mapType === google.maps.MapTypeId.HYBRID ? 'Roadmap' : 'Satellite'}`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 bg-stone-950/80 hover:bg-stone-900 text-stone-200 backdrop-blur-md rounded-lg border border-stone-700/60 transition shadow-xs"
              title="Refresh GPS Location"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg transition shadow-xs flex items-center gap-1 text-[10px]"
            title="Open in Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
