import { useAppSelector } from "@/Store/store";
import {
    BookmarkAdded,
    Inventory2Outlined,
    PeopleOutlineOutlined,
    Settings,
    ThumbUp
} from "@mui/icons-material";
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
    // ✅ Correct usage: Only select the auth slice
    const auth = useAppSelector((state) => state.auth);    

    const linksList: LinkItem[] = [
        ...(auth?.user?.role === 'admin' ? [
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
                    pathname: "/dashboard/clinics",
                    primary: "العيادات والمستشفيات",
                    icon: Inventory2Outlined,
                    regex: /\/clinics(\/|$)/,
                },
            ]
        },
        {
            pathname: "/dashboard/testimonials",
            primary: "التقيمات",
            icon: ThumbUp,
            soon: true,
            // isPremium: auth.user?.isPremium,
        },
        {
            pathname: "/dashboard/testimonials",
            primary: "الحجوزات",
            icon: BookmarkAdded,
            soon: true,
            // isPremium: auth.user?.isPremium,
        },
    ];

    return linksList;
};
