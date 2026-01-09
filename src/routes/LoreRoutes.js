import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import Creature from '../models/Creatures.js'; 
import Testimony from '../models/Testimony.js';

const router = express.Router();

// --- ROUTES GET (Lecture) ---

/**
 * GET /api/creatures
 * Liste toutes les créatures enregistrées
 */
router.get('/creatures', async (req, res) => {
    try {
        const creatures = await Creature.find().sort({ name: 1 });
        res.json(creatures);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des créatures." });
    }
});

/**
 * GET /api/testimonies
 * Liste tous les témoignages (avec possibilité de filtrer par créature via query param ?creatureId=...)
 */
router.get('/testimonies', async (req, res) => {
    try {
        const { creatureId } = req.query;
        const filter = creatureId ? { creatureId } : {};
        
        // .populate permet de récupérer les infos de la créature liée si le schéma est bien configuré
        const testimonies = await Testimony.find(filter).sort({ createdAt: -1 });
        res.json(testimonies);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des témoignages." });
    }
});

// --- ROUTES POST (Écriture avec Auth) ---

// POST /creatures
router.post('/creatures', authenticate, async (req, res) => {
    try {
        const { name, origin } = req.body;
        
        const existing = await Creature.findOne({ name });
        if (existing) return res.status(400).json({ error: "Ce nom de créature existe déjà." });

        const creature = new Creature({
            authorId: req.user.id,
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

export default router;