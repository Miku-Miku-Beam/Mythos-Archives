import Creature from '../models/Creatures.js'; 
import Testimony from '../models/Testimony.js';
import mongoose from 'mongoose'; // Ajouté pour valider les IDs

export const createCreature = async (req, res) => {
    try {
        const { name, origin } = req.body;
        
        // Validation de base
        if (!name || !origin) {
            return res.status(400).json({ error: "Le nom et l'origine sont requis." });
        }

        const existing = await Creature.findOne({ name });
        if (existing) return res.status(400).json({ error: "Ce nom de créature existe déjà." });

        const creature = new Creature({
            // req.user.id provient du JWT décodé par ton authMiddleware
            authorId: req.user.id, 
            name,
            origin
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

        // Vérifier si l'ID de la créature est un ID MongoDB valide
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

        // Empêcher l'auteur de valider son propre témoignage
        if (String(testimony.authorId) === String(req.user.id)) {
            return res.status(403).json({ error: "Vous ne pouvez pas valider votre propre témoignage." });
        }

        testimony.status = 'VALIDATED';
        testimony.validatedBy = req.user.id;
        testimony.validatedAt = new Date();

        await testimony.save();
        res.json({ message: "Témoignage validé avec succès", testimony });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};