import { getDoctorById } from '@/lib/api/website';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Doctor from './__pageContent';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    return (
        <Doctor id={id} />
    )
}

export default Page