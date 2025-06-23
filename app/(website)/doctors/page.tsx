"use client"
import FeaturedDoctorsSection from '@/sections/doctors'
import SearchForDoctors from '@/sections/SearchForDoctors'
import { Container, Stack } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const Doctors = () => {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const specialty = searchParams.get('specialty')
  return (
    <>
      <Container>
        <Stack py={4}>
          <SearchForDoctors searchInSamePage />
        </Stack>
      </Container>
      <FeaturedDoctorsSection
        name={name}
        specialty={specialty}
        showInHomePage={false}
        fromPage
      />
    </>
  )
}

export default Doctors