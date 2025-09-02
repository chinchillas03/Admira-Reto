import type { GlobalData } from "../types/covid";

interface Props {
  data: GlobalData;
}

export default function GlobalStats({ data }: Props) {
  return (
    <div className="text-center items-center bg-white shadow-md rounded-xl p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">🌍 Datos Globales</h2>
      <p>Casos: {data.cases.toLocaleString()}</p>
      <p>Muertes: {data.deaths.toLocaleString()}</p>
      <p>Recuperados: {data.recovered.toLocaleString()}</p>
    </div>
  );
}
