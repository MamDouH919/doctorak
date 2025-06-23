import { Box, Skeleton, Stack, CardContent, } from '@mui/material';

import { DoctorCard } from '@/sections/doctors';

const DoctorCardSkeleton = () => {
    return (
        <DoctorCard>
            <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={200}
                bgcolor="#dbeafe"
            >
                <Skeleton variant="circular" width={96} height={96} sx={{ border: '4px solid white' }} />
            </Box>

            <CardContent>
                <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 1 }} />
                <Box textAlign="center" mb={2}>
                    <Skeleton variant="rounded" width={120} height={32} sx={{ mx: 'auto' }} />
                </Box>

                <Skeleton variant="text" width="90%" sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="80%" sx={{ mx: 'auto', mb: 2 }} />

                <Stack direction="row" spacing={2}>
                    <Box position="relative" flexGrow={1}>
                        <Skeleton variant="rounded" height={40} />
                    </Box>
                    <Skeleton variant="circular" width={40} height={40} />
                </Stack>
            </CardContent>
        </DoctorCard>
    );
};

export default DoctorCardSkeleton;
