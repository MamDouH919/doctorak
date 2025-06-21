import mongoose, { Schema, Document } from 'mongoose';

export interface ISpecialization extends Document {
    name: string;
    slug?: string;
    name_en?: string;
}

const SpecializationSchema = new Schema<ISpecialization>(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String },
        name_en: { type: String }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Specialization ||
    mongoose.model<ISpecialization>('Specialization', SpecializationSchema);
