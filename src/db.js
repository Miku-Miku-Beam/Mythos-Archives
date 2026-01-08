import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mythos_lore');
    console.log('✅ MongoDB Connecté (Lore Service)');
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;