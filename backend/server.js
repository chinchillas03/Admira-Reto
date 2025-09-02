import express from "express";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());

const BASE_URL = "https://disease.sh/v3/covid-19";

// Carpeta de logs
const logDir = path.join(__dirname, "logs");
fs.mkdirSync(logDir, { recursive: true });
const traceFile = path.join(logDir, "http_trace.jsonl");

// Stream de escritura para logs en tiempo real
const logStream = fs.createWriteStream(traceFile, { flags: "a" });

function logTrace(entry) {
  logStream.write(JSON.stringify(entry) + "\n");
}

// --- Endpoints ---
// Global
app.get("/api/global", async (req, res) => {
  const start = Date.now();
  try {
    const { data } = await axios.get(`${BASE_URL}/all`);
    res.json(data);

    logTrace({
      ts: new Date().toISOString(),
      endpoint: "/api/global",
      method: "GET",
      status: 200,
      duration_ms: Date.now() - start,
      url_base: `${BASE_URL}/all`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos globales" });
    logTrace({
      ts: new Date().toISOString(),
      endpoint: "/api/global",
      method: "GET",
      status: 500,
      error: error.message,
    });
  }
});

// Por país
app.get("/api/countries/:country", async (req, res) => {
  const start = Date.now();
  const { country } = req.params;
  try {
    const { data } = await axios.get(`${BASE_URL}/countries/${country}`);
    res.json(data);

    logTrace({
      ts: new Date().toISOString(),
      endpoint: `/api/countries/${country}`,
      method: "GET",
      status: 200,
      duration_ms: Date.now() - start,
      url_base: `${BASE_URL}/countries/${country}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos por país" });
    logTrace({
      ts: new Date().toISOString(),
      endpoint: `/api/countries/${country}`,
      method: "GET",
      status: 500,
      error: error.message,
    });
  }
});

// Históricos
app.get("/api/historical/:country/:range", async (req, res) => {
  const start = Date.now();
  const { country, range } = req.params;
  const daysMap = { "7d": 7, "30d": 30, "90d": 90, "180d": 180, "365d": 365 };
  const days = daysMap[range] || 30;

  try {
    const { data } = await axios.get(`${BASE_URL}/historical/${country}?lastdays=${days}`);
    res.json(data);

    logTrace({
      ts: new Date().toISOString(),
      endpoint: `/api/historical/${country}/${range}`,
      method: "GET",
      status: 200,
      duration_ms: Date.now() - start,
      url_base: `${BASE_URL}/historical/${country}?lastdays=${days}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos históricos" });
    logTrace({
      ts: new Date().toISOString(),
      endpoint: `/api/historical/${country}/${range}`,
      method: "GET",
      status: 500,
      error: error.message,
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
