'use client';

import { Stack } from '@mui/material';
import { Stethoscope } from 'lucide-react';
import React from 'react';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const StethoscopeIcon = styled(Stethoscope)(({ theme }) => ({
    fontSize: 32,
    color: theme.palette.primary.main,
}));

const SiteLogo = () => {
    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            <Image
                src="/logo.webp"
                alt="Doctoorak logo"
                width={120}
                height={45}
                priority
                title="Doctoorak"
                aria-label="Doctoorak site logo"
            />
        </Stack>
    );
};

export default SiteLogo;
