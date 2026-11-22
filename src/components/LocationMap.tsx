import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import { geocodeLocation } from '../lib/nominatim';
import type { GeocodedLocation } from '../lib/nominatim';

const markerIcon = L.divIcon({
  className: 'mdbMapPin',
  html: '<svg viewBox="0 0 24 36" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12c0 8.5 12 24 12 24s12-15.5 12-24C24 5.4 18.6 0 12 0zm0 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>',
  iconSize: [28, 42],
  iconAnchor: [14, 38],
  popupAnchor: [0, -36],
});

function FitMarkers({ locations }: { locations: GeocodedLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lon], 11);
    } else if (locations.length > 1) {
      map.fitBounds(
        locations.map(({ lat, lon }) => [lat, lon] as [number, number]),
        { padding: [32, 32], maxZoom: 11 }
      );
    }
  }, [locations, map]);

  return null;
}

export default function LocationMap({ locations }: { locations: string[] }) {
  const [markers, setMarkers] = useState<GeocodedLocation[]>([]);
  const [notFound, setNotFound] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const uniqueLocations = useMemo(() => Array.from(new Set(locations)), [locations]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadLocations() {
      for (let index = 0; index < uniqueLocations.length; index++) {
        const location = uniqueLocations[index];
        try {
          const result = await geocodeLocation(location, controller.signal);
          if (!active) return;
          if (result) {
            setMarkers((current) => [...current, result]);
          } else {
            setNotFound((current) => [...current, location]);
          }
        } catch (reason) {
          if (!active || controller.signal.aborted) return;
          const message = reason instanceof Error ? reason.message : String(reason);
          setError(message);
          setNotFound((current) => [...current, ...uniqueLocations.slice(index)]);
          setCompleted(true);
          return;
        }
      }

      if (active) setCompleted(true);
    }

    void loadLocations();
    return () => {
      active = false;
      controller.abort();
    };
  }, [uniqueLocations]);

  const center: [number, number] = markers.length
    ? [markers[0].lat, markers[0].lon]
    : [20, 0];

  return (
    <div className='mdbMapContent'>
      <MapContainer center={center} zoom={2} scrollWheelZoom className='mdbMap'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <FitMarkers locations={markers} />
        {markers.map((location) => (
          <Marker
            key={`${location.lat}:${location.lon}:${location.name}`}
            position={[location.lat, location.lon]}
            icon={markerIcon}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className='mdbMapStatus' aria-live='polite'>
        {!completed && `Finding locations… ${markers.length} of ${uniqueLocations.length} mapped`}
        {completed && !error && !notFound.length && `${markers.length} locations mapped`}
        {error && `Could not finish searching locations: ${error}`}
        {notFound.length > 0 && (
          <span>
            {markers.length ? ' Not found or not searched: ' : 'No map pins for: '}
            {notFound.join('; ')}
          </span>
        )}
      </div>
    </div>
  );
}
