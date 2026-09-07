import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Region, RegionDetail } from "./types";
import { toLngLat } from "./mapUtils";
import { buildPopupEl } from "./RegionPopup";

import "maplibre-gl/dist/maplibre-gl.css";

export type TileType = "osm" | "esri";

// Vector style for street map, raster style for satellite
const OSM_VECTOR_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Tailwind sky-300 #7dd3fc untuk sea, sky-200 #bae6fd untuk waterway (beda tipis)
const SEA_COLOR = "#7dd3fc"; // sky-300
const WATERWAY_COLOR = "#bae6fd"; // sky-200 (lebih terang tipis untuk sungai/kanal)

function applySeaColor(map: maplibregl.Map) {
  if (!map.isStyleLoaded()) return;
  // Hanya untuk vector style (osm) — skip saat satellite raster
  const style = map.getStyle();
  if (!style?.layers) return;
  // Water (ocean/sea) -> sky-300
  if (map.getLayer("water")) {
    try {
      map.setPaintProperty("water", "fill-color", SEA_COLOR);
    } catch {
      // ignore
    }
  }
  // Waterway (river, canal) -> sky-200 beda tipis
  for (const id of ["waterway_river", "waterway_other", "waterway_tunnel"]) {
    if (map.getLayer(id)) {
      try {
        map.setPaintProperty(id, "line-color", WATERWAY_COLOR);
      } catch {
        // ignore
      }
    }
  }
}

function getEsriSatelliteStyle(): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {
      esri: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      },
    },
    layers: [
      {
        id: "esri-tiles",
        type: "raster",
        source: "esri",
      },
    ],
  };
}

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

