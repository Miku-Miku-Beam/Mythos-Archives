import 'dotenv/config';
import jwt from 'jsonwebtoken';
import express from 'express';
import connectDB from './db.js';
import loreRoutes from './routes/LoreRoutes.js';

const app = express();

// 1. Connexion à la base de données
connectDB();

// 2. Middlewares de base
app.use(express.json());

// 3. Routes de santé et utilitaires (pas besoin de token pour celles-ci)
app.get("/health", (_req, res) => {
  res.json({ status: "OK", service: "mongo-service", timestamp: new Date() });
});

/**
 * Route temporaire pour générer un token de test
 * À supprimer ou protéger en production !
 */
app.get('/get-token', (req, res) => {
    const payload = { id: "valentin_dev", role: "admin" };
    const secret = process.env.JWT_SECRET || 'ma_cle_de_secours'; 
    
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.json({ 
        message: "Token généré pour le développement",
        token: token 
    });
});

// 4. Montage des routes du Lore
// On centralise tout sous le préfixe /api
app.use('/api', loreRoutes);

// 5. Page d'accueil (Documentation visuelle)
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Mythos-Archives | Lore Service</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a1a; color: #e0e0e0; display: flex; justify-content: center; padding: 50px; }
                    .card { background: #2d2d2d; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 600px; width: 100%; border-top: 5px solid #00ff88; }
                    h1 { color: #00ff88; margin-top: 0; }
                    .status { background: #1e1e1e; padding: 10px; border-radius: 6px; border-left: 4px solid #00ff88; font-family: monospace; margin-bottom: 20px;}
                    ul { list-style: none; padding: 0; }
                    li { padding: 12px 0; border-bottom: 1px solid #3d3d3d; display: flex; justify-content: space-between; align-items: center; }
                    .method { font-weight: bold; font-size: 0.8em; padding: 3px 8px; border-radius: 4px; width: 50px; text-align: center; margin-right: 10px; }
                    .get { background: #61affe; color: #fff; }
                    .post { background: #49cc90; color: #fff; }
                    .endpoint { color: #4db6ac; font-family: monospace; }
                    .desc { color: #bbb; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>📜 Mythos-Archives</h1>
                    <p>Microservice : <strong>Mongo-Service</strong></p>
                    <div class="status">Statut: ✅ Connecté à MongoDB (Arch Linux)</div>
                    
                    <h3>Documentation des API</h3>
                    <ul>
                        <li>
                            <span><span class="method get">GET</span><span class="endpoint">/api/creatures</span></span>
                            <span class="desc">Liste les créatures</span>
                        </li>
                        <li>
                            <span><span class="method get">GET</span><span class="endpoint">/api/testimonies</span></span>
                            <span class="desc">Liste les témoignages</span>
                        </li>
                        <li>
                            <span><span class="method post">POST</span><span class="endpoint">/api/creatures</span></span>
                            <span class="desc">Créer (Auth requis)</span>
                        </li>
                        <li>
                            <span><span class="method post">POST</span><span class="endpoint">/api/testimonies</span></span>
                            <span class="desc">Témoigner (Auth requis)</span>
                        </li>
                    </ul>
                    
                    <footer style="margin-top: 30px; font-size: 0.8em; color: #666; text-align: center;">
                        Mythos-Archives v1.0.0 - Système opérationnel
                    </footer>
                </div>
            </body>
        </html>
    `);
});

export default app;