export type Region = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  parent?: string;
};

export type RegionDetail = Region & {
  level: 1 | 2 | 3 | 4;
  capital?: string;
  elv?: number;
  tz?: number;
  population?: number;
  total_area?: number;
  postal_code?: string;
  has_path?: boolean;
  province?: { id: string; name: string };
  regency?: { id: string; name: string };
  district?: { id: string; name: string };
};
