import type { HistoricalData } from "../types/covid";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface Props {
  data: HistoricalData;
}

function formatDate(dateStr: string) {
  const [month, day, year] = dateStr.split("/");
  return `${day}/${month}/${year}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div style={{ background: "#fff", padding: 10, borderRadius: 6, boxShadow: "0 2px 8px #ccc" }}>
        <p><strong>Fecha:</strong> {formatDate(label as string)}</p>
        <p><strong>Casos:</strong> {item.cases}</p>
        <p><strong>Promedio móvil:</strong> {item.movingAvg.toFixed(2)}</p>
        <p><strong>% Cambio:</strong> {item.pctChange.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

export default function HistoricalChart({ data }: Props) {
  const timeline = data.timeline.cases;
  const rawData = Object.entries(timeline).map(([date, cases]) => ({
    date,
    cases,
  }));

  const movingAverage = rawData.map((item, i, arr) => {
    const slice = arr.slice(Math.max(i - 6, 0), i + 1);
    const avg = slice.reduce((sum, d) => sum + d.cases, 0) / slice.length;
    return { ...item, movingAvg: avg };
  });

  const percentChange = movingAverage.map((item, i, arr) => {
    const prev = i > 0 ? arr[i - 1].cases : item.cases;
    const pct = prev === 0 ? 0 : ((item.cases - prev) / prev) * 100;
    return { ...item, pctChange: pct, date: formatDate(item.date) };
  });

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-4 overflow-auto">
      <h2 className="text-xl font-bold mb-2 text-center">📈 Tendencia (últimos días)</h2>
      <div className="flex flex-row space-x-4 justify-center items-center">
        <LineChart width={600} height={350} data={percentChange}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="cases" stroke="#8884d8" />
        <Line type="monotone" dataKey="movingAvg" stroke="#82ca9d" />
      </LineChart>
      <BarChart width={600} height={350} data={percentChange}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="pctChange" fill="#ff7300" />
      </BarChart>
      </div>
    </div>
  );
}