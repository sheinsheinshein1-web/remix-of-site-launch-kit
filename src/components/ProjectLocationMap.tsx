import { AttributionControl, Circle, CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Check } from "lucide-react";
import "leaflet/dist/leaflet.css";

export type ProjectMapPoint = {
  lat: number;
  lng: number;
};

type ProjectLocationMapProps = {
  point: ProjectMapPoint | null;
  onChange: (point: ProjectMapPoint) => void;
};

const LocationMarker = ({ point, onChange }: ProjectLocationMapProps) => {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  if (!point) return null;

  return (
    <>
      <Circle
        center={[point.lat, point.lng]}
        radius={3_000}
        pathOptions={{
          color: "hsl(var(--primary))",
          weight: 2,
          fillColor: "hsl(var(--primary))",
          fillOpacity: 0.16,
        }}
      />
      <CircleMarker
        center={[point.lat, point.lng]}
        radius={6}
        pathOptions={{
          color: "hsl(var(--primary-foreground))",
          weight: 3,
          fillColor: "hsl(var(--primary))",
          fillOpacity: 1,
        }}
      />
    </>
  );
};

const ProjectLocationMap = ({ point, onChange }: ProjectLocationMapProps) => (
  <div className="project-location-map relative h-[320px] overflow-hidden rounded-[var(--radius)] border border-border bg-secondary sm:h-[360px] lg:h-[400px]">
    <MapContainer
      center={[56.84, 60.61]}
      zoom={8}
      minZoom={5}
      scrollWheelZoom
      attributionControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AttributionControl prefix={false} />
      <LocationMarker point={point} onChange={onChange} />
    </MapContainer>
    {point && (
      <div className="pointer-events-none absolute right-3 top-3 z-[500] flex max-w-[220px] items-start gap-2 rounded-[var(--radius)] border border-border bg-card/95 px-3 py-2.5 text-card-foreground shadow-sm backdrop-blur-md">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span className="text-[12px] font-medium leading-snug">
          Район выбран
          <span className="mt-0.5 block font-normal text-muted-foreground">Учитываем радиус 3 км</span>
        </span>
      </div>
    )}
  </div>
);

export default ProjectLocationMap;
