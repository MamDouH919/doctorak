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
    "& .doctor-card": {
        width: "100%",
        height: "100%",
    }
}));
const AvatarStyle = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: '4px solid white',
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.2)",
    "& img": {
        objectFit: "contain",
    },
}));

const TypographyTwoLine = styled(Typography)(({ theme }) => ({
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
}));

const ChipStyle = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 900,
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
    governorate,
    city,
}: {
    showInHomePage?: boolean
    name?: string | null
    specialty?: string | null
    fromPage?: boolean
    governorate?: string | null
    city?: string | null
}) => {

    const { data: doctors, isLoading } = useQuery({
        queryKey: ['doctors', name, specialty, governorate, city],
        queryFn: () => getDoctors({
            ...(showInHomePage && { showInHomePage: showInHomePage }),
            ...(name && { name: name }),
            ...(specialty && { specialty: specialty }),
            ...(governorate && { governorate: governorate }),
            ...(city && { city: city }),
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

                <Grid container spacing={4} alignContent={"stretch"}>
                    {isLoading && [1, 2, 3].map(e =>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={e}>
                            <DoctorCardSkeleton />
                        </Grid>
                    )}
                    {doctors?.data.map((doctor) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor._id} display={"flex"}>
                            <DoctorCard className='doctor-card'>
                                <Box position="relative" display="flex" alignItems="center" justifyContent="center" height={200} bgcolor="#dbeafe">
                                    <AvatarStyle
                                        src={doctor.image.url}
                                        alt={doctor.image.alt}

                                    />
                                    {<AvailabilityBadge>
                                        {doctor.visitors} زيارة للصفحة
                                    </AvailabilityBadge>}
                                </Box>

                                <CardContent>
                                    <Stack spacing={2}>
                                        <Typography variant="h3" fontWeight={700} fontSize={20} textAlign="center">
                                            {doctor.user.name}
                                        </Typography>

                                        <Box textAlign="center">
                                            <ChipStyle
                                                label={doctor.specialization.name}
                                                color='primary'

                                            />
                                        </Box>


                                        <Stack>
                                            <Typography variant="body2" color="textPrimary" textAlign={"center"} fontWeight={"bold"}>
                                                أماكن تواجد الدكتور
                                            </Typography>
                                            {doctor.governorates.map((governorate, index) => (
                                                <Typography key={index} variant="body2" color="textSecondary" ml={1} textAlign={"center"}>
                                                    {governorate.name.ar + " - " + doctor.cities[index].name.ar}
                                                </Typography>
                                            ))}
                                        </Stack>

                                        {/* <IconLabel icon={Room} label={doctor.city} /> */}

                                        {/* <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                                        {renderStars(doctor.rating)}
                                        <Typography variant="body2" color="textSecondary" ml={1}>
                                            {doctor.rating} ({doctor.reviews} تقييم)
                                        </Typography>
                                    </Box> */}

                                        {/* <IconLabel icon={EmojiEvents} label={doctor.experience} /> */}

                                        {/* make it only two lines and over make three dots */}
                                        <TypographyTwoLine
                                            align="center"
                                            color='textSecondary'
                                            mb={1}
                                        >
                                            {doctor.description}
                                        </TypographyTwoLine>

                                        {/* {doctor.available && (
                                        <IconLabel icon={AccessTime} label={`متاح ${doctor.nextAvailable}`} />
                                    )} */}
                                        <Link href={"https://" + doctor.domain} passHref target='_blank' rel="noreferrer">
                                            <Button variant='outlined' color='primary' fullWidth endIcon={<TbWorld />}>
                                                تفاصيل أكتر عن الدكتور
                                            </Button>
                                        </Link>
                                        <Typography variant="body2" color="error" textAlign={"center"} fontStyle={"italic"} fontWeight={"bold"}>
                                            * الحجز قريبا *
                                        </Typography>
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
