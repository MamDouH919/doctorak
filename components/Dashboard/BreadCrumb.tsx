import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import Link from "next/link";
import { DashboardContext } from "@/context/Contexts";
import { useTranslation } from "react-i18next";


const LinkStyle = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    transition: "all 0.2s ease-in-out",
    color: theme.palette.primary.main,
    "&:hover": {
        textDecoration: "underline",

    },
}));

const Breadcrumb = () => {
    const context = React.useContext(DashboardContext);
    const { t } = useTranslation()
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            bgcolor={"background.paper"}
            px={2}
            height={"40px"}
        >
            <Breadcrumbs aria-label="breadcrumb">
                {/* Set condition here to display it only if there is a landing page */}
                {/* <Link
                    color="inherit"
                    href="/"
                >
                    {"home"}
                </Link> */}

                <LinkStyle
                    color="inherit"
                    href="/dashboard"
                >
                    {t("breadCrumb.dashboard")}
                </LinkStyle>

                {context?.state.breadcrumbLinks && context?.state.breadcrumbLinks.map((value, index) => {
                    let last;
                    if (context?.state.breadcrumbLinks) {
                        last = index === context?.state.breadcrumbLinks.length - 1;
                    }

                    return last ? (
                        <Typography
                            key={index}
                            sx={{ color: "text.primary" }}
                            textTransform={"capitalize"}
                        >
                            {/* {} */}
                            {value.label}
                        </Typography>
                    ) : (
                        <LinkStyle
                            key={index}
                            color="inherit"
                            href={value.link!}
                        >
                            {value.label}
                        </LinkStyle>
                    );
                })}
            </Breadcrumbs>
            <Box>
                {context?.state.pageActions}
            </Box>
        </Stack>
    );
};

export default Breadcrumb;