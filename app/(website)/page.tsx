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
            <FeaturedDoctorsSection showInHomePage={false} />
            <SpecialtiesSection limit={9} />
            <StatisticsSection />
        </>
    )
}

export default Page