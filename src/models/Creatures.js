import mongoose from 'mongoose';

const CreatureSchema = new mongoose.Schema({
    authorId: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    origin: { type: String, default: "Inconnu" },
    createdAt: { type: Date, default: Date.now }
});

// L'export par défaut est obligatoire pour ton import actuel
export default mongoose.model('Creature', CreatureSchema);