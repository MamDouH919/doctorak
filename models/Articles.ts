import mongoose from 'mongoose';

// models/Article.ts
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Accounts', required: true }
});

export default mongoose.models.Article || mongoose.model('Article', articleSchema);
