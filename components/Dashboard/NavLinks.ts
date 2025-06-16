
import useDashboard from "@/hooks/useDashboard";
import {
    Campaign,
    Inventory2Outlined,
    InventoryOutlined,
    PeopleOutlineOutlined,
    Settings
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
}

export const useLinksList = () => {
    const { t } = useTranslation()
    const context = useDashboard()

    const linksList: LinkItem[] = [
        ...(context?.state.user?.role === 'admin' ? [
            {
                pathname: "/dashboard/users",
                primary: "المستخدمين",
                icon: PeopleOutlineOutlined,
                regex: /\/users(\/|$)/,
            },
            {
                pathname: "/dashboard/accounts",
                primary: "حسابات المستخدمين",
                icon: PeopleOutlineOutlined,
                regex: /\/accounts(\/|$)/,
            }
        ] : [
            {
                pathname: "/dashboard/account",
                primary: "حسابك",
                icon: PeopleOutlineOutlined,
                regex: /\/account(\/|$)/,
            },
        ]),
        {
            primary: "البيانات",
            collapse: "data",

            children: [
                {
                    pathname: "/dashboard/faqs",
                    primary: "الأسئلة الشائعة",
                    icon: Inventory2Outlined,
                    regex: /\/faqs(\/|$)/,
                },
                {
                    pathname: "/dashboard/articles",
                    primary: "المقالات",
                    icon: Inventory2Outlined,
                    regex: /\/articles(\/|$)/,
                },
                {
                    pathname: "/dashboard/social-media",
                    primary: "سوشيل ميديا",
                    icon: Inventory2Outlined,
                    regex: /\/social-media(\/|$)/,
                },
            ]
        },
        {
            pathname: "/dashboard/testimonials",
            primary: "اراء العملاء",
            icon: Settings,
        },
    ];

    return linksList
}