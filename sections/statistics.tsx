import { Box, Container, Grid, Typography, styled } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const StatsSection = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    paddingTop: theme.spacing(16),
    paddingBottom: theme.spacing(16),
    textAlign: 'center',
}));

const StatNumber = styled(Typography)(({ theme }) => ({
    fontSize: '2.25rem', // Equivalent to text-4xl
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
}));

const StatLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.primary.main),
}));

export default function StatisticsSection() {
    const { t } = useTranslation()
    const stats = [
        { value: '500+', label: t("website.statistics.doctors") },
        { value: '10,000+', label: t("website.statistics.satisfiedPatient") },
        { value: '25+', label: t("website.statistics.specialties") },
        { value: '26', label: t("website.statistics.governorate") },
    ];

    return (
        <StatsSection>
            <Container>
                <Grid container spacing={4}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <StatNumber>{stat.value}</StatNumber>
                            <StatLabel>{stat.label}</StatLabel>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </StatsSection>
    );
}