export function MapLibreIndonesiaMap({
  selected,
  detail,
  zoom,
  polygon,
  tile = "osm",
}: {
  selected: Region | null;
  detail?: RegionDetail | null;
  zoom: number;
  polygon?: [number, number][][] | null;
  tile?: TileType;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const isMobile = useIsMobile();

  // Track if map is loaded
  const [mapLoaded, setMapLoaded] = useState(false);

  // Init map once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const initialStyle =
      tile === "esri" ? getEsriSatelliteStyle() : OSM_VECTOR_STYLE;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: initialStyle as string | maplibregl.StyleSpecification,
      center: [118.0, -2.5],
      zoom: 5,
      attributionControl: true,
    });

    // Add navigation control on desktop initially
    if (!isMobile) {
      const ctrl = new maplibregl.NavigationControl({ showCompass: false });
      map.addControl(ctrl, "top-left");
      navControlRef.current = ctrl;
    }

    const onLoad = () => {
      setMapLoaded(true);
      applySeaColor(map);
    };
    map.on("load", onLoad);
    // Juga handle styledata awal (liberty kadang fire styledata setelah load)
    map.on("styledata", () => {
      if (map.isStyleLoaded()) applySeaColor(map);
    });

    mapRef.current = map;

    return () => {
      map.off("load", onLoad);
      map.remove();
      mapRef.current = null;
      navControlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navControlRef = useRef<maplibregl.NavigationControl | null>(null);

  // Handle navigation control toggle on breakpoint change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (isMobile) {
      if (navControlRef.current) {
        try {
          map.removeControl(navControlRef.current);
        } catch {
          // ignore
        }
        navControlRef.current = null;
      }
      // Hide any leftover DOM from previous control
      const navEl = map
        .getContainer()
        .querySelector(".maplibregl-ctrl-top-left");
      if (navEl) (navEl as HTMLElement).style.display = "none";
    } else {
      if (!navControlRef.current) {
        const ctrl = new maplibregl.NavigationControl({ showCompass: false });
        try {
          map.addControl(ctrl, "top-left");
          navControlRef.current = ctrl;
        } catch {
          // ignore if already added
        }
      }
      const navEl = map
        .getContainer()
        .querySelector(".maplibregl-ctrl-top-left");
      if (navEl) (navEl as HTMLElement).style.display = "";
    }
  }, [isMobile]);

  // Handle tile style switch
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!mapRef.current) return;
    // Skip jika style sudah sama (hindari reload berulang)
    const newStyle =
      tile === "esri" ? getEsriSatelliteStyle() : OSM_VECTOR_STYLE;
    // map.setStyle will reset sources/layers; polygon effect will re-add after styledata
    map.setStyle(newStyle as string | maplibregl.StyleSpecification);
    // setMapLoaded will be re-triggered via styledata -> need to wait
    const onStyleData = () => {
      setMapLoaded(true);
      if (tile === "osm") applySeaColor(map);
    };
    map.once("styledata", onStyleData);
    // Juga apply setelah idle (pastikan style fully loaded)
    const onIdle = () => {
      if (tile === "osm") applySeaColor(map);
    };
    map.once("idle", onIdle);
    // Fallback if styledata already fired synchronously
    const timer = setTimeout(() => {
      setMapLoaded(true);
      if (tile === "osm") applySeaColor(map);
    }, 300);
    return () => {
      clearTimeout(timer);
      map.off("styledata", onStyleData);
      map.off("idle", onIdle);
    };
  }, [tile]);

  // Handle selected marker + custom popup (auto-open tiap ganti wilayah)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove previous
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (!selected) return;

    const marker = new maplibregl.Marker({ color: "#059669" })
      .setLngLat([selected.lng, selected.lat])
      .addTo(map);
    markerRef.current = marker;

    // Build popup content — pakai detail lengkap jika ada, fallback ke selected minimal
    const popupDetail: RegionDetail | null =
      detail ??
      ({
        code: selected.code,
        name: selected.name,
        lat: selected.lat,
        lng: selected.lng,
        level: 1 as const,
      } as RegionDetail);

    const contentEl = buildPopupEl(popupDetail);

    const popup = new maplibregl.Popup({
      offset: 25,
      maxWidth: "340px",
      className: "custom-tailwind-popup",
      closeButton: false,
      closeOnClick: false,
    })
      .setLngLat([selected.lng, selected.lat])
      .setDOMContent(contentEl)
      .addTo(map);

    popupRef.current = popup;

    // Klik marker toggle popup
    marker.getElement().addEventListener("click", () => {
      if (popupRef.current?.isOpen()) popupRef.current.remove();
      else popup.addTo(map);
    });

    return () => {
      marker.remove();
      popup.remove();
      if (markerRef.current === marker) markerRef.current = null;
      if (popupRef.current === popup) popupRef.current = null;
    };
  }, [selected, detail]);

  // Handle flyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Wait for load if not ready
    const doFly = () => {
      if (selected) {
        map.flyTo({
          center: [selected.lng, selected.lat],
          zoom,
          duration: 1200,
          essential: true,
        });
      } else {
        map.flyTo({
          center: [118.0, -2.5],
          zoom: 5,
          duration: 1200,
          essential: true,
        });
      }
    };
    if (!mapLoaded) {
      map.once("load", doFly);
      return () => {
        map.off("load", doFly);
      };
    }
    doFly();
  }, [selected, zoom, mapLoaded]);

  // Handle polygon layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = "wilayah-polygon";
    const fillLayerId = "wilayah-polygon-fill";
    const lineLayerId = "wilayah-polygon-line";

    const cleanup = () => {
      if (!map) return;
      try {
        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore if already removed due to style switch
      }
    };

    cleanup();

    if (!polygon || polygon.length === 0) return;

    const ringsLngLat = toLngLat(polygon);

    const geojson = {
      type: "FeatureCollection" as const,
      features: ringsLngLat.map((ring) => ({
        type: "Feature" as const,
        geometry: {
          type: "Polygon" as const,
          coordinates: [ring],
        },
        properties: {},
      })),
    };

    const addLayers = () => {
      try {
        if (map.getSource(sourceId)) return; // already added
        map.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#10b981",
            "fill-opacity": 0.18,
          },
        });
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#059669",
            "line-width": 2,
            "line-opacity": 0.9,
          },
        });
      } catch {
        // style may not be ready yet
      }
    };

    // If style is fully loaded, add immediately; otherwise wait for styledata
    if (map.isStyleLoaded()) {
      addLayers();
    } else {
      map.once("styledata", addLayers);
      // safety fallback
      const t = setTimeout(addLayers, 500);
      return () => {
        clearTimeout(t);
        map.off("styledata", addLayers);
        cleanup();
      };
    }

    return cleanup;
  }, [polygon, mapLoaded, tile]);

  // Fit bounds after polygon loads (mirrors IndonesiaMap FitPolygon)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !polygon || polygon.length === 0) return;
    if (!mapLoaded) return;

    const allPoints = polygon.flat() as [number, number][];
    if (allPoints.length <= 2) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const doFit = () => {
      if (cancelled) return;
      const ringsLngLat = toLngLat(polygon);
      const bounds = new maplibregl.LngLatBounds();
      for (const ring of ringsLngLat) {
        for (const [lng, lat] of ring) {
          bounds.extend([lng, lat]);
        }
      }
      if (bounds.isEmpty()) return;
      map.fitBounds(bounds, { padding: 24, maxZoom: 19, duration: 1000 });
    };

    // Wait for flyTo to finish if animating, similar to Leaflet's moveend logic
    // MapLibre has `movestart`/`moveend` as well
    const isMoving =
      (map as unknown as { isMoving?: () => boolean }).isMoving?.() ?? false;
    if (isMoving) {
      const onMoveEnd = () => doFit();
      map.once("moveend", onMoveEnd);
      timer = setTimeout(doFit, 1400);
      return () => {
        cancelled = true;
        if (timer) clearTimeout(timer);
        map.off("moveend", onMoveEnd);
      };
    } else {
      timer = setTimeout(doFit, 200);
      return () => {
        cancelled = true;
        if (timer) clearTimeout(timer);
      };
    }
  }, [polygon, mapLoaded]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ background: "#e2e8f0" }}
    />
  );
}
