import Accounts from '@/components/Accounts'
import React, { use } from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    return (
        <Accounts id={id} />
    )
}

export default Page