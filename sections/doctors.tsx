"use client"
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Button, styled, Chip, Tooltip, Stack } from '@mui/material';
import { Phone, Message, CalendarToday, Star, Room, AccessTime, EmojiEvents } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/lib/api/website';
import { TbWorld } from 'react-icons/tb';
import DoctorCardSkeleton from '@/loading/DoctorCard';
import Link from 'next/link';

const GradientSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 2),
    [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(12, 2),
    },
    background: 'linear-gradient(to bottom right, #fff5f5, #ffeaea)',
}));

export const DoctorCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    transition: 'all 0.3s ease',
    boxShadow: theme.shadows[4],
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[6],
    },
}));

const AvailabilityBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.palette.success.main,
    color: '#fff',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    fontSize: 10,
    fontWeight: 600,
}));

interface IconLabelProps {
    icon: React.ElementType;
    label: React.ReactNode;
}

const IconLabel: React.FC<IconLabelProps> = ({ icon: Icon, label }) => (
    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <Icon fontSize="small" style={{ marginLeft: 4 }} />
        <Typography variant="body2" color="textSecondary">
            {label}
        </Typography>
    </Box>
);

interface RenderStarsProps {
    rating: number;
}

const renderStars = (rating: number): React.ReactNode[] => {
    const stars: React.ReactNode[] = [];
    for (let i = 0; i < Math.floor(rating); i++) {
        stars.push(<Star key={i} fontSize="small" color="warning" />);
    }
    return stars;
};

// const featuredDoctors = [
//     {
//         id: 1,
//         name: 'أحمد الشيخ',
//         image: '/placeholder.svg',
//         specialty: 'العلوم الصناعية',
//         city: 'المدينة العربية',
//         experience: 'مدينة العربية',
//         rating: 4.5,
//         reviews: 10,
//         price: '$100',
//         available: true,
//         nextAvailable: 'اليوم',
//     },
//     {
//         id: 2,
//         name: 'أحمد الشيخ',
//         image: '/placeholder.svg',
//         specialty: 'العلوم الصناعية',
//         city: 'المدينة العربية',
//         experience: 'مدينة العربية',
//         rating: 4.5,
//         reviews: 10,
//         price: '$100',
//         available: true,
//         nextAvailable: 'اليوم',
//     },
//     {
//         id: 3,
//         name: 'أحمد الشيخ',
//         image: '/placeholder.svg',
//         specialty: 'العلوم الصناعية',
//         city: 'المدينة العربية',
//         experience: 'مدينة العربية',
//         rating: 4.5,
//         reviews: 10,
//         price: '$100',
//         available: true,
//         nextAvailable: 'اليوم',
//     },
// ]

const FeaturedDoctorsSection = ({
    showInHomePage = true,
    name,
    specialty,
    fromPage = false,
}: {
    showInHomePage?: boolean
    name?: string | null
    specialty?: string | null
    fromPage?: boolean
}) => {

    const { data: doctors, isLoading } = useQuery({
        queryKey: ['doctors', name, specialty],
        queryFn: () => getDoctors({
            ...(showInHomePage && { showInHomePage: showInHomePage }),
            ...(name && { name: name }),
            ...(specialty && { specialty: specialty }),
        }),
    });

    return (
        <GradientSection>
            <Box maxWidth="lg" mx="auto">
                <Box textAlign="center" mb={6}>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        الدكاترة
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        أفضل الدكاترة المتخصصين في مختلف المجالات الطبية
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {isLoading && [1, 2, 3].map(e =>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={e}>
                            <DoctorCardSkeleton />
                        </Grid>
                    )}
                    {doctors?.data.map((doctor) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor._id}>
                            <DoctorCard>
                                <Box position="relative" display="flex" alignItems="center" justifyContent="center" height={200} bgcolor="#dbeafe">
                                    <Avatar
                                        src={doctor.image.url}
                                        alt={doctor.image.alt}
                                        sx={{ width: 96, height: 96, border: '4px solid white', boxShadow: 2 }}
                                    />
                                    {<AvailabilityBadge>
                                        {doctor.visitors} متابع
                                    </AvailabilityBadge>}
                                </Box>

                                <CardContent>
                                    <Typography variant="h6" fontWeight={700} textAlign="center" gutterBottom>
                                        {doctor.user.name}
                                    </Typography>

                                    <Box textAlign="center" mb={2}>
                                        <Chip
                                            label={doctor.specialization.name}
                                            sx={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}
                                        />
                                    </Box>

                                    {/* <IconLabel icon={Room} label={doctor.city} /> */}

                                    {/* <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                                        {renderStars(doctor.rating)}
                                        <Typography variant="body2" color="textSecondary" ml={1}>
                                            {doctor.rating} ({doctor.reviews} تقييم)
                                        </Typography>
                                    </Box> */}

                                    {/* <IconLabel icon={EmojiEvents} label={doctor.experience} /> */}

                                    {/* make it only two lines and over make three dots */}
                                    <Typography
                                        align="center"
                                        color='textSecondary'
                                        mb={1}
                                        sx={{
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {doctor.description}
                                    </Typography>

                                    {/* {doctor.available && (
                                        <IconLabel icon={AccessTime} label={`متاح ${doctor.nextAvailable}`} />
                                    )} */}

                                    <Stack direction={"row"} spacing={2}>
                                        <Stack position={"relative"} flexGrow={1}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                                disabled
                                                startIcon={<CalendarToday />}
                                            >
                                                احجز موعد
                                            </Button>

                                            <Stack
                                                position={"absolute"}
                                                top={0}
                                                right={20}
                                            >
                                                <Chip
                                                    label={"قريبا"}
                                                    color='error'
                                                />
                                            </Stack>
                                        </Stack>
                                        <Tooltip title="البروفايل">
                                            <Link href={doctor.domain} passHref target='_blank' rel="noreferrer">
                                                <Button variant="contained" color="info" sx={{ minWidth: 40 }}>
                                                    <TbWorld size={20} />
                                                </Button>
                                            </Link>
                                        </Tooltip>
                                    </Stack>
                                </CardContent>
                            </DoctorCard>
                        </Grid>
                    ))}
                    {!isLoading && doctors?.data.length === 0 &&
                        <Box textAlign="center" mt={8} width={"100%"}>
                            <Typography variant="h6" color="text.secondary" textAlign={"center"}>
                                لا يوجد دكاترة مطابقة للبحث المحدد
                            </Typography>
                        </Box>}
                </Grid>

                {!fromPage && <Box textAlign="center" mt={8}>
                    <Button variant="contained" color="primary" size="large">
                        عرض جميع الدكاترة
                    </Button>
                </Box>}
            </Box>
        </GradientSection>
    );
};

export default FeaturedDoctorsSection;
