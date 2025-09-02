export interface GlobalData {
  cases: number;
  deaths: number;
  recovered: number;
  updated?: number;
}

export interface CountryData {
  country: string;
  cases: number;
  deaths: number;
  recovered: number;
  updated?: number;
}

export interface HistoricalData {
  country: string;
  province: string[];
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered: Record<string, number>;
  };
}

// Paises para la busqueda
export const countries = [
  "mexico",
  "usa",
  "brazil",
  "india",
  "france",
  "germany",
  "canada",
  "argentina",
  "colombia",
  "italy",
];

