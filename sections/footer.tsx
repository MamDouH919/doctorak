"use client"
import SiteLogo from '@/components/SiteLogo';
import { useAppSelector } from '@/Store/store';
import {
    Box,
    Container,
    Divider,
    Grid,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import { Stethoscope, Phone, MessageCircle, MapPin } from 'lucide-react';

const FooterLinks = [
    {
        label: "جميع التخصصات",
        link: "/specialties"
    },
    {
        label: "جميع الدكاترة",
        link: "/doctors"
    },
    {
        label: "تسجيل دكتور جديد",
        link: "/doctors"
    }
]
export default function Footer() {
    const auth = useAppSelector((state) => state.auth)
    if (auth.user) {
        FooterLinks.pop()
    }
    return (
        <Box bgcolor="grey.900" color="common.white" py={12}>
            <Container>
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid size={{ xs: 12, md: 6 }} display={"flex"} gap={1} flexDirection={"column"}>
                        <Stack alignItems={"flex-start"}>
                            <SiteLogo color="#fff" />
                        </Stack>
                        <Typography variant="body2" color="grey.500" mb={2}>
                            منصة طبية شاملة تجمع أفضل الدكاترة في مكان واحد لتسهيل الوصول إلى الرعاية الصحية المناسبة.
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                            روابط سريعة
                        </Typography>



                        <Stack spacing={1}>
                            {FooterLinks.map((text, i) => (
                                <Link
                                    key={i}
                                    href={text.link}
                                    underline="hover"
                                    color="grey.500"
                                    sx={{ '&:hover': { color: 'common.white' } }}
                                >
                                    {text.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Support */}
                    {/* <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                            الدعم
                        </Typography>
                        <Stack spacing={1}>
                            {['مركز المساعدة', 'الأسئلة الشائعة', 'سياسة الخصوصية', 'شروط الاستخدام'].map((text, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    underline="hover"
                                    color="grey.500"
                                    sx={{ '&:hover': { color: 'common.white' } }}
                                >
                                    {text}
                                </Link>
                            ))}
                        </Stack>
                    </Grid> */}

                    {/* Contact */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                            تواصل معنا
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Phone size={20} color="#f87171" />
                                <Typography color="grey.500" component={Link} href="tel:+201157872277">
                                    {/* <Link href="tel:+201157872277"> */}
                                    01157872277
                                    {/* </Link> */}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <MessageCircle size={20} color="#f87171" />
                                <Typography color="grey.500">dakatrah.site@gmail.com</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <MapPin size={20} color="#f87171" />
                                <Typography color="grey.500">جمهورية مصر العربية</Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: 'grey.800', my: 4 }} />
                <Typography variant="body2" color="grey.500" align="center">
                    © 2024 دكاترة. جميع الحقوق محفوظة.
                </Typography>
            </Container>
        </Box>
    );
}
