import mongoose from 'mongoose';

// models/Article.ts
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
});

export default mongoose.models.Article || mongoose.model('Article', articleSchema);
