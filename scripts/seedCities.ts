import Governorate from '@/models/Governorate';
import City from '@/models/Cities';
import data from '../seed/cities.json';
import slugify from 'slugify';

export async function seedCities() {
    for (const governorateData of data) {
        const govNameEn = governorateData.governorate;

        // Get slug from governorate name
        const governorateSlug = slugify(govNameEn, { lower: true });

        // Find the governorate by slug
        const governorate = await Governorate.findOne({ slug: governorateSlug });

        if (!governorate) {
            console.warn(`Governorate not found for slug: ${governorateSlug}`);
            continue;
        }

        console.log(`Found governorate: ${govNameEn} with ID: ${governorate._id}`);

        for (const city of governorateData.cities) {
            const citySlug = slugify(city.en, { lower: true });

            // Check if city already exists by slug
            const existingCity = await City.findOne({
                slug: citySlug,
                governorate: governorate._id,
            });

            if (!existingCity) {
                await City.create({
                    name: city,
                    slug: citySlug,
                    governorate: governorate._id,
                });

                console.log(`✅ Created city: ${city.en} (${citySlug}) under governorate: ${govNameEn}`);
            } else {
                console.log(`⏭️  City already exists: ${city.en} (${citySlug}) in governorate: ${govNameEn}`);
            }
        }
    }

    console.log('✅ Cities seeding complete.');
}