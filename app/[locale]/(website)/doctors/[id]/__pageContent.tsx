"use client"
// import { getDoctorById } from '@/lib/api/website';
// import { useQuery } from '@tanstack/react-query';
// import React from 'react'

// const Doctor = ({id}: { id: string }) => {
//     // get doctor by id
//     const { data: doctor, isLoading } = useQuery({
//         queryKey: ['doctor', id],
//         queryFn: () => getDoctorById(id),
//     });

//     console.log(doctor)

//     return (
//         <div>Doctor</div>
//     )
// }

// export default Doctor

import {
    Phone,
    MapPin,
    Clock,
    Facebook,
    Instagram,
    Youtube,
    MessageCircle,
    Calendar,
    Stethoscope,
    FileText,
    HelpCircle
} from 'lucide-react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    IconButton,
    Divider,
    Stack,
    alpha,
    Chip,
    Paper,
    Icon,
    CircularProgress,
} from '@mui/material';
import { getDoctorById } from '@/lib/api/website';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ExpandMore } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Days } from '@/components/customAutoCompolete/ListDays';

const getSocialIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'facebook':
            return <Facebook />;
        case 'instagram':
            return <Instagram />;
        case 'youtube':
            return <Youtube />;
        default:
            return <MessageCircle />;
    }
};

