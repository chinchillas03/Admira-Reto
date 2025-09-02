import { useEffect, useState } from "react";
import GlobalStats from "./componentes/GlobalStats";
import CountryStats from "./componentes/CountryStats";
import HistoricalChart from "./componentes/HistoricalChart";
import { type GlobalData, type CountryData, type HistoricalData, countries } from "./types/covid";
import { fetchGlobalData, fetchCountryData, fetchHistoricalData } from "./services/api";

const ranges = [
  { label: "Últimos 7 días", value: "7d" },
  { label: "Últimos 30 días", value: "30d" },
  { label: "Últimos 3 meses", value: "90d" },
  { label: "Últimos 6 meses", value: "180d" },
  { label: "Último año", value: "365d" },
  { label: "Últimos dos años", value: "730d" },
  { label: "Último tres años", value: "1095d" },
];

function App() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [country, setCountry] = useState<string>("mexico");
  const [range, setRange] = useState<string>("30d");

  useEffect(() => {
    fetchGlobalData().then(setGlobalData);
  }, []);

  useEffect(() => {
    fetchCountryData(country).then(setCountryData);
    const days = parseInt(range.replace("d", ""), 10);
    fetchHistoricalData(country, days).then(setHistoricalData);
  }, [country, range]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        📊 Admira-Reto: Dashboard COVID-19
      </h1>

      {globalData && <GlobalStats data={globalData} />}

      <div className="flex justify-center items-center p-6 gap-2 mt-4">
        <label className="text-center items-center font-semibold">🌎 País: </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <label className="font-semibold ml-4">📅 Rango: </label>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {ranges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {countryData && <CountryStats data={countryData} />}
      {historicalData && <HistoricalChart data={historicalData} />}
    </div>
  );
}

export default App;
