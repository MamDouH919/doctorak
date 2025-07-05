import CheckAdmin from '@/lib/CheckAdmin'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <CheckAdmin>{children}</CheckAdmin>
}

export default Layout