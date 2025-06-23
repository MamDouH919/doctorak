"use client"
import React, { useState } from 'react'
import { styled } from "@mui/material/styles";
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { Dashboard, Menu as MenuIcon } from "@mui/icons-material";
import Link from 'next/link';
import { useAppSelector } from '@/Store/store';
import HeaderLink from '@/components/Accounts/HeaderLink';
import SiteLogo from '@/components/SiteLogo';
import LogoutDialog from '@/components/dialogs/LogoutDialog';

const AppBarStyle = styled(AppBar)(({ theme }) => ({
    position: 'sticky',
    top: '0',
    zIndex: 50,
    width: '100%',
    backgroundColor: 'rgba(var(--background), 0.95)', // Tailwind `bg-background/95`
    backdropFilter: 'blur(10px)', // Tailwind `backdrop-blur`
    '@supports (backdrop-filter: blur(10px))': {
        backgroundColor: 'rgba(var(--background), 0.6)', // Tailwind `supports-[backdrop-filter]:bg-background/60`
    },
    '.app-bar': {
        padding: theme.spacing(0),
    }
}));


const AppBarComponent = () => {
    const auth = useAppSelector(state => state.auth);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [logoutDialog, setLogoutDialog] = useState(false)
    const handleCloseLogoutDialog = () => {
        setLogoutDialog(false)
    }

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
            <LogoutDialog open={logoutDialog} handleClose={handleCloseLogoutDialog} />
            <Toolbar className='app-bar'>
                <Container>
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent={"space-between"}>
                        <Stack component={Link} href={"/"} mx={2} sx={{ textDecoration: 'none' }}>
                            <SiteLogo />
                        </Stack>
                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }} justifyContent={"center"}>
                            <HeaderLink href="/doctors">الدكاترة</HeaderLink>
                            <HeaderLink href="/specialties">التخصصات</HeaderLink>
                        </Box>
                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                            {auth.user ?
                                <Button color="primary" variant="outlined" sx={{ ml: 2 }}
                                    onClick={() => setLogoutDialog(true)}
                                >
                                    تسجيل الخروج
                                </Button> :
                                <Link href="/login" passHref>
                                    <Button color="primary" variant="outlined" sx={{ ml: 2 }}>
                                        تسجيل الدخول
                                    </Button>
                                </Link>}
                            {auth.user &&
                                <Link href="/dashboard" passHref>
                                    <IconButton size="small">
                                        <Dashboard />
                                    </IconButton>
                                </Link>
                            }
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="small"
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
                                    <MenuItem>
                                        <HeaderLink href="/doctors">الدكاترة</HeaderLink>
                                    </MenuItem>
                                    <MenuItem onClick={() => { scrollToSection("faq") }}>
                                        <HeaderLink href="/specialties">التخصصات</HeaderLink>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Stack>
                    </Stack>
                </Container>
            </Toolbar>
        </AppBarStyle>
    )
}

export default AppBarComponent