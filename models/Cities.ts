// models/Cities.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICities extends Document {
    name: {
        en: string;
        ar: string;
    };
    slug?: string;
    governorate: mongoose.Types.ObjectId;
}

const CitiesSchema = new Schema<ICities>(
    {
        name: {
            en: { type: String, required: true },
            ar: { type: String, required: true }
        },
        slug: { type: String },
        governorate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Governorate',
            required: true
        }
    },

    {
        timestamps: true,
    }
);

export default mongoose.models.Cities ||
    mongoose.model<ICities>('Cities', CitiesSchema);
