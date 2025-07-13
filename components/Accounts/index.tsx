"use client"

import ControlMUITextField from "@/components/MUI/ControlMUItextField"
import MuiSelect from "@/components/MUI/MuiSelect"
import { fetchAccount, updateAccount } from "@/lib/api/accounts"
import { useAppSelector } from "@/Store/store"
import { CreateAccount } from "@/types/account"
import { Add, ColorLens, Delete, Info } from "@mui/icons-material"
import { Box, Button, CircularProgress, Grid, IconButton, Paper, Popover, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { HexColorPicker } from "react-colorful"
import useDashboard from "@/hooks/useDashboard"
import MuiSwitch from "../MUI/MuiSwitch"
import ListSpecializations from "../customAutoCompolete/ListSpecializations"
import { SingleImageUploader } from "../MUI/FileUpload"
import { useTranslation } from "react-i18next"
import { styled } from "@mui/material/styles";
import DoctorData from "./DoctorData"
import { useEffect, useState } from "react"
import VideosAndSocial from "./VideosAndSocial"
import Admin from "./Admin"

// import Details from "@/Sections/Details"

const selectOptions = [
    { value: "facebook", key: "Facebook", disabled: false },
    { value: "instagram", key: "Instagram", disabled: false },
    { value: "tikTok", key: "TikTok", disabled: false },
    { value: "twitter", key: "Twitter", disabled: false },
    { value: "snapChat", key: "SnapChat", disabled: false },
    { value: "youtube", key: "Youtube", disabled: false },
    { value: "group", key: "Group", disabled: false },
    { value: "Share", key: "Share", disabled: false },
    { value: "website", key: "Website", disabled: false },
]

const TabsStyle = styled(Tabs)(({ theme }) => ({
    "& .MuiTabs-flexContainer": {
        gap: theme.spacing(2),
    },
    // when indicator is active make background color green

}));

const TabStyle = styled(Tab)(() => ({
    // Common styles for all tabs
    fontWeight: "bold",
    fontSize: "1rem",
}));

const Accounts = ({ id }: { id?: string }) => {
    const context = useDashboard();
    const { t, i18n } = useTranslation()
    const methods = useForm<CreateAccount>({
        defaultValues: {
            color: '#FFFFFF',
        }
    })
    const auth = useAppSelector((state) => state.auth)

    const { data: account, isLoading } = useQuery({
        queryKey: ['account', id ?? auth.user?.accountId],
        queryFn: () => fetchAccount(id ?? auth.user?.accountId),
        enabled: !!id || !!auth.user?.accountId,
    });

    useEffect(() => {
        if (account) {
            methods.setValue('title', account.data.title?.[i18n.language])
            methods.setValue('phone', account.data.phone ? account.data.phone.replace("+20", "") : "")
            methods.setValue('whatsApp', account.data.whatsApp ? account.data.whatsApp.replace("+20", "") : "")
            methods.setValue('description', account.data.description?.[i18n.language])
            methods.setValue('color', account.data.color)
            // methods.setValue('lang', account.data.lang)
            methods.setValue('about', account.data.about?.[i18n.language])
            methods.setValue('showInHomePage', account.data.showInHomePage)
            methods.setValue('isPremium', account.data.isPremium)
            methods.setValue('domain', account.data.domain)
            methods.setValue('social', account.data.social)
            methods.setValue('videos', account.data.videos)
            methods.setValue('active', account.data.active)
            methods.setValue('siteName', account.data.siteName?.[i18n.language])
            methods.setValue('specialization', account.data?.specialization)
            methods.setValue('specialization_needed', account.data?.specialization_needed)

            if (account.data?.image?.url) {
                methods.setValue('image', account.data?.image?.url)
            }


            const appointmentsFromBackend = account.data.appointments || [];
        }

        return () => { }
    }, [account, t])


    useEffect(() => {
        context?.dispatch({
            type: "SET_BREADCRUMB_LINKS",
            payload: [
                { label: t("breadCrumb.yourAccount") }
            ],
        });

        return () => { context?.dispatch({ type: "RESET_STATE" }) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t])

    const rules = {
        required: t("common.required"),
    }

    const [selectedTab, setSelectedTab] = useState(0);
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    if (isLoading) {
        return <Stack
            height={"100%"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <CircularProgress />
        </Stack>
    }


    const TABS = [
        {
            id: "doctorData",
            name: t("adminPages.doctorData"),
        },
        {
            id: "videosAndSocial",
            name: t("adminPages.videosAndSocial"),
        },
    ]
    const TABPANEL = [
        {
            id: "doctorData",
            panel: <DoctorData account={account} userId={id} />
        },
        {
            id: "videosAndSocial",
            panel: <VideosAndSocial account={account} userId={id} />
        },
    ]

    if (auth.user?.role === 'admin') {
        TABS.push({
            id: "admin",
            name: t("adminPages.admin"),
        })
        TABPANEL.push({
            id: "admin",
            panel: <Admin account={account} userId={id} />
        })
    }


    return (
        <div>
            <TabsStyle
                value={selectedTab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Clinic Tabs"
            >
                {TABS.map((tab) => (
                    <TabStyle key={tab.id} label={tab.name} />
                ))}
            </TabsStyle>

            {TABPANEL.map((panel, index: number) => (
                <Box
                    key={panel.id}
                    role="tabpanel"
                    hidden={selectedTab !== index}
                    sx={{ mt: 4 }}
                >
                    {selectedTab === index && (
                        panel.panel
                    )}
                </Box>
            ))}
        </div>
    )
}

export default Accounts

export const TooltipComponent = ({ title }: { title: string | React.ReactNode }) => {
    return <Tooltip
        sx={{
            cursor: "pointer",
            fontSize: "25px",
        }}
        title={
            title
        }
    >
        <Info />
    </Tooltip>
}