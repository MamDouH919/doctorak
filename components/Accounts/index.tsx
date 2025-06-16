"use client"

import { getToken } from "@/action/token"
import ControlMUITextField from "@/components/MUI/ControlMUItextField"
import MuiSelect from "@/components/MUI/MuiSelect"
import useDashboard from "@/hooks/useDashboard"
import { fetchAccount } from "@/lib/api/accounts"
import { Button, Grid, Paper } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

// import Details from "@/Sections/Details"

const Accounts = ({ id }: { id?: string }) => {
    const [loading, setLoading] = useState(false)
    const { handleSubmit, control, setError, watch, setValue } = useForm()
    const context = useDashboard()

    console.log(!!id || !!context?.state.user?.account?._id)

    const { data: account, isLoading } = useQuery({
        queryKey: ['account', id ?? context?.state.user?.account?._id],
        queryFn: () => fetchAccount(id ?? context?.state.user?.account?._id),
        enabled: !!id || !!context?.state.user?.account?._id,
    });

    console.log(account)


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
        }

        return () => { }
    }, [account])


    const onSubmit = async (data: any) => {
        setLoading(true);
        const response = await fetch('/api/accounts/update/' +
            watch("id") || context?.state.user?.account._id,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context?.state.user.token}`
                },
                body: JSON.stringify({
                    ...data,
                    userId: id ?? context?.state.user._id,
                    ...(context?.state?.user?.role === 'admin' && { domain: data.domain }),
                    faqs: [],
                    articles: [],
                    testimonials: [],
                    expertise: {},
                    videos: [],
                    social: []
                })
            })
        if (response.ok) {
            const { message, account } = await response.json();
            toast.success(message);
            setLoading(false);
        } else {
            toast.error("خطأ في الخطأ");
            setLoading(false);
        }
    }

    const rules = {
        required: "هذا الحقل مطلوب",
    }

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