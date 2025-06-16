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

const SiteLogo = () => {
    return (
        <Stack direction="row" spacing={1} justifyContent="flex-start">
            <StethoscopeIcon />
            <TypographyStyle variant="h6" fontWeight="bold">
                دكتورك
            </TypographyStyle>
        </Stack>
    )
}

export default SiteLogo