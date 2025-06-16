import mongoose from "mongoose";

const AccountsSchema = new mongoose.Schema({
  title: { type: String, },
  phone: { type: String, },
  whatsApp: { type: String, },
  description: { type: String, },
  image: { type: String, },
  color: { type: String, },
  lang: { type: String, enum: ["ar", "en"] }, // Restrict to specific languages if needed
  about: { type: String, },
  domain: { type: String, unique: true },
  active: { type: Boolean, default: true },
  endDate: { type: String, },

  // Relationships
  faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }],
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  testimonials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Testimonial' }],
  expertise: { type: mongoose.Schema.Types.ObjectId, ref: 'Expertise' },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  social: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Social' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, unique: true },
}, {
  timestamps: true,
  versionKey: false,
});

// Export the model
const Accounts = mongoose.models?.Accounts || mongoose.model("Accounts", AccountsSchema);

export default Accounts;
