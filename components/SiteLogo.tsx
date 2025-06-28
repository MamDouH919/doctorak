import { Stack, Typography } from '@mui/material'
import { Stethoscope } from 'lucide-react'
import React from 'react'
import { styled } from '@mui/material/styles';

const StethoscopeIcon = styled(Stethoscope)(({ theme }) => ({
    fontSize: 32,
    color: theme.palette.primary.main,
}));
const TypographyStyle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

const SiteLogo = ({
    color,
}: {
    color?: string
}) => {
    return (
        <Stack direction="row" spacing={1} justifyContent="flex-start">
            <img src="/logo.webp" alt="logo" width={"100%"} height={45} />
            {/* <StethoscopeIcon />
            <TypographyStyle
                variant="h6"
                fontWeight="bold"
                sx={color ? { color } : undefined}
            >
                دكاترة
            </TypographyStyle> */}
        </Stack>
    )
}

export default SiteLogo