const ServiceCard = styled(Paper)(({ theme }) => ({
    background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.5)})`, // from-blue-50 to-blue-100
    // border: '1px solid ' + alpha(theme.palette.primary.main, 0.1), // border-blue-200
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    color: theme.palette.getContrastText(theme.palette.primary.main),
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[2],
    },
}));

const IconStyle = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
        fontSize: 24,
        color: theme.palette.primary.main,
    },
    "& span": {
        fontSize: 24,
        color: theme.palette.primary.main,
    },
}));

const BoxBackground = styled(Box)(({ theme }) => ({
    backgroundImage: "url(/doctor-bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100%",
    width: "100%",
    padding: theme.spacing(8, 1),
    position: "relative",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
        backgroundColor: theme.palette.background.default,
        width: "100%",
        height: "100%",
        opacity: 0.5,
    },
}));


const formatTime = (time: string, lang: "ar" | "en" = "ar") => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? lang === "ar" ? "مساءا" : "PM" : lang === "ar" ? "صباحا" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
}

const DoctorProfile: React.FC<{ id: string }> = ({ id }) => {
    const { t, i18n } = useTranslation()
    const { data: doctorData, isLoading } = useQuery({
        queryKey: ['doctor', id],
        queryFn: () => getDoctorById(id),
    });

    const doctor = doctorData?.data.doctor;

    if (isLoading) {
        return <Stack
            height={"400px"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <CircularProgress />
        </Stack>
    }

    if (!doctor) {
        return <Stack
            height={"400px"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Typography variant="h6">Doctor not found</Typography>
        </Stack>
    }

    return (
        <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', pb: 8 }}>
            {/* Header Section */}
            <BoxBackground>
                <Container>
                    <Stack alignItems={"center"} justifyContent={"center"} spacing={1} position={"relative"} zIndex={11}>
                        <Avatar sx={{ width: 200, height: 200, mx: 'auto', bgcolor: 'white' }}>
                            <img
                                src={doctor.image?.url}
                                alt={doctor.user.name[i18n.language as "ar" | "en"]}
                                width={"100%"}
                                height={"100%"}
                                style={{ objectFit: "contain" }}
                            />
                        </Avatar>
                        <Typography variant="h1" fontWeight="bold" fontSize={30}>
                            {doctor.siteName[i18n.language as "ar" | "en"]}
                        </Typography>
                        <Typography variant="h2" fontSize={20}>
                            {doctor.title[i18n.language as "ar" | "en"]}
                        </Typography>
                        <Chip label={doctor.specialization.name[i18n.language as "ar" | "en"]} color="primary" />
                        <Typography variant="body1">
                            {doctor.description[i18n.language as "ar" | "en"]}
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<Phone />}
                                href={`tel:${doctor.phone}`}
                            >
                                {t("website.doctor.callNow")}
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<MessageCircle />}
                                href={`https://wa.me/${doctor.whatsApp}`}
                            >
                                {t("website.doctor.whatsApp")}
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </BoxBackground>

            <Container>
                <Stack spacing={2} mt={2}>
                    {/* About Section */}
                    <DoctorCard>
                        <DoctorCardHeader
                            title={t("website.doctor.aboutDoctor")}
                            icon={<Stethoscope />}
                            mui={false}
                        />
                        <Typography>{doctor.about[i18n.language as "ar" | "en"]}</Typography>
                    </DoctorCard>

                    {doctor.services && doctor.services[i18n.language as "ar" | "en"].length > 0 && (
                        <DoctorCard>
                            <DoctorCardHeader
                                title={t("website.doctor.doctorServices")}
                                icon="check_circle"
                            />

                            <Grid container spacing={2}>
                                {doctor.services[i18n.language as "ar" | "en"].map((service, index) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                        <ServiceCard elevation={0}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box
                                                    width={32}
                                                    height={32}
                                                    bgcolor="primary.main"
                                                    borderRadius="50%"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexShrink={0}
                                                >
                                                    <CheckCircle />
                                                </Box>
                                                <Typography color="text.primary" fontWeight={500}>
                                                    {service}
                                                </Typography>
                                            </Box>
                                        </ServiceCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </DoctorCard>
                    )}


                    {/* Clinics Section */}
                    <DoctorCard>
                        <DoctorCardHeader
                            title={t("website.doctor.clinics")}
                            icon={<MapPin fontSize="small" />}
                            mui={false}
                        />
                        <Stack spacing={3} mt={3}>
                            {doctor.clinics.map((clinic, index) => (
                                <DoctorCard key={index} >
                                    <Typography variant="h6">{clinic.name.en}</Typography>
                                    <Grid container spacing={2} my={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <MapPin fontSize="small" />
                                                <Typography>
                                                    {clinic.address[i18n.language as "ar" | "en"]}, {clinic.city.name[i18n.language as "ar" | "en"]}, {clinic.governorate.name[i18n.language as "ar" | "en"]}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                                                <Phone fontSize="small" />
                                                <Typography>{clinic.phone}</Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    <Stack bgcolor={(theme) => alpha(theme.palette.primary.main, 0.1)} p={2} borderRadius={1} spacing={2}>
                                        <DoctorCardHeader
                                            title={t("website.doctor.appointmentsSchedule")}
                                            icon={<Calendar fontSize="small" />}
                                            mui={false}
                                        />
                                        {clinic.appointments.map((app, idx) => (
                                            <Grid key={idx} container justifyContent="space-between">
                                                <Typography>{Days.find(e => e.slug === app.day)?.name[i18n.language as "ar" | "en"]}</Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Clock size={16} />
                                                    <Typography>{formatTime(app.timeFrom, i18n.language as "ar" | "en")} - {formatTime(app.timeTo, i18n.language as "ar" | "en")}</Typography>
                                                </Stack>
                                            </Grid>
                                        ))}
                                    </Stack>
                                </DoctorCard>
                            ))}
                        </Stack>
                    </DoctorCard>

                    {/* FAQs Section */}
                    <DoctorCard>
                        <DoctorCardHeader
                            title={t("website.doctor.faqs")}
                            icon={<HelpCircle />}
                            mui={false}
                        />
                        {doctor.faqs.map((faq, index) => (
                            <Accordion key={index} sx={{ mb: 2 }} defaultExpanded={index === 0}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls={`${index}-content`}
                                    id={`${index}-header`}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {faq.question[i18n.language as "ar" | "en"]}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">{faq.answer[i18n.language as "ar" | "en"]}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </DoctorCard>

                    {/* Articles Section */}
                    <DoctorCard>
                        <DoctorCardHeader
                            title={t("website.doctor.articles")}
                            icon={<FileText />}
                            mui={false}
                        />
                        {doctor.articles.map((article, index) => (
                            <Accordion key={index} sx={{ mb: 2 }} defaultExpanded={index === 0}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls={`${index}-content`}
                                    id={`${index}-header`}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {article.title[i18n.language as "ar" | "en"]}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">{article.content[i18n.language as "ar" | "en"]}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </DoctorCard>

                    {/* Videos Section */}
                    {/* {doctor.videos.length > 0 && (
                        <DoctorCard>
                            <Typography variant="h5" gutterBottom>
                                <Play fontSize="small" style={{ marginRight: 8 }} />
                                Educational Videos
                            </Typography>
                            <Grid container spacing={3} mt={2}>
                                {doctor.videos.map((video, index) => (
                                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                                        <Box
                                            sx={{
                                                bgcolor: '#e0e0e0',
                                                aspectRatio: '16/9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 2,
                                                mb: 1
                                            }}
                                        >
                                            <Play size={40} color="#9e9e9e" />
                                        </Box>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">{video.type}</Typography>
                                            <Button size="small" href={video.link} target="_blank" rel="noopener noreferrer">
                                                Watch Video
                                            </Button>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </DoctorCard>
                    )} */}

                    {/* Social Media */}

                    <DoctorCard>
                        <DoctorCardHeader
                            title={t("website.doctor.social")}
                            icon={"account_circle"}
                        />
                        <Stack direction="row" spacing={2}>
                            {doctor.social.map((item, index) => (
                                <IconButton
                                    key={index}
                                    component="a"
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ bgcolor: '#f0f0f0', '&:hover': { bgcolor: '#e0e0e0' } }}
                                >
                                    {getSocialIcon(item.type)}
                                </IconButton>
                            ))}
                        </Stack>
                        <Divider sx={{ my: 3 }} />
                        <Stack direction="row" spacing={4} justifyContent="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Phone size={16} />
                                <Typography>{doctor.phone.replace("+20", "")}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <MessageCircle size={16} />
                                <Typography>{doctor.whatsApp.replace("+20", "")}</Typography>
                            </Stack>
                        </Stack>
                    </DoctorCard>
                </Stack>
            </Container>
        </Box>
    );
};

export default DoctorProfile;


const DoctorCard = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    {children}
                </Stack>
            </CardContent>
        </Card>
    )
}

const DoctorCardHeader = ({
    title,
    icon,
    mui = true
}: {
    title: string,
    icon: string | React.ReactNode,
    mui?: boolean
}) => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            {mui ? <IconStyle  >
                <Icon color='primary' >
                    {icon}
                </Icon>
            </IconStyle> :
                <IconStyle>{icon}</IconStyle>
            }
            <Typography variant="h5" gutterBottom color='primary'>
                {title}
            </Typography>
        </Stack>
    )
}
