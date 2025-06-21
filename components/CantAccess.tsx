import { Lock } from '@mui/icons-material'
import { Stack } from '@mui/material'
import React from 'react'

const CantAccess = () => {
    return (
        <Stack height={"100vh"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
            <h1>لا يمكنك الوصول إلى هذه الصفحة</h1>
            <Lock />
        </Stack>
    )
}

export default CantAccess