import mongoose, { Schema } from "mongoose";

const SocialSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["facebook", "instagram", "tikTok", "twitter", "snapChat", "youtube", "group", "Share", "website"] },
  link: { type: String, required: true },
});

const VideosSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, required: true, enum: ["facebook", "instagram", "tikTok", "youtube"] },
});

const ServicesSchema = new mongoose.Schema(
  {
    ar: {
      type: [String],
    },
    en: {
      type: [String],
    }
  },
  { _id: false } // optional: disables _id creation for subdocument
);

const AccountsSchema = new mongoose.Schema({
  siteName: {
    ar: { type: String, },
    en: { type: String, },
  },
  title: {
    ar: { type: String, },
    en: { type: String, },
  },
  phone: { type: String, },
  whatsApp: { type: String, },
  description: {
    ar: { type: String, },
    en: { type: String, },
  },
  color: { type: String, },
  // lang: { type: String, enum: ["ar", "en"] },
  about: {
    ar: { type: String, },
    en: { type: String, },
  },
  domain: { type: String, unique: true },
  active: { type: Boolean, default: false },
  endDate: { type: String, },
  showInHomePage: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  specialization_needed: { type: String, },
  visitors: { type: Number, default: 0 },

  governorates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Governorate' }],
  cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cities' }],

  faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }],
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  testimonials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testimonial' }],
  expertise: { type: mongoose.Schema.Types.ObjectId, ref: 'Expertise' },
  clinics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clinics' }],
  videos: [VideosSchema],
  social: [SocialSchema],
  // appointments: [AppointmentSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, },
  specialization: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialization', },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" }, // One-to-One reference

  services: ServicesSchema
}, {
  timestamps: true,
  versionKey: false,
});

// Export the model
const Accounts = mongoose.models?.Accounts || mongoose.model("Accounts", AccountsSchema);

export default Accounts;
