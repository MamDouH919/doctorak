import mongoose from 'mongoose';

// models/City.ts
const citySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

export default mongoose.models.City || mongoose.model('City', citySchema);
