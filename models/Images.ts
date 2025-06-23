// models/Image.ts
import mongoose, { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
    url: { type: String, required: true },
    alt: { type: String },

    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", unique: true }, // Ensures one-to-one
});

export default models.Image || model("Image", ImageSchema);