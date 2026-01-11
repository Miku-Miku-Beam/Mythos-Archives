import Creature from '../models/Creatures.js'; 
import Testimony from '../models/Testimony.js';

export const createCreature = async (req, res) => {
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
};

export const createTestimony = async (req, res) => {
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
            return res.status(429).json({ error: "Attendez 5 minutes." });
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
        const testimony = await Testimony.findById(req.params.id);
        if (!testimony) return res.status(404).json({ error: "Témoignage non trouvé" });

        if (testimony.authorId === req.user.id) {
            return res.status(403).json({ error: "Action interdite." });
        }

        testimony.status = 'VALIDATED';
        testimony.validatedBy = req.user.id;
        testimony.validatedAt = new Date();

        await testimony.save();
        res.json(testimony);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};