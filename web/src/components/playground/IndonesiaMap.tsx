import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, ZoomControl } from "react-leaflet";
import type { Region } from "./types";
import L from "leaflet";

// Fix default icon issue for bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FlyTo({ region, zoom }: { region: Region | null; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (region) {
      map.flyTo([region.lat, region.lng], zoom, { duration: 1.2 });
    } else {
      map.flyTo([-2.5, 118.0], 5, { duration: 1.2 });
    }
  }, [region, zoom, map]);
  return null;
}

function FitPolygon({ positions }: { positions: [number, number][][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!positions || positions.length === 0) return;
    const allPoints = positions.flat() as L.LatLngExpression[];
    if (allPoints.length <= 2) return;

    // Tunggu flyTo (1.2s) selesai dulu biar tidak tabrakan — fetch polygon sudah jalan paralel
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let onMoveEnd: (() => void) | null = null;

    const doFit = () => {
      if (cancelled) return;
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 10, animate: true, duration: 1.0 });
    };

    // Jika map masih animasi flyTo, tunggu moveend; kalau sudah idle, delay 300ms saja
    if ((map as unknown as { _animatingZoom?: boolean })._animatingZoom) {
      onMoveEnd = () => doFit();
      map.once("moveend", onMoveEnd);
      // Safety fallback kalau moveend tidak kepanggil
      timer = setTimeout(doFit, 1400);
    } else {
      timer = setTimeout(doFit, 200);
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (onMoveEnd) map.off("moveend", onMoveEnd);
    };
  }, [positions, map]);
  return null;
}

export type TileType = "osm" | "esri";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

export function IndonesiaMap({
  selected,
  zoom,
  polygon,
  tile = "osm",
}: {
  selected: Region | null;
  zoom: number;
  polygon?: [number, number][][] | null;
  tile?: TileType;
}) {
  const isMobile = useIsMobile();
  return (
    <MapContainer
      center={[-2.5, 118.0]}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
      style={{ background: "#e2e8f0" }}
    >
      {!isMobile && <ZoomControl position="topleft" />}
      {tile === "esri" ? (
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      {polygon &&
        polygon.map((ring, i) => (
          <Polygon
            key={i}
            positions={ring as L.LatLngExpression[]}
            pathOptions={{
              color: "#059669",
              weight: 2,
              opacity: 0.9,
              fillColor: "#10b981",
              fillOpacity: 0.18,
            }}
          />
        ))}
      {selected && (
        <Marker position={[selected.lat, selected.lng]}>
          <Popup>
            <span className="font-semibold">{selected.name}</span>
            <br />
            <span className="font-mono text-xs">{selected.code}</span>
          </Popup>
        </Marker>
      )}
      {/* FlyTo selalu jalan duluan (tanpa delay); FitPolygon menunggu moveend biar tidak tabrakan */}
      <FlyTo region={selected} zoom={zoom} />
      {polygon && polygon.length > 0 && <FitPolygon positions={polygon} />}
    </MapContainer>
  );
}
