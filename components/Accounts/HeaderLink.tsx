"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const StyledLink = styled(Typography, {
    shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: active ? 700 : 500,
    position: "relative",
    textDecoration: "none",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: theme.shape.borderRadius,
    transition: "color 0.3s ease",

    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "25%",
        width: active ? "50%" : "0%",
        height: "2px",
        backgroundColor: theme.palette.primary.main,
        transition: "width 0.3s ease",
    },

    "&:hover": {
        color: theme.palette.primary.main,
        "&::after": {
            width: "50%",
        },
    },
}));

const LinkStyle = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.3s ease",
}));

export default function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <LinkStyle href={href} passHref>
            <StyledLink active={isActive} variant="body1">
                {children}
            </StyledLink>
        </LinkStyle>
    );
}
