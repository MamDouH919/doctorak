"use client"
import SiteLogo from '@/components/SiteLogo';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
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
import { useTranslation } from 'react-i18next';


export default function Footer() {
    const { t } = useTranslation()
    const auth = useAppSelector((state) => state.auth)
    const { getLocalizedPath } = useLocalizedRouter();

    const FooterLinks = [
        {
            label: t("website.footer.allSpecialties"),
            link: "/specialties"
        },
        {
            label: t("website.footer.allDoctors"),
            link: "/doctors"
        },
        {
            label: t("website.footer.createNewDoctor"),
            link: "/doctors"
        }
    ]

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
                            <SiteLogo />
                        </Stack>
                        <Typography variant="body2" color="grey.500" mb={2}>
                            {t("website.footer.description")}
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                            {t("website.footer.quickLinks")}
                        </Typography>



                        <Stack spacing={1}>
                            {FooterLinks.map((text, i) => (
                                <Link
                                    key={i}
                                    href={getLocalizedPath(text.link)}
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
                    {t("website.footer.copyright")}
                </Typography>
            </Container>
        </Box>
    );
}
