const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Remplace par ton URL MongoDB (Atlas ou local)
        await mongoose.connect('mongodb://localhost:27017/');
        console.log('Connecté à MongoDB (Lore Service)');
    } catch (err) {
        console.error('Erreur de connexion MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;