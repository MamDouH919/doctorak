import mongoose from 'mongoose';

// models/Testimonial.ts
const testimonialSchema = new mongoose.Schema({
    message: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
