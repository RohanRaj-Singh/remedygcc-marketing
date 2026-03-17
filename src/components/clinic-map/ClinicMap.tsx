"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet with Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ClinicMapProps {
  address: string;
  clinicName: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Component to center map when coordinates change
function MapCenter({ coordinates }: { coordinates: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 15);
    }
  }, [coordinates, map]);
  
  return null;
}

export default function ClinicMap({ address, clinicName, coordinates }: ClinicMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  // Default coordinates for Oman (Muscat area)
  const defaultPosition: [number, number] = [23.5880, 58.3829];

  useEffect(() => {
    // If coordinates are provided directly, use them
    if (coordinates) {
      setPosition([coordinates.lat, coordinates.lng]);
      setLoading(false);
      return;
    }

    // If no address, use default
    if (!address) {
      setPosition(defaultPosition);
      setLoading(false);
      return;
    }

    async function geocodeAddress() {
      try {
        // Use Nominatim (OpenStreetMap's geocoding service) for free geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address + ", Oman"
          )}&limit=1`
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          // Fall back to default position (Muscat) if geocoding fails
          setPosition(defaultPosition);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setPosition(defaultPosition);
      } finally {
        setLoading(false);
      }
    }

    geocodeAddress();
  }, [address, coordinates]);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-600 font-satoshi">Loading map...</p>
        </div>
      </div>
    );
  }

  const mapPosition = position || defaultPosition;

  return (
    <div className="rounded-xl overflow-hidden h-[400px] shadow-md">
      <MapContainer
        center={mapPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={mapPosition} icon={customIcon}>
          <Popup>
            <div className="text-center">
              <strong className="block text-sm">{clinicName}</strong>
              <span className="text-xs text-gray-600">{address}</span>
            </div>
          </Popup>
        </Marker>
        <MapCenter coordinates={mapPosition} />
      </MapContainer>
    </div>
  );
}
