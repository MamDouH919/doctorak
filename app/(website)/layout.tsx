import AppBarComponent from '@/sections/app-bar'
import Footer from '@/sections/footer'
import React from 'react'

const Layout = ({
    children,
}: {
    children: React.ReactNode,
}) => {
    return <>
        <AppBarComponent />
        {children}
        <Footer />
    </>
}

export default Layout