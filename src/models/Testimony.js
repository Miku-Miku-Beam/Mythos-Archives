import mongoose from 'mongoose';

const TestimonySchema = new mongoose.Schema({
    creatureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creature', required: true },
    authorId: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['PENDING', 'VALIDATED', 'REJECTED'], 
        default: 'PENDING' 
    },
    validatedBy: { type: String, default: null },
    validatedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Testimony', TestimonySchema);