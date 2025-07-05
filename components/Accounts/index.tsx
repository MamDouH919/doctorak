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

    const { fields, append, remove } = useFieldArray({ control: methods.control, name: "social" });
    const { fields: videosFields, append: appendVideos, remove: removeVideos } = useFieldArray({ control: methods.control, name: "videos" });

    // mutation
    const { mutate: updateAccountMutation, isPending: updateAccountLoading } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: CreateAccount }) =>
            updateAccount(id, data),
        onError(error) {
            console.log(error);
        }
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


    const onSubmit = async (data: CreateAccount) => {
        delete data.image
        updateAccountMutation({
            id: id! ?? auth.user?.accountId,
            data: {
                ...data,
                userId: id! ?? auth.user?.id!,
                ...(typeof data.image !== "string" && { image: data.image }),
                phone: "+20" + data.phone,
                whatsApp: "+20" + data.whatsApp,
                ...(auth.user?.role === 'admin' && { domain: data.domain }),
            }
        }, {
            onSuccess: () => {
                toast.success(t("common.saveSuccess"))
            },
            onError(error) {
                toast.error(t("common.errorMessage"))
                console.log(error);
            }
        })
    }

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



    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);

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



            {/* <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Paper>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }} >
                                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                                    {t("adminPages.accountData")}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }} >
                            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                                {t("adminPages.accountData")}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, }} >
                            <SingleImageUploader
                                name='image'
                                control={methods.control}
                                accountId={id! ?? auth.user?.accountId}
                                alt={account?.data.user.name}
                                queryKey={['account', id ?? auth.user?.accountId!]}
                            />
                        </Grid>

                        {auth.user?.role === 'admin' &&
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <ControlMUITextField
                                    control={methods.control}
                                    name='domain'
                                    label={t("adminPages.domain")}
                                    rules={rules}
                                />
                            </Grid>}
                        {auth.user?.role === 'admin' &&
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <MuiSwitch
                                    control={methods.control}
                                    name='active'
                                    label={t("adminPages.active")}
                                />
                            </Grid>}
                        {auth.user?.role === 'admin' &&
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <MuiSwitch
                                    control={methods.control}
                                    name='showInHomePage'
                                    label={t("adminPages.showInHomePage")}
                                />
                            </Grid>}

                        {auth.user?.role === 'admin' &&
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <MuiSwitch
                                    control={methods.control}
                                    name='isPremium'
                                    label={t("adminPages.isPremium")}
                                />
                            </Grid>}
                        {auth.user?.role === 'admin' &&
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <ListSpecializations
                                    control={methods.control}
                                    name='specialization'
                                    label={t("adminPages.specialization")}
                                    rules={{
                                        required: methods.watch('specialization_needed') ? false : rules.required,
                                    }}
                                    disabled={!!methods.watch('specialization_needed')}
                                />
                            </Grid>
                        }
                        {auth.user?.role === 'admin' &&
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <ControlMUITextField
                                    control={methods.control}
                                    name='specialization_needed'
                                    label={t("adminPages.specialization_needed")}
                                    rules={{
                                        required: methods.watch('specialization') ? false : rules.required,
                                    }}
                                    disabled={!!methods.watch('specialization')}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title={"إذا لم تجد تخصصك، يمكنك كتابته وسنقوم بإضافته لاحقًا."}>
                                                <Info />
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Grid>
                        }
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={methods.control}
                                name='siteName'
                                label={t("adminPages.siteName")}
                                rules={rules}
                                InputProps={{
                                    endAdornment: (
                                        <TooltipComponent
                                            title={
                                                <img
                                                    src="/site-name-info.png"
                                                    alt="info"
                                                    width={"100%"}
                                                    height={"100%"}
                                                />
                                            }
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={methods.control}
                                name='title'
                                label={t("adminPages.title")}
                                rules={rules}
                                InputProps={{
                                    endAdornment: (
                                        <TooltipComponent
                                            title={
                                                <img src="/title-info.png" alt="info" width={"100%"} height={"100%"} />
                                            }
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={methods.control}
                                name='phone'
                                label={t("adminPages.phone")}
                                rules={{
                                    ...rules,
                                    validate: {
                                        onlyNumber: (value: string) => /^\d+$/.test(value) || "يجب أن يكون رقما",
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={methods.control}
                                name='whatsApp'
                                label={t("adminPages.whatsApp")}
                                rules={{
                                    ...rules,
                                    validate: {
                                        onlyNumber: (value: string) => /^\d+$/.test(value) || "يجب أن يكون رقما",
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200 }}>
                                    <HexColorPicker
                                        color={methods.watch('color')}
                                        onChange={(color: string) => methods.setValue('color', color)}
                                    />
                                </Box>
                            </Popover>

                            <ControlMUITextField
                                control={methods.control}
                                name='color'
                                label={t("adminPages.color")}
                                rules={{
                                    required: rules.required,
                                    validate: {
                                        onlyHex: (value: string) => /^#([0-9A-F]{3}){1,2}$/i.test(value) || "يجب ان يكون لون صحيحا",
                                    },
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value);
                                    if (isValidHex || value === '') {
                                        methods.setValue('color', value);
                                    }
                                }}


                                InputProps={{
                                    endAdornment: (
                                        <IconButton size="small" onClick={handleIconClick}>
                                            <ColorLens />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <ControlMUITextField
                                control={methods.control}
                                name='about'
                                label={t("adminPages.about")}
                                rules={rules}
                                multiline
                                rows={5}
                                InputProps={{
                                    endAdornment: (
                                        <TooltipComponent
                                            title={
                                                <img src="/about-info.png" alt="info" width={"100%"} height={"100%"} />
                                            }
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <ControlMUITextField
                                control={methods.control}
                                name='description'
                                label={t("adminPages.description")}
                                rules={rules}
                                multiline
                                rows={5}
                                InputProps={{
                                    endAdornment: (
                                        <TooltipComponent
                                            title={
                                                <img src="/description-info.png" alt="info" width={"100%"} height={"100%"} />
                                            }
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
                                    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                                        {t("adminPages.social")}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Add />}
                                        onClick={() => append({ type: "", link: "" })}
                                        disabled={fields.length === selectOptions.length}
                                    >
                                        {t("common.add")}
                                    </Button>
                                </Stack>
                                {fields.map((item, index) => {
                                    const filterSelectOptions = selectOptions.map(item1 => {
                                        return {
                                            ...item1,
                                            disabled: watchedItems.some((e: any) => e.type === item1.value)
                                        }
                                    });

                                    return (
                                        <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                                            <MuiSelect
                                                name={`social.${index}.type`}
                                                label={t("adminPages.type")}
                                                control={methods.control}
                                                variant="filled"
                                                data={filterSelectOptions}
                                                rules={rules}
                                            />
                                            <ControlMUITextField
                                                label={t("adminPages.link")}
                                                control={methods.control}
                                                name={`social.${index}.link`}
                                                rules={{
                                                    ...rules,
                                                    validate: {
                                                        url: (value: string) => {
                                                            try {
                                                                new URL(value);
                                                                return true;
                                                            } catch {
                                                                return "يجب أن يكون رابط صحيحا";
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                            <IconButton onClick={() => remove(index)}>
                                                <Delete />
                                            </IconButton>
                                        </Stack>
                                    );
                                })}

                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
                                    <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                                        {t("adminPages.videos")}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Add />}
                                        onClick={() => appendVideos({ type: "", link: "" })}
                                    >
                                        {t("common.add")}
                                    </Button>
                                </Stack>
                                {videosFields.map((item, index) => {
                                    const selectOptions = [
                                        { value: "facebook", key: "Facebook" },
                                        { value: "instagram", key: "Instagram" },
                                        { value: "tikTok", key: "TikTok" },
                                        { value: "youtube", key: "Youtube" },
                                    ]

                                    return (
                                        <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                                            <MuiSelect
                                                name={`videos.${index}.type`}
                                                label={t("adminPages.type")}
                                                control={methods.control}
                                                variant="filled"
                                                data={selectOptions}
                                                rules={rules}
                                            />
                                            <ControlMUITextField
                                                label={t("adminPages.link")}
                                                control={methods.control}
                                                name={`videos.${index}.link`}
                                                rules={{
                                                    ...rules,
                                                    validate: {
                                                        url: (value: string) => {
                                                            try {
                                                                new URL(value);
                                                                return true;
                                                            } catch {
                                                                return "يجب أن يكون رابط صحيحا";
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                            <IconButton onClick={() => removeVideos(index)}>
                                                <Delete />
                                            </IconButton>
                                        </Stack>
                                    );
                                })}

                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <Button variant='contained' type='submit' fullWidth loading={updateAccountLoading || isLoading}>
                                {t("common.submit")}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider> */}

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