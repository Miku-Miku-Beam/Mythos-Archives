const mongoose = require('mongoose');

const CreatureSchema = new mongoose.Schema({
    authorId: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    origin: { type: String, default: "Inconnu" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Creature', CreatureSchema);