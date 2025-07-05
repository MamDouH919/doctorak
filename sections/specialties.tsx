"use client"
import { getSpecializations } from '@/lib/api/website';
import { Box, Container, Grid, Typography, Paper, styled, Skeleton, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getIcon } from './getIcon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';


const Section = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    // [theme.breakpoints.up('lg')]: {
    //     paddingTop: theme.spacing(24),
    //     paddingBottom: theme.spacing(24),
    // },
}));

const SpecialtyCard = styled(Paper)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[4],
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: theme.palette.error.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    transition: 'background-color 0.3s',
    [`${SpecialtyCard}:hover &`]: {
        backgroundColor: theme.palette.error.main + '22',
    },
}));


export default function SpecialtiesSection({
    limit,
    fromPage = false
}: {
    limit?: number
    fromPage?: boolean
}) {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const { getLocalizedPath } = useLocalizedRouter();
    const { data: specializations, isLoading } = useQuery({
        queryKey: ['specializations', limit],
        queryFn: () => getSpecializations({
            limit: limit ?? 9
        }),
    });

    const handleClick = (id: string) => {
        router.push(`/doctors?specialty=${id}`)
    }


    return (
        <Section paddingTop={{
            xs: fromPage ? 8 : 16,
            md: fromPage ? 8 : 24
        }} paddingBottom={{
            xs: fromPage ? 8 : 16,
            md: fromPage ? 8 : 24
        }}>
            <Container>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                        {t("website.specialties.title")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t("website.specialties.subtitle")}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {isLoading && [1, 2, 3].map(e =>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={e}>
                            <SpecialtyCard elevation={1}>
                                <IconWrapper>
                                    <Skeleton variant="circular" width={64} height={64} />
                                </IconWrapper>
                                <Typography variant="body1" fontWeight={600} color="text.primary">
                                    <Skeleton width="100%" />
                                </Typography>
                            </SpecialtyCard>
                        </Grid>
                    )}
                    {specializations?.data.map((specialty, index) => {
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <SpecialtyCard elevation={1} onClick={() => handleClick(specialty._id)}>
                                    <IconWrapper>
                                        {getIcon(specialty.slug)}
                                    </IconWrapper>
                                    <Typography variant="body1" fontWeight={600} color="text.primary">
                                        {specialty.name[i18n.language as "ar" | "en"]}
                                    </Typography>
                                </SpecialtyCard>
                            </Grid>
                        );
                    })}
                </Grid>

                {!fromPage && <Box textAlign="center" mt={8}>
                    <Link href={getLocalizedPath("specialties")} passHref>
                        <Button variant="contained" color="primary" size="large">
                            {t("website.specialties.viewAll")}
                        </Button>
                    </Link>
                </Box>}
            </Container>
        </Section>
    );
}
