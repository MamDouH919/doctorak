import Specialization from '@/models/Specialization';
import data from '../seed/specializations.json';

export async function seedSpecializations() {
    const count = await Specialization.countDocuments();
    if (count === 0) {
        await Specialization.insertMany(data);
        console.log('✅ Specializations seeded');
    } else {
        console.log('ℹ️ Specializations already exist');
    }
}
