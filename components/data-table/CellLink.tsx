import { styled } from "@mui/material/styles";
import Link from "next/link";

const Root = styled("div")(({ theme }) => ({
    // background: theme.palette.background.default,
    "a": {
        textDecoration: "none",
        color: theme.palette.primary.main,
        opacity: 1,
        [`&:hover`]: {
            textDecoration: "underline",
        },
    }
}));


export const CellLink = ({ to, children, target }: {
    to: string,
    children: React.ReactNode,
    target?: "_blank" | "_parent" | "_self" | "_top"
}) => {
    return (
        <Root>
            {children ? <Link href={to} target={target ?? "_self"} rel="noopener noreferrer">
                {children}
            </Link> : "ــــ"}
        </Root>
    )
}