import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { connectDB } from './src/config/db.js';
import { requestLogger } from './src/middlewares/logger.js';
import deviceRoutes from './src/routes/deviceRoutes.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

const frontendPath = fileURLToPath(new URL('./frontend/', import.meta.url));
app.use(express.static(frontendPath));


const PORT = process.env.PORT || 3000;

// 1. Hubungkan ke MongoDB

// 3. Routes
app.use('/api/devices', deviceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Server KSM AIoT (MongoDB) berjalan!' });
});

/* AI Generated: bind after the database connection is ready. */
await connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server lokal:   http://localhost:${PORT}`);
  console.log(`Server jaringan: http://<IP-LAPTOP-ANDA>:${PORT}`);
});
