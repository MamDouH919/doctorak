import CheckUser from '@/lib/CheckUser'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <CheckUser>{children}</CheckUser>
}

export default Layout