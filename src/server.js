import app from './app.js'; // L'extension .js est capitale ici

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});