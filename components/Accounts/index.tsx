"use client"

import { getToken } from "@/action/token"
import ControlMUITextField from "@/components/MUI/ControlMUItextField"
import MuiSelect from "@/components/MUI/MuiSelect"
import useDashboard from "@/hooks/useDashboard"
import { fetchAccount, updateAccount } from "@/lib/api/accounts"
import { CreateAccount } from "@/types/account"
import { Add, Delete } from "@mui/icons-material"
import { Button, Grid, IconButton, Paper, Stack, Typography } from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

// import Details from "@/Sections/Details"

const Accounts = ({ id }: { id?: string }) => {
    const [loading, setLoading] = useState(false)
    const { handleSubmit, control, formState: { errors }, setError, watch, setValue } = useForm()
    const context = useDashboard()

    const { data: account, isLoading } = useQuery({
        queryKey: ['account', id ?? context?.state.user?.account?._id],
        queryFn: () => fetchAccount(id ?? context?.state.user?.account?._id),
        enabled: !!id || !!context?.state.user?.account?._id,
    });


    const { fields, append, remove } = useFieldArray({ control, name: "social" });
    const { fields: videosFields, append: appendVideos, remove: removeVideos } = useFieldArray({ control, name: "videos" });

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
            setValue('id', account.data._id)
            setValue('title', account.data.title)
            setValue('phone', account.data.phone)
            setValue('whatsApp', account.data.whatsApp)
            setValue('description', account.data.description)
            setValue('color', account.data.color)
            setValue('lang', account.data.lang)
            setValue('about', account.data.about)
            setValue('domain', account.data.domain)
            setValue('social', account.data.social)
            setValue('videos', account.data.videos)
        }

        return () => { }
    }, [account])


    const onSubmit = async (data: any) => {
        setLoading(true);
        console.log(data)

        updateAccountMutation({
            id: watch("id") || context?.state.user?.account._id,
            data: {
                ...data,
                userId: id ?? context?.state.user._id,
                ...(context?.state?.user?.role === 'admin' && { domain: data.domain }),
            }
        }, {
            onSuccess: () => {
                toast.success("تم تعديل الحساب بنجاح")
                setLoading(false);
            },
            onError(error) {
                toast.error("خطأ في تعديل الحساب")
                console.log(error);
            }
        })
    }

    const rules = {
        required: "هذا الحقل مطلوب",
    }
    const watchedItems = useWatch({
        control: control,
        name: "social",
    });

    if (isLoading) {
        return <div>loading...</div>
    }


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


    return (
        <div>
            <Paper sx={{ padding: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {context?.state?.user?.role === 'admin' &&
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                                <ControlMUITextField
                                    control={control}
                                    name='domain'
                                    label={"النطاق"}
                                    rules={rules}
                                />
                            </Grid>}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={control}
                                name='title'
                                label={"العنوان"}
                                rules={rules}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={control}
                                name='phone'
                                label={"رقم الهاتف"}
                                rules={rules}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={control}
                                name='whatsApp'
                                label={"الواتس اب"}
                                rules={rules}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <ControlMUITextField
                                control={control}
                                name='color'
                                label={"اللون"}
                                rules={rules}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                            <MuiSelect
                                control={control}
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
                                control={control}
                                name='about'
                                label={"المعلومات الشاملة"}
                                rules={rules}
                                multiline
                                rows={5}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <ControlMUITextField
                                control={control}
                                name='description'
                                label={"الوصف"}
                                rules={rules}
                                multiline
                                rows={5}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
                                    <Typography>التواصل الاجتماعي</Typography>
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
                                    console.log(filterSelectOptions)

                                    return (
                                        <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                                            <MuiSelect
                                                name={`social.${index}.type`}
                                                label="النوع"
                                                control={control}
                                                variant="filled"
                                                data={filterSelectOptions}
                                                rules={rules}
                                            />
                                            <ControlMUITextField
                                                label="الرابط"
                                                control={control}
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
                                    <Typography>الفديوهات</Typography>
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
                                                control={control}
                                                variant="filled"
                                                data={selectOptions}
                                                rules={rules}
                                            />
                                            <ControlMUITextField
                                                label="الرابط"
                                                control={control}
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
                            <Button variant='contained' type='submit' fullWidth loading={loading || isLoading}>
                                إنشاء حساب
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    )
}

export default Accounts