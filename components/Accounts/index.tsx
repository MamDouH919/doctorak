"use client"

import ControlMUITextField from "@/components/MUI/ControlMUItextField"
import MuiSelect from "@/components/MUI/MuiSelect"
import { fetchAccount, updateAccount } from "@/lib/api/accounts"
import { useAppSelector } from "@/Store/store"
import { CreateAccount } from "@/types/account"
import { Add, ColorLens, Delete, Info } from "@mui/icons-material"
import { Box, Button, Grid, IconButton, Paper, Popover, Stack, Tooltip, Typography } from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import moment from "moment"
import { Appointments } from "./Appointments"
import { HexColorPicker } from "react-colorful"
import useDashboard from "@/hooks/useDashboard"
import MuiSwitch from "../MUI/MuiSwitch"

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

const getTime = (time: string | Date) => moment(time).locale("en").format('HH:mm');
const stringFormatToDate = (date: string) => moment(date, "HH:mm").locale("en").toDate();

const Days = [
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
    'الأحد',
];

const Accounts = ({ id }: { id?: string }) => {
    const context = useDashboard();

    const methods = useForm<CreateAccount>({
        defaultValues: {
            appointments: Days.map(day => ({
                day,
                timeFrom: undefined,
                timeTo: undefined,
                checked: false,
            })),
        }
    })
    const { auth } = useAppSelector((state) => state)

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
            methods.setValue('title', account.data.title)
            methods.setValue('phone', account.data.phone ? account.data.phone.replace("+20", "") : "")
            methods.setValue('whatsApp', account.data.whatsApp ? account.data.whatsApp.replace("+20", "") : "")
            methods.setValue('description', account.data.description)
            methods.setValue('color', account.data.color)
            methods.setValue('lang', account.data.lang)
            methods.setValue('about', account.data.about)
            methods.setValue('showInHomePage', account.data.showInHomePage)
            methods.setValue('isPremiumAccount', account.data.isPremiumAccount)
            methods.setValue('domain', account.data.domain)
            methods.setValue('social', account.data.social)
            methods.setValue('videos', account.data.videos)

            const appointmentsFromBackend = account.data.appointments || [];

            const updatedAppointments = Days.map((day) => {
                const matched = appointmentsFromBackend.find((a: any) => a.day === day);
                return {
                    day,
                    timeFrom: stringFormatToDate(matched?.timeFrom) || undefined,
                    timeTo: stringFormatToDate(matched?.timeTo) || undefined,
                    checked: !!matched,
                };
            });

            methods.setValue('appointments', updatedAppointments);
        }

        return () => { }
    }, [account])


    const onSubmit = async (data: CreateAccount) => {
        updateAccountMutation({
            id: id! ?? auth.user?.accountId,
            data: {
                ...data,
                userId: id! ?? auth.user?.id!,
                appointments: data.appointments.filter(e => e.checked).map(e => ({
                    day: e.day,
                    timeFrom: getTime(e.timeFrom),
                    timeTo: getTime(e.timeTo)
                })),
                phone: "+20" + data.phone,
                whatsApp: "+20" + data.whatsApp,
                ...(auth.user?.role === 'admin' && { domain: data.domain }),
            }
        }, {
            onSuccess: () => {
                toast.success("تم تعديل الحساب بنجاح")
            },
            onError(error) {
                toast.error("خطأ في تعديل الحساب")
                console.log(error);
            }
        })
    }

    useEffect(() => {
        context?.dispatch({
            type: "SET_BREADCRUMB_LINKS",
            payload: [
                { label: "حسابك" }
            ],
        });

        return () => { context?.dispatch({ type: "RESET_STATE" }) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const rules = {
        required: "هذا الحقل مطلوب",
    }

    const watchedItems = useWatch({
        control: methods.control,
        name: "social",
    });


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);

    if (isLoading) {
        return <div>loading...</div>
    }


    return (
        <div>
            <Paper sx={{ padding: 2 }}>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }} >
                                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                                    بيانات الحساب
                                </Typography>
                            </Grid>
                            {auth.user?.role === 'admin' &&
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                    <ControlMUITextField
                                        control={methods.control}
                                        name='domain'
                                        label={"النطاق"}
                                        rules={rules}
                                    />
                                </Grid>}
                            {auth.user?.role === 'admin' &&
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                    <MuiSwitch
                                        control={methods.control}
                                        name='showInHomePage'
                                        label={"اظهار في الصفحة الرئيسية"}
                                    />
                                </Grid>}
                            {auth.user?.role === 'admin' &&
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                    <MuiSwitch
                                        control={methods.control}
                                        name='isPremiumAccount'
                                        label={"حساب مميز"}
                                    />
                                </Grid>}
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <ControlMUITextField
                                    control={methods.control}
                                    name='siteName'
                                    label={"اسم الموقع"}
                                    rules={rules}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title={
                                                <img src="/site-name-info.png" alt="info" width={"100%"} height={"100%"} />
                                            }>
                                                <Info />
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <ControlMUITextField
                                    control={methods.control}
                                    name='title'
                                    label={"العنوان"}
                                    rules={rules}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title={
                                                <img src="/title-info.png" alt="info" width={"100%"} height={"100%"} />
                                            }>
                                                <Info />
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <ControlMUITextField
                                    control={methods.control}
                                    name='phone'
                                    label={"رقم الهاتف"}
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
                                    label={"الواتس اب"}
                                    rules={{
                                        ...rules,
                                        validate: {
                                            onlyNumber: (value: string) => /^\d+$/.test(value) || "يجب أن يكون رقما",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <Popover
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                >
                                    <Box sx={{ p: 2 }}>
                                        <HexColorPicker
                                            color={methods.watch('color')}
                                            onChange={(color: string) => methods.setValue('color', color)}
                                        />
                                    </Box>
                                </Popover>
                                <ControlMUITextField
                                    control={methods.control}
                                    name='color'
                                    label={"اللون"}
                                    rules={rules}
                                    readOnly
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                size='small'
                                                onClick={handleIconClick}
                                            >

                                                <ColorLens />
                                            </IconButton>
                                        ),
                                    }}
                                />
                                {/* <MUIColorPicker name="color" control={methods.control} label="Pick a color" /> */}
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <MuiSelect
                                    control={methods.control}
                                    name='lang'
                                    label={"اللغة"}
                                    data={[
                                        { value: "ar", key: "العربية" },
                                        { value: "en", key: "الإنجليزية" },
                                    ]}
                                    rules={rules}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }} >
                                <ControlMUITextField
                                    control={methods.control}
                                    name='about'
                                    label={"المعلومات الشاملة"}
                                    rules={rules}
                                    multiline
                                    rows={5}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title={
                                                <img src="/about-info.png" alt="info" width={"100%"} height={"100%"} />
                                            }>
                                                <Info />
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }} >
                                <ControlMUITextField
                                    control={methods.control}
                                    name='description'
                                    label={"الوصف"}
                                    rules={rules}
                                    multiline
                                    rows={5}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip title={
                                                <img src="/description-info.png" alt="info" width={"100%"} height={"100%"} />
                                            }>
                                                <Info />
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }} >
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
                                        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                                            التواصل الاجتماعي
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Add />}
                                            onClick={() => append({ type: "", link: "" })}
                                            disabled={fields.length === selectOptions.length}
                                        >
                                            إضافة
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
                                                    label="النوع"
                                                    control={methods.control}
                                                    variant="filled"
                                                    data={filterSelectOptions}
                                                    rules={rules}
                                                />
                                                <ControlMUITextField
                                                    label="الرابط"
                                                    control={methods.control}
                                                    name={`social.${index}.link`}
                                                    rules={{
                                                        ...rules,
                                                        validate: {
                                                            url: (value: string) =>
                                                                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value) ||
                                                                "يجب أن يكون رابط صحيحا",
                                                        },
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
                                            الفديوهات
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Add />}
                                            onClick={() => appendVideos({ type: "", link: "" })}
                                        >
                                            إضافة
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
                                                    label="النوع"
                                                    control={methods.control}
                                                    variant="filled"
                                                    data={selectOptions}
                                                    rules={rules}
                                                />
                                                <ControlMUITextField
                                                    label="الرابط"
                                                    control={methods.control}
                                                    name={`videos.${index}.link`}
                                                    rules={{
                                                        ...rules,
                                                        validate: {
                                                            url: (value: string) =>
                                                                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value) ||
                                                                "يجب أن يكون رابط صحيحا",
                                                        },
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
                                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                                    المواعيد
                                </Typography>
                                <Appointments />
                            </Grid>

                            <Grid size={{ xs: 12 }} >
                                <Button variant='contained' type='submit' fullWidth loading={updateAccountLoading || isLoading}>
                                    إنشاء حساب
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Paper>
        </div>
    )
}

export default Accounts