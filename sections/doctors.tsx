import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Button, styled, Chip, Tooltip } from '@mui/material';
import { Phone, Message, CalendarToday, Star, Room, AccessTime, EmojiEvents } from '@mui/icons-material';

const GradientSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 2),
    [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(12, 2),
    },
    background: 'linear-gradient(to bottom right, #fff5f5, #ffeaea)',
}));

const DoctorCard = styled(Card)(({ theme }) => ({
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

const featuredDoctors = [
    {
        id: 1,
        name: 'أحمد الشيخ',
        image: '/placeholder.svg',
        specialty: 'العلوم الصناعية',
        city: 'المدينة العربية',
        experience: 'مدينة العربية',
        rating: 4.5,
        reviews: 10,
        price: '$100',
        available: true,
        nextAvailable: 'اليوم',
    },
    {
        id: 2,
        name: 'أحمد الشيخ',
        image: '/placeholder.svg',
        specialty: 'العلوم الصناعية',
        city: 'المدينة العربية',
        experience: 'مدينة العربية',
        rating: 4.5,
        reviews: 10,
        price: '$100',
        available: true,
        nextAvailable: 'اليوم',
    },
    {
        id: 3,
        name: 'أحمد الشيخ',
        image: '/placeholder.svg',
        specialty: 'العلوم الصناعية',
        city: 'المدينة العربية',
        experience: 'مدينة العربية',
        rating: 4.5,
        reviews: 10,
        price: '$100',
        available: true,
        nextAvailable: 'اليوم',
    },
]

const FeaturedDoctorsSection = () => {
    return (
        <GradientSection>
            <Box maxWidth="lg" mx="auto">
                <Box textAlign="center" mb={6}>
                    <Typography variant="h4" fontWeight={700} color="error.dark" gutterBottom>
                        الأطباء المميزون
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        أفضل الأطباء المتخصصين في مختلف المجالات الطبية
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {featuredDoctors.map((doctor) => (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={doctor.id}>
                            <DoctorCard>
                                <Box position="relative" display="flex" alignItems="center" justifyContent="center" height={200} bgcolor="#dbeafe">
                                    <Avatar
                                        src={doctor.image || '/placeholder.svg'}
                                        alt={doctor.name}
                                        sx={{ width: 96, height: 96, border: '4px solid white', boxShadow: 2 }}
                                    />
                                    {doctor.available && <AvailabilityBadge>متاح الآن</AvailabilityBadge>}
                                </Box>

                                <CardContent>
                                    <Typography variant="h6" fontWeight={700} textAlign="center" gutterBottom>
                                        {doctor.name}
                                    </Typography>

                                    <Box textAlign="center" mb={2}>
                                        <Chip label={doctor.specialty} sx={{ backgroundColor: '#fee2e2', color: '#b91c1c' }} />
                                    </Box>

                                    <IconLabel icon={Room} label={doctor.city} />

                                    <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                                        {renderStars(doctor.rating)}
                                        <Typography variant="body2" color="textSecondary" ml={1}>
                                            {doctor.rating} ({doctor.reviews} تقييم)
                                        </Typography>
                                    </Box>

                                    <IconLabel icon={EmojiEvents} label={doctor.experience} />

                                    <Typography align="center" color="error" variant="h6" fontWeight={700} mb={1}>
                                        {doctor.price}
                                    </Typography>

                                    {doctor.available && (
                                        <IconLabel icon={AccessTime} label={`متاح ${doctor.nextAvailable}`} />
                                    )}

                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                            disabled={!doctor.available}
                                            startIcon={<CalendarToday />}
                                            sx={{ mr: 1 }}
                                        >
                                            احجز موعد
                                        </Button>
                                        <Tooltip title="اتصال">
                                            <Button variant="contained" color="success" sx={{ minWidth: 40 }}>
                                                <Phone fontSize="small" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="رسالة">
                                            <Button variant="contained" color="primary" sx={{ minWidth: 40 }}>
                                                <Message fontSize="small" />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </DoctorCard>
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center" mt={8}>
                    <Button variant="contained" color="error" size="large">
                        عرض جميع الأطباء
                    </Button>
                </Box>
            </Box>
        </GradientSection>
    );
};

export default FeaturedDoctorsSection;
