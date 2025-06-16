import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import useWidth, { isWidthDown } from '../../helperFunctions/useWidth';
import { DRAWER_WIDTH } from '@/lib/constant';
import useDashboard from '@/hooks/useDashboard';

const MainPage = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean; }>(({ theme, open }) => ({
    flexGrow: 1,
    // padding: theme.spacing(3),
    height: "100dvh",
    // minHeight: "100%",
    overflow: "hidden",
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${DRAWER_WIDTH}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Main = ({ children }: React.PropsWithChildren) => {
    const context = useDashboard();
    const screenWidth = useWidth();
    const isScreenSmall = isWidthDown("xs", screenWidth);
    return (
        <MainPage open={isScreenSmall ? true : context?.state.open}>
            <Stack height={"100dvh"}>
                <DrawerHeader />
                <Stack flexGrow={1} overflow={"auto"}>
                    {/* <Link href="/admin">Home</Link>
                    <Link href="/admin/services">services</Link> */}
                    {children}
                </Stack>
            </Stack>
        </MainPage>
    )
}

export default Main