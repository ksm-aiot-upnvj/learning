/* AI Generated */
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const validateSensor = require("./validate-sensor.cjs");

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  console.error("Atur DATABASE_URL sebelum menjalankan server.");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const app = express();

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/sensors", validateSensor, async (req, res) => {
  const { device_id, sensor_type, value, unit } = req.sensor;
  const result = await pool.query(
    `INSERT INTO sensor_readings (device_id, sensor_type, value, unit)
     VALUES ($1, $2, $3, $4)
     RETURNING id, device_id, sensor_type, value, unit, recorded_at`,
    [device_id, sensor_type, value, unit],
  );
  res.status(201).json({ message: "Data sensor disimpan", data: result.rows[0] });
});

app.get("/sensors", async (req, res) => {
  const result = await pool.query(
    `SELECT id, device_id, sensor_type, value, unit, recorded_at
     FROM sensor_readings
     ORDER BY recorded_at DESC, id DESC
     LIMIT 10`,
  );
  res.json(result.rows);
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Body harus berupa JSON yang valid" });
  }
  console.error(error);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

app.listen(8000, "127.0.0.1", () => {
  console.log("API berjalan di http://127.0.0.1:8000");
});
