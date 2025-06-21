"use client"
import CantAccess from '@/components/CantAccess';
import { useAppSelector } from '@/Store/store';
import React from 'react'

const CheckAdmin = ({ children }: { children: React.ReactNode }) => {
    const { auth } = useAppSelector(state => state);

    if (auth.user?.role !== "admin") {
        return <CantAccess />
    }
    return (
        <>
            {children}
        </>
    )
}

export default CheckAdmin