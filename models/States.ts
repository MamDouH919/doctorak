import mongoose from 'mongoose';

// models/State.ts
const stateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }
});

export default mongoose.models.State || mongoose.model('State', stateSchema);
