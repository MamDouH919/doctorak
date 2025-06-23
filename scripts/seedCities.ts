import Governorate from '@/models/Governorate';
import City from '@/models/Cities';
import data from '../seed/cities.json';
import slugify from 'slugify';

export async function seedCities() {
    for (const governorateData of data) {
        const govNameEn = governorateData.governorate;

        // Get slug from name or pre-provided slug
        const slug = governorateData.governorate;

        // Find the governorate by slug
        const governorate = await Governorate.findOne({ slug });

        if (!governorate) {
            console.warn(`Governorate not found for slug: ${slug}`);
            continue;
        }

        for (const city of governorateData.cities) {
            const citySlug = slugify(city.en, { lower: true });

            const existingCity = await City.findOne({
                'name.en': city.en,
                governorate: governorate._id,
            });

            if (!existingCity) {
                await City.create({
                    name: city,
                    slug: citySlug,
                    governorate: governorate._id,
                });

                console.log(`Created city ${city.en} under governorate ${govNameEn}`);
            } else {
                console.log(`City ${city.en} already exists`);
            }
        }
    }

    console.log('✅ Cities seeding complete.');
}