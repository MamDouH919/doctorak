"use client"
import Banner from '@/sections/banner'
import FeaturedDoctorsSection from '@/sections/doctors'
import SpecialtiesSection from '@/sections/specialties'
import StatisticsSection from '@/sections/statistics'

import React from 'react'

const Page = () => {
    return (
        <>
            <Banner />
            <FeaturedDoctorsSection />
            <SpecialtiesSection />
            <StatisticsSection />
        </>
    )
}

export default Page