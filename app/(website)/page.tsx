"use client"
import AppBarComponent from '@/sections/app-bar'
import Banner from '@/sections/banner'
import FeaturedDoctorsSection from '@/sections/doctors'
import Footer from '@/sections/footer'
import SpecialtiesSection from '@/sections/specialties'
import StatisticsSection from '@/sections/statistics'
// import HeaderOne from '@/sections/header'
import React from 'react'

const Page = () => {
    return (
        <>
            <AppBarComponent />
            <Banner
                searchTerm=""
                setSearchTerm={() => { }}
                selectedSpecialty=""
                setSelectedSpecialty={() => { }}
                specialties={[]}
                selectedCity=""
                setSelectedCity={() => { }}
                cities={[]}
            />
            <FeaturedDoctorsSection />
            <SpecialtiesSection />
            <StatisticsSection />
            <Footer />
            {/* <HeaderOne /> */}
        </>
    )
}

export default Page