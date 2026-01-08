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

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Mythos-Archives | Lore Service</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a1a; color: #e0e0e0; display: flex; justify-content: center; padding: 50px; }
                    .card { background: #2d2d2d; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 600px; width: 100%; border-top: 5px solid #00ff88; }
                    h1 { color: #00ff88; margin-top: 0; }
                    .status { background: #1e1e1e; padding: 10px; border-radius: 6px; border-left: 4px solid #00ff88; font-family: monospace; }
                    ul { list-style: none; padding: 0; }
                    li { padding: 10px 0; border-bottom: 1px solid #3d3d3d; display: flex; justify-content: space-between; }
                    .method { font-weight: bold; color: #ffca28; width: 60px; display: inline-block; }
                    .endpoint { color: #4db6ac; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>📜 Lore Service</h1>
                    <p>Microservice de gestion du bestiaire et des témoignages.</p>
                    <div class="status">Statut: ✅ Connecté à MongoDB</div>
                    
                    <h3>Documentation des API</h3>
                    <ul>
                        <li><span><span class="method">GET</span> <span class="endpoint">/api/creatures</span></span> <span>Liste créatures</span></li>
                        <li><span><span class="method">POST</span> <span class="endpoint">/api/creatures</span></span> <span>Créer créature (JWT)</span></li>
                        <li><span><span class="method">POST</span> <span class="endpoint">/api/testimonies</span></span> <span>Nouveau témoignage</span></li>
                        <li><span><span class="method">POST</span> <span class="endpoint">/api/testimonies/:id/validate</span></span> <span>Modération</span></li>
                    </ul>
                    
                    <footer style="margin-top: 20px; font-size: 0.8em; color: #888;">Mythos-Archives v1.0.0 - Arch Linux Environnement</footer>
                </div>
            </body>
        </html>
    `);
});

export default app;