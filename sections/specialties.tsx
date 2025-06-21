import { getSpecializations } from '@/lib/api/website';
import { DocumentScannerRounded } from '@mui/icons-material';
import { Box, Container, Grid, Typography, Paper, styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getIcon } from './getIcon';


const Section = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    paddingTop: theme.spacing(16),
    paddingBottom: theme.spacing(16),
    [theme.breakpoints.up('lg')]: {
        paddingTop: theme.spacing(24),
        paddingBottom: theme.spacing(24),
    },
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



export default function SpecialtiesSection() {
    const { data: specializations } = useQuery({
        queryKey: ['specializations'],
        queryFn: () => getSpecializations(),
    });

    return (
        <Section>
            <Container>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h4" fontWeight="bold" color="error.dark" gutterBottom>
                        التخصصات الطبية
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        اختر التخصص المناسب لاحتياجاتك الصحية
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {specializations?.data.map((specialty, index) => {
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <SpecialtyCard elevation={1}>
                                    <IconWrapper>
                                        {getIcon(specialty.slug)}
                                    </IconWrapper>
                                    <Typography variant="body1" fontWeight={600} color="text.primary">
                                        {specialty.name}
                                    </Typography>
                                </SpecialtyCard>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Section>
    );
}
