import Creature from '../models/Creatures.js'; 
import Testimony from '../models/Testimony.js';
import mongoose from 'mongoose';

export const createCreature = async (req, res) => {
    try {
        const { name, origin } = req.body;
        
        if (!name || !origin) {
            return res.status(400).json({ error: "Le nom et l'origine sont requis." });
        }

        const existing = await Creature.findOne({ name });
        if (existing) return res.status(400).json({ error: "Ce nom de créature existe déjà." });

        const creature = new Creature({
            authorId: req.user.id, 
            name,
            origin,
            legendScore: 1 // Score initial par défaut
        });

        await creature.save();
        res.status(201).json(creature);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createTestimony = async (req, res) => {
    try {
        const { creatureId, description } = req.body;
        
        if (!creatureId || !description) {
            return res.status(400).json({ error: "ID de créature et description obligatoires." });
        }

        if (!mongoose.Types.ObjectId.isValid(creatureId)) {
            return res.status(400).json({ error: "ID de créature invalide." });
        }

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
        const alreadyPosted = await Testimony.findOne({
            authorId: req.user.id,
            creatureId,
            createdAt: { $gte: fiveMinutesAgo }
        });

        if (alreadyPosted) {
            return res.status(429).json({ error: "Vous avez déjà posté un témoignage récemment. Attendez 5 minutes." });
        }

        const testimony = new Testimony({
            creatureId,
            authorId: req.user.id,
            description
        });

        await testimony.save();
        res.status(201).json(testimony);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const validateTestimony = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID de témoignage invalide." });
        }

        const testimony = await Testimony.findById(id);
        if (!testimony) return res.status(404).json({ error: "Témoignage non trouvé." });

        if (String(testimony.authorId) === String(req.user.id)) {
            return res.status(403).json({ error: "Vous ne pouvez pas valider votre propre témoignage." });
        }

        // 1. Mise à jour du statut du témoignage
        testimony.status = 'VALIDATED';
        testimony.validatedBy = req.user.id;
        testimony.validatedAt = new Date();
        await testimony.save();

        // 2. RECALCUL DU LEGEND SCORE
        // Compter tous les témoignages validés pour cette créature précise
        const count = await Testimony.countDocuments({ 
            creatureId: testimony.creatureId, 
            status: 'VALIDATED' 
        });

        // Formule : 1 + (nombre / 5)
        const newScore = 1 + (count / 5);

        // 3. Mise à jour de la créature dans MongoDB
        const updatedCreature = await Creature.findByIdAndUpdate(
            testimony.creatureId, 
            { legendScore: newScore },
            { new: true } // Pour récupérer la créature mise à jour
        );

        res.json({ 
            message: "Témoignage validé et score de légende mis à jour !", 
            testimony,
            newLegendScore: updatedCreature.legendScore 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};