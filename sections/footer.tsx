import SiteLogo from '@/components/SiteLogo';
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

export default function Footer() {
    return (
        <Box bgcolor="grey.900" color="common.white" py={12}>
            <Container>
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <SiteLogo color="#fff" />
                        <Typography variant="body2" color="grey.500" mb={2}>
                            منصة طبية شاملة تجمع أفضل الأطباء في مكان واحد لتسهيل الوصول إلى الرعاية الصحية المناسبة.
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                            روابط سريعة
                        </Typography>
                        <Stack spacing={1}>
                            {['جميع التخصصات', 'الأطباء المميزون', 'احجز موعد', 'تسجيل طبيب جديد'].map((text, i) => (
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
                    </Grid>

                    {/* Support */}
                    <Grid size={{ xs: 12, md: 3 }}>
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
                    </Grid>

                    {/* Contact */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                            تواصل معنا
                        </Typography>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Phone size={20} color="#f87171" />
                                <Typography color="grey.500">920000000</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <MessageCircle size={20} color="#f87171" />
                                <Typography color="grey.500">info@doctorك.com</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <MapPin size={20} color="#f87171" />
                                <Typography color="grey.500">الرياض، المملكة العربية السعودية</Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: 'grey.800', my: 4 }} />
                <Typography variant="body2" color="grey.500" align="center">
                    © 2024 دكتورك. جميع الحقوق محفوظة.
                </Typography>
            </Container>
        </Box>
    );
}
