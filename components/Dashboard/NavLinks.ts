import { useAppSelector } from "@/Store/store";
import {
    BookmarkAdded,
    Inventory2Outlined,
    PeopleOutlineOutlined,
    Settings,
    ThumbUp
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
interface LinkItem {
    pathname?: string;
    primary: string;
    icon?: React.ElementType;
    permission?: string;
    action?: () => void;
    children?: LinkItem[];
    sectionName?: string;
    id?: string;
    regex?: RegExp;
    collapse?: string;
    show?: boolean;
    isPremium?: boolean;
    soon?: boolean;
}

export const useLinksList = () => {
    const { t } = useTranslation()
    // ✅ Correct usage: Only select the auth slice
    const auth = useAppSelector((state) => state.auth);

    const linksList: LinkItem[] = [
        ...(auth?.user?.role === 'admin' ? [
            {
                pathname: "/dashboard/users",
                primary: t("navDrawer.users"),
                icon: PeopleOutlineOutlined,
                regex: /\/users(\/|$)/,
            },
            {
                pathname: "/dashboard/accounts",
                primary: t("navDrawer.usersAccounts"),
                icon: PeopleOutlineOutlined,
                regex: /\/accounts(\/|$)/,
            }
        ] : [
            {
                pathname: "/dashboard/account",
                primary: t("navDrawer.account"),
                icon: PeopleOutlineOutlined,
                regex: /\/account(\/|$)/,
            },
        ]),
        {
            primary: t("navDrawer.information"),
            collapse: "data",
            children: [
                {
                    pathname: "/dashboard/faqs",
                    primary: t("navDrawer.faq"),
                    icon: Inventory2Outlined,
                    regex: /\/faqs(\/|$)/,
                },
                {
                    pathname: "/dashboard/articles",
                    primary: t("navDrawer.articles"),
                    icon: Inventory2Outlined,
                    regex: /\/articles(\/|$)/,
                },
                {
                    pathname: "/dashboard/clinics",
                    primary: t("navDrawer.clinics"),
                    icon: Inventory2Outlined,
                    regex: /\/clinics(\/|$)/,
                },
            ]
        },
        {
            pathname: "/dashboard/testimonials",
            primary: t("navDrawer.testimonials"),
            icon: ThumbUp,
            soon: true,
            // isPremium: auth.user?.isPremium,
        },
        {
            pathname: "/dashboard/reservations",
            primary: t("navDrawer.reservations"),
            icon: BookmarkAdded,
            soon: true,
            // isPremium: auth.user?.isPremium,
        },
    ];

    return linksList;
};
