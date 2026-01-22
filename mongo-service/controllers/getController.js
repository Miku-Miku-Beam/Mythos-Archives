import Creature from '../models/Creatures.js'; 
import Testimony from '../models/Testimony.js';

export const getAllCreatures = async (req, res) => {
    try {
        const creatures = await Creature.find().sort({ name: 1 });
        res.json(creatures);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des créatures." });
    }
};

export const getAllTestimonies = async (req, res) => {
    try {
        const { creatureId } = req.query;
        const filter = creatureId ? { creatureId } : {};
        const testimonies = await Testimony.find(filter).sort({ createdAt: -1 });
        res.json(testimonies);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des témoignages." });
    }
};