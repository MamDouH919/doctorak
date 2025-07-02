import { IconButton, Stack, Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Logout, Menu } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import useDashboard from '@/hooks/useDashboard';
import LogoutDialog from '../dialogs/LogoutDialog';
import SiteLogo from '../SiteLogo';
import LanguageMenu from '../Language';
// import LogoutDialog from '../dialogs/LogoutDialog';
// import SiteLogo from '../SiteLogo';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    zIndex: 1201,
    borderBottom: '1px solid ' + theme.palette.divider,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),

}));

const Header = () => {
    const context = useDashboard();
    const [logoutDialog, setLogoutDialog] = useState(false)
    const handleCloseLogoutDialog = () => {
        setLogoutDialog(false)
    }

    return (
        <AppBar position='fixed' open={context?.state.open}>
            {logoutDialog && <LogoutDialog open={logoutDialog} handleClose={handleCloseLogoutDialog} />}
            <Toolbar>
                <IconButton
                    color="primary"
                    aria-label="open drawer"
                    onClick={() => context?.dispatch({ type: "SET_OPEN", payload: !context?.state.open })}
                    edge="start"
                >
                    <Menu />
                </IconButton>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                    <Stack component={Link} href={"/"} mx={2} sx={{ textDecoration: 'none' }}>
                        <SiteLogo />
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <Stack p={1}>
                            {/* <ChangePassword /> */}
                        </Stack>
                        <Stack alignItems={"center"}>
                            <LanguageMenu />
                        </Stack>
                        <Stack alignItems={"center"}>
                            <IconButton
                                aria-label="Profile"
                                size='medium'
                                color='primary'
                                onClick={() => setLogoutDialog(true)}
                            >
                                <Logout fontSize='inherit' />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Header