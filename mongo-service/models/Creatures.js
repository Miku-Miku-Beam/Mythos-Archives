import mongoose from 'mongoose';

const CreatureSchema = new mongoose.Schema({
    // ID de l'utilisateur provenant de SQLite (Prisma)
    authorId: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    origin: { type: String, default: "Inconnu" },
    // Score de légende (calculé : 1 + nb_temoignages_valides / 5)
    legendScore: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

// Index pour optimiser le tri par score de légende
CreatureSchema.index({ legendScore: -1 });

export default mongoose.model('Creature', CreatureSchema);