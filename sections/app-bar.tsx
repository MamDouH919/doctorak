import React, { useState } from 'react'
import { styled } from "@mui/material/styles";
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { Dashboard, Menu as MenuIcon } from "@mui/icons-material";
import Link from 'next/link';
import { useAppSelector } from '@/Store/store';

const AppBarStyle = styled(AppBar)(() => ({
    position: 'sticky',
    top: '0',
    zIndex: 50,
    width: '100%',
    backgroundColor: 'rgba(var(--background), 0.95)', // Tailwind `bg-background/95`
    backdropFilter: 'blur(10px)', // Tailwind `backdrop-blur`
    '@supports (backdrop-filter: blur(10px))': {
        backgroundColor: 'rgba(var(--background), 0.6)', // Tailwind `supports-[backdrop-filter]:bg-background/60`
    },
}));
const AppBarComponent = () => {
    const { auth } = useAppSelector(state => state);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (!element) {
            return
        }
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: "center" });
        }

        setTimeout(() => {
            handleCloseNavMenu()
        }, 800);
    };

    return (
        <AppBarStyle position="sticky" color="inherit" elevation={1}>
            <Toolbar>
                <Container>
                    <Stack direction="row" alignItems="center" spacing={2} >
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            دكتورك
                        </Typography>
                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                            <Button color="inherit" onClick={() => scrollToSection("about")}>
                                {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["About"]} */}
                            </Button>
                            <Button color="inherit" onClick={() => scrollToSection("articles")}>
                                {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["Articles"]} */}
                            </Button>
                            <Button color="inherit" onClick={() => scrollToSection("faq")}>
                                {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["FAQ"]} */}
                            </Button>
                            <Button color="inherit" onClick={() => scrollToSection("testimonials")}>
                                {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["Testimonials"]} */}
                            </Button>
                        </Box>
                        {auth.user ?
                            <Button color="primary" variant="outlined" sx={{ ml: 2 }}>
                                تسجيل الخروج
                            </Button> :
                            <Link href="/login" passHref>
                                <Button color="primary" variant="outlined" sx={{ ml: 2 }}>
                                    تسجيل الدخول
                                </Button>
                            </Link>}
                        {auth.user &&
                            <Link href="/dashboard" passHref>
                                <IconButton>
                                    <Dashboard />
                                </IconButton>
                            </Link>
                        }
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >

                                <MenuItem
                                    onClick={() => {
                                        scrollToSection("about")
                                    }}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["About"]} */}
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { scrollToSection("articles") }}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["Articles"]} */}
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { scrollToSection("faq") }}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["FAQ"]} */}
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { scrollToSection("testimonials") }}>
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {/* {translate[context?.state.clientData?.lang as "ar" | "en"]["Testimonials"]} */}
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Stack>
                </Container>
            </Toolbar>
        </AppBarStyle>
    )
}

export default AppBarComponent