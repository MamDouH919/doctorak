// models/Governorate.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGovernorate extends Document {
    name: {
        en: string;
        ar: string;
    };  
    slug?: string;
}

const GovernorateSchema = new Schema<IGovernorate>(
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

export default mongoose.models.Governorate ||
    mongoose.model<IGovernorate>('Governorate', GovernorateSchema);
