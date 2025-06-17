import mongoose from "mongoose";

const SocialSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["facebook", "instagram", "tikTok", "twitter", "snapChat", "youtube", "group", "Share", "website"] },
  link: { type: String, required: true },
});

const VideosSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, required: true, enum: ["facebook", "instagram", "tikTok", "youtube"] },
});

const AccountsSchema = new mongoose.Schema({
  title: { type: String, },
  phone: { type: String, },
  whatsApp: { type: String, },
  description: { type: String, },
  image: { type: String, },
  color: { type: String, },
  lang: { type: String, enum: ["ar", "en"] },
  about: { type: String, },
  domain: { type: String, unique: true },
  active: { type: Boolean, default: true },
  endDate: { type: String, },

  faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }],
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  testimonials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testimonial' }],
  expertise: { type: mongoose.Schema.Types.ObjectId, ref: 'Expertise' },
  videos: [VideosSchema],
  social: [SocialSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, unique: true },
}, {
  timestamps: true,
  versionKey: false,
});

// Export the model
const Accounts = mongoose.models?.Accounts || mongoose.model("Accounts", AccountsSchema);

export default Accounts;
