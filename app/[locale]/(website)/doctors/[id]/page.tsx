import { getDoctorById } from '@/lib/api/website';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Doctor from './__pageContent';

const Page = ({ params }: { params: { id: string } }) => {
    const id = params.id
   

    return (
        <Doctor id={id} />
    )
}

export default Page