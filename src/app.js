import express from 'express';
import connectDB from './db.js'; // Correction ici : même dossier
import loreRoutes from './routes/LoreRoutes.js'; // Majuscule respectée

const app = express();

connectDB();

app.use(express.json());

app.use('/api', loreRoutes);
app.use('/lore', loreRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

export default app;