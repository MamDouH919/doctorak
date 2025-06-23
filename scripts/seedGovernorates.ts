import Governorate from '@/models/Governorate';
import data from '../seed/governorates.json';

export async function seedGovernorate() {
    const count = await Governorate.countDocuments();
    if (count === 0) {
        await Governorate.insertMany(data);
        console.log('✅ Governorate seeded');
    } else {
        console.log('ℹ️ Governorate already exist');
    }
}
