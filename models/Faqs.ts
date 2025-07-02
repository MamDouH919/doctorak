// models/FAQ.ts
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: {
        ar: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    answer: {
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

export default mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);
