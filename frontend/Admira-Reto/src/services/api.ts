import type { GlobalData, CountryData, HistoricalData } from "../types/covid";

const BASE_URL = "http://localhost:4000/api";

export async function fetchGlobalData(): Promise<GlobalData> {
  const res = await fetch(`${BASE_URL}/global`);
  return res.json();
}

export async function fetchCountryData(country: string): Promise<CountryData> {
  const res = await fetch(`${BASE_URL}/countries/${country}`);
  return res.json();
}

export async function fetchHistoricalData(country: string, days = 30): Promise<HistoricalData> {
  const res = await fetch(`${BASE_URL}/historical/${country}/${days}`);
  return res.json();
}
