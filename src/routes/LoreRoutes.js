import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import Creature from '../models/Creatures.js'; 
import Testimony from '../models/Testimony.js';

const router = express.Router();

// POST /creatures
router.post('/creatures', authenticate, async (req, res) => {
    try {
        const { name, origin } = req.body;
        
        // On vérifie si le nom existe déjà
        const existing = await Creature.findOne({ name });
        if (existing) return res.status(400).json({ error: "Ce nom de créature existe déjà." });

        const creature = new Creature({
            authorId: req.user.id, // Récupéré depuis ton JWT décodé
            name,
            origin
        });

        await creature.save();
        res.status(201).json(creature);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /testimonies
router.post('/testimonies', authenticate, async (req, res) => {
    try {
        const { creatureId, description } = req.body;

        if (!description) return res.status(400).json({ error: "Description obligatoire." });

        // Règle des 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
        const alreadyPosted = await Testimony.findOne({
            authorId: req.user.id,
            creatureId,
            createdAt: { $gte: fiveMinutesAgo }
        });

        if (alreadyPosted) {
            return res.status(429).json({ error: "Attendez 5 minutes entre deux témoignages sur la même créature." });
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
});

// POST /testimonies/:id/validate
router.post('/testimonies/:id/validate', authenticate, async (req, res) => {
    try {
        const testimony = await Testimony.findById(req.params.id);
        if (!testimony) return res.status(404).json({ error: "Témoignage non trouvé" });

        // Règle : Impossible de valider son propre témoignage
        if (testimony.authorId === req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez pas valider votre propre témoignage." });
        }

        testimony.status = 'VALIDATED';
        testimony.validatedBy = req.user.id;
        testimony.validatedAt = new Date();

        await testimony.save();
        res.json(testimony);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ... Ajoute ici les GET (creatures, testimonies) de la même manière

export default router;