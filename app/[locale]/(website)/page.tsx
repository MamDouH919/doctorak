"use client"
import UnderChecked from '@/components/dialogs/UnderChecked'
import Banner from '@/sections/banner'
import FeaturedDoctorsSection from '@/sections/doctors'
import ProfileTemplate from '@/sections/profileTemplate'
import SpecialtiesSection from '@/sections/specialties'
import StatisticsSection from '@/sections/statistics'
import { useAppSelector } from '@/Store/store'

import React from 'react'

const Page = () => {    
    return (
        <>
            <Banner />
            <FeaturedDoctorsSection showInHomePage={false} />
            {/* <ProfileTemplate /> */}
            <SpecialtiesSection limit={9} />
            <StatisticsSection />
        </>
    )
}

export default Page