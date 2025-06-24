"use client"
import CantAccess from '@/components/CantAccess';
import { useAppSelector } from '@/Store/store';
import React from 'react'

const CheckUser = ({ children }: { children: React.ReactNode }) => {
    const auth = useAppSelector(state => state.auth);

    if (auth.user?.role !== "user") {
        return <CantAccess />
    }
    return (
        <>
            {children}
        </>
    )
}

export default CheckUser