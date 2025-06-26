import mongoose, { Schema } from "mongoose";

const appointmentsSchema = new mongoose.Schema({
    day: { type: String, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
});

const ClinicsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String },
    email: { type: String, unique: true, sparse: true },
    comment: { type: String, required: true },
    rate: { type: Number, required: true },

    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Accounts' },
}, {
    timestamps: true,
    versionKey: false,
});

// Export the model
const Clinics = mongoose.models?.Clinics || mongoose.model("Clinics", ClinicsSchema);

export default Clinics;
