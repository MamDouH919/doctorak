import mongoose from 'mongoose';

// models/Article.ts
const articleSchema = new mongoose.Schema({
    title: {
        ar: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    content: {
        ar: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Accounts', required: true }
});

export default mongoose.models.Article || mongoose.model('Article', articleSchema);
