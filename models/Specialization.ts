import mongoose, { Schema, Document } from 'mongoose';

export interface ISpecialization extends Document {
    name: {
        ar: string;
        en: string;
    };
    slug?: string;
}

const SpecializationSchema = new Schema<ISpecialization>(
    {
        name: {
            en: { type: String, required: true },
            ar: { type: String, required: true }
        },
        slug: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Specialization ||
    mongoose.model<ISpecialization>('Specialization', SpecializationSchema);
