import mongoose, { Schema } from "mongoose";

const SocialSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["facebook", "instagram", "tikTok", "twitter", "snapChat", "youtube", "group", "Share", "website"] },
  link: { type: String, required: true },
});

const VideosSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, required: true, enum: ["facebook", "instagram", "tikTok", "youtube"] },
});

// const AppointmentSchema = new mongoose.Schema({
//   day: { type: String, required: true },
//   timeFrom: { type: String, required: true },
//   timeTo: { type: String, required: true },
// });

const AccountsSchema = new mongoose.Schema({
  siteName: { type: String, },
  title: { type: String, },
  phone: { type: String, },
  whatsApp: { type: String, },
  description: { type: String, },
  color: { type: String, },
  lang: { type: String, enum: ["ar", "en"] },
  about: { type: String, },
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
}, {
  timestamps: true,
  versionKey: false,
});

// Export the model
const Accounts = mongoose.models?.Accounts || mongoose.model("Accounts", AccountsSchema);

export default Accounts;
