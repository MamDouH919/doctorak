
import SiteLogo from '@/components/SiteLogo'
import { Grid } from '@mui/material'

import Link from 'next/link'
import { styled } from '@mui/material/styles';

const ImageComponent = styled('img')(({ theme }) => ({
    objectFit: "cover",
    height: "100vh",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    backgroundColor: theme.palette.background.default,
}));
const BoxLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    display: "flex",
    position: "absolute",
    top: 20,
    left: 20,
}));

const AuthLayout = ({
    children,
}: {
    children: React.ReactNode,
}) => {
    return (
        <Grid container spacing={2} height={"100vh"} justifyContent={"center"} alignItems={"center"} position={"relative"}>
            <BoxLink href={"/"}  >
                <SiteLogo />
            </BoxLink>
            <Grid size={{ xs: 12, sm: 6, }}
                height={"100vh"}
                overflow={"auto"}
                justifyContent={"center"}
                alignItems={"center"}
                display={"flex"}
            >
                {children}
            </Grid>
            <Grid
                size={{ xs: 12, sm: 6, }}
                display={{ xs: "none", sm: "block" }}
                height={"100vh"}
                position={"relative"}
            >
                <ImageComponent
                    src={"/auth-bg.jpg"}
                    alt="login-bg"
                // style={{
                //     objectFit: "cover",
                //     height: "100vh",
                //     width: "100%",
                //     position: "absolute",
                //     top: 0,
                //     left: 0,
                //     zIndex: -1,
                // }}
                />
            </Grid>
        </Grid>
    )
}

export default AuthLayout