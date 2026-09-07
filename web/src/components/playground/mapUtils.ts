/**
 * Shared helpers for map polygon handling.
 * API path returns [lat,lng] pairs with variable nesting depth:
 * - single ring: [[lat,lng], ...] depth 2
 * - multi ring: [[[lat,lng], ...], ...] depth 3
 * - deep nesting e.g. Papua Barat 92: [[[[lat,lng]]]] depth 4
 */

export function normalizeRings(raw: unknown): [number, number][][] {
  const rings: [number, number][][] = [];
  const collect = (node: unknown) => {
    if (!Array.isArray(node) || (node as unknown[]).length === 0) return;
    const arr = node as unknown[];
    if (
      Array.isArray(arr[0]) &&
      typeof (arr[0] as unknown[])[0] === "number" &&
      typeof (arr[0] as unknown[])[1] === "number"
    ) {
      rings.push(arr as [number, number][]);
      return;
    }
    for (const child of arr) collect(child);
  };
  collect(raw);
  return rings.filter((ring) => ring.length > 2);
}

/** Convert [lat,lng] rings to [lng,lat] for GeoJSON/MapLibre */
export function toLngLat(rings: [number, number][][]): [number, number][][] {
  return rings.map((ring) => ring.map(([lat, lng]) => [lng, lat] as [number, number]));
}

/** Build GeoJSON FeatureCollection for MapLibre fill layers */
export function ringsToGeoJSON(ringsLngLat: [number, number][][]) {
  return {
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
}
