import React, { useState, useContext } from "react";
import {
    Collapse,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    ExpandLess, ExpandMore,
    SpaceDashboard
} from "@mui/icons-material";
import clsx from "clsx";
import useWidth, { isWidthDown } from "../../helperFunctions/useWidth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLinksList } from "./NavLinks";
import { DashboardContext } from "@/context/Contexts";
import { DRAWER_WIDTH } from "@/lib/constant";

interface LinkItem {
    pathname: string;
    primary: string;
    icon: React.ElementType;
    permission?: string;
    action?: () => void;
    children?: LinkItem[];
    sectionName?: string;
    id?: string;
    regex?: RegExp;
}

const PREFIX = "NavDrawer";

const classes = {
    listItemFocus: `${PREFIX}-listItemFocus`,
    navLink: `${PREFIX}-navLink`,
    nestedListItem: `${PREFIX}-nestedListItem`,
    navSubItem: `${PREFIX}-navSubItem`,

    firstLetterCapital: `${PREFIX}-firstLetterCapital`,
    dashboardListItem: `${PREFIX}-dashboardListItem`,
};


const ListStyle = styled(List)(({ theme }) => ({
    padding: theme.spacing(0),
}))

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled(Drawer)(({ theme }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: DRAWER_WIDTH,
        boxSizing: 'border-box',
        zIndex: 1199
    },

    [`& .${classes.navLink}`]: {
        textDecoration: "none",
        color: theme.palette.text.primary,
    },

    [`& .${classes.dashboardListItem}`]: {
        margin: theme.spacing(1, 0),
    },
    [`& .${classes.navSubItem}`]: {
        padding: theme.spacing(0, 0.5),
        minWidth: "20px !important",
    },




    [`& .${classes.listItemFocus}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
        "& svg": {
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
    },
    [`& .${classes.firstLetterCapital}`]: {
        "&:first-letter": {
            textTransform: "capitalize",
        },
    },
}));

const ItemButtonStyle = styled(ListItemButton)(({ theme }) => ({
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0, 2, 2, 0),
    transition: "all 0.3s ease", // <--- Add transition here
    "& svg, & span": {
        transition: "color 0.3s ease", // <--- Optional: smooth color transition
    },

    ["&:hover"]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
        "& svg": {
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
    },
}));

const ItemButtonStyle2 = styled(ListItemButton)(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    borderRadius: theme.spacing(0, 2, 2, 0),
    margin: theme.spacing(1, 0),
    transition: "all 0.3s ease", // <--- Add transition here
    "& svg, & span": {
        fontSize: 16,
        transition: "color 0.3s ease", // <--- Optional: smooth color transition
    },
    ["&:hover"]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
        "& svg": {
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
    },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const NavDrawer: React.FC = () => {
    const { t } = useTranslation()
    const linksList = useLinksList()
    const pathname = usePathname();

    const [nestedList, setNestedList] = useState<string[]>(() => {
        const saved = localStorage.getItem("dashboard-nav-drawer");
        return saved ? JSON.parse(saved) : [];
    });

    const toggleNestedList = (key: string) => {
        setNestedList((prev) => {
            const newList = prev.includes(key)
                ? prev.filter(e => e !== key)
                : [...prev, key];

            console.log(newList);


            localStorage.setItem("dashboard-nav-drawer", JSON.stringify(newList));
            return newList;
        });
    };

    const context = useContext(DashboardContext);
    const screenWidth = useWidth();
    const isScreenSmall = isWidthDown("xs", screenWidth);

    return (
        <Root
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    border: "none",
                    // backgroundColor: "transparent",
                },
            }}
            variant={isScreenSmall ? "temporary" : "persistent"}
            anchor="left"
            open={context?.state.open}
        >
            <DrawerHeader />
            <Divider />
            <ListStyle>
                <Link
                    href={"/dashboard"}
                    className={clsx(classes.navLink)}
                >
                    <ItemButtonStyle
                        className={clsx(classes.dashboardListItem, {
                            [classes.listItemFocus]:
                                pathname === "/dashboard"
                        })}
                        onClick={() => isScreenSmall && context?.dispatch({ type: "SET_OPEN", payload: false })}
                    >
                        <ListItemIcon className={classes.navSubItem}>
                            <SpaceDashboard />
                        </ListItemIcon>
                        <ListItemText primary={t("navDrawer.dashboard")} className={classes.firstLetterCapital} />
                    </ItemButtonStyle>
                </Link>
                <Stack spacing={1}>
                    {linksList.map((e, i) => {
                        if (e.collapse) {
                            return (
                                <Stack key={i}>
                                    <Stack
                                        direction={"row"}
                                        justifyContent={"space-between"}
                                        alignItems={"center"}
                                        onClick={() => toggleNestedList(e.collapse!)}
                                        px={2}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <Typography
                                            color="text.primary" className={classes.firstLetterCapital}
                                            fontWeight={"bold"}
                                        >
                                            {e.primary}
                                        </Typography>
                                        {!nestedList.includes(e.collapse) ? <ExpandMore /> : <ExpandLess />}
                                    </Stack>
                                    <Collapse in={!nestedList.includes(e.collapse)} timeout="auto" unmountOnExit>
                                        <List disablePadding>
                                            {e.children?.map((child) => (
                                                <Link
                                                    key={child.primary}
                                                    href={child.pathname || ""}
                                                    className={clsx(classes.navLink)}
                                                    onClick={() => isScreenSmall && context?.dispatch({ type: "SET_OPEN", payload: false })}
                                                >
                                                    <ItemButtonStyle2
                                                        className={clsx({
                                                            [classes.listItemFocus]:
                                                                child?.regex?.test(pathname)
                                                        })}
                                                    >
                                                        <ListItemIcon className={classes.navSubItem}>
                                                            {child.icon && <child.icon />}
                                                        </ListItemIcon>
                                                        <ListItemText primary={child.primary} className={classes.firstLetterCapital} />
                                                    </ItemButtonStyle2>
                                                </Link>
                                            ))}
                                        </List>
                                    </Collapse>
                                </Stack>
                            )
                        } else {
                            return (
                                <Link
                                    href={e.pathname || ""}
                                    className={clsx(classes.navLink)}
                                    key={e.primary}
                                    onClick={() => isScreenSmall && context?.dispatch({ type: "SET_OPEN", payload: false })}
                                >
                                    <ItemButtonStyle
                                        className={clsx({
                                            [classes.listItemFocus]:
                                                e?.regex?.test(pathname)
                                        })}
                                    >
                                        <ListItemIcon className={classes.navSubItem}>
                                            {e.icon && <e.icon />}
                                        </ListItemIcon>
                                        <ListItemText primary={e.primary} />
                                    </ItemButtonStyle>
                                </Link>
                            )
                        }
                    })}
                </Stack>
            </ListStyle>
        </Root>
    );
};

export default NavDrawer;
