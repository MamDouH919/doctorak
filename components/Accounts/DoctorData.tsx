import { Box, Button, Grid, IconButton, Paper, Popover, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SingleImageUploader } from '../MUI/FileUpload'
import { useAppSelector } from '@/Store/store'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ControlMUITextField from '../MUI/ControlMUItextField'
import { TooltipComponent } from '.'
import { updateDoctorData, UpdateDoctorData } from '@/lib/api/accounts'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Add, ColorLens, Delete } from '@mui/icons-material'
import { HexColorPicker } from "react-colorful"

const DoctorData = ({
    account,
    userId
}: {
    account: any
    userId?: string
}) => {
    const { t, i18n } = useTranslation()
    const { control, handleSubmit, setError, watch, setValue } = useForm()
    const auth = useAppSelector((state) => state.auth)


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);

    // mutation
    const { mutate: updateAccountMutation, isPending: updateAccountLoading } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateDoctorData }) =>
            updateDoctorData(id, data),
        onError(error) {
            console.log(error);
        }
    });

    const { fields, append, remove } = useFieldArray({ control: control, name: "services" });

    useEffect(() => {
        if (account) {
            setValue('title', account.data.title?.[i18n.language])
            setValue('phone', account.data.phone ? account.data.phone.replace("+20", "") : "")
            setValue('whatsApp', account.data.whatsApp ? account.data.whatsApp.replace("+20", "") : "")
            setValue('description', account.data.description?.[i18n.language])
            setValue('about', account.data.about?.[i18n.language])
            setValue('siteName', account.data.siteName?.[i18n.language])
            setValue('color', account.data.color)

            if (account.data?.image?.url) {
                setValue('image', account.data?.image?.url)
            }

            if (account.data?.services) {
                setValue('services', account.data?.services[i18n.language])
            }

        }

        return () => { }
    }, [account, t])

    const rules = {
        required: t("common.required"),
    }

    const onSubmit = async (data: any) => {
        console.log(data);

        updateAccountMutation({
            id: userId! ?? auth.user?.accountId!,
            data: {
                color: data.color,
                title: data.title,
                about: data.about,
                description: data.description,
                siteName: data.siteName,
                phone: "+20" + data.phone,
                whatsApp: "+20" + data.whatsApp,
                services: data.services
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

    return (
        <Paper component={Stack} p={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, }} >
                        <SingleImageUploader
                            name='image'
                            control={control}
                            accountId={userId! ?? auth.user?.accountId}
                            alt={account?.data.user.name}
                            queryKey={['account', userId ?? auth.user?.accountId!]}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} >
                        <ControlMUITextField
                            control={control}
                            name='siteName'
                            label={t("adminPages.name")}
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
                    <Grid size={{ xs: 12, sm: 6 }} >
                        <ControlMUITextField
                            control={control}
                            name='title'
                            label={t("adminPages.doctorTitle")}
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
                    <Grid size={{ xs: 12, sm: 6 }} >
                        <ControlMUITextField
                            control={control}
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
                    <Grid size={{ xs: 12, sm: 6 }} >
                        <ControlMUITextField
                            control={control}
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200 }}>
                                <HexColorPicker
                                    color={watch('color')}
                                    onChange={(color: string) => setValue('color', color)}
                                />
                            </Box>
                        </Popover>

                        <ControlMUITextField
                            control={control}
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
                                    setValue('color', value);
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
                            control={control}
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
                            control={control}
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
                                    {t("adminPages.services")}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={() => append("")}
                                >
                                    {t("common.add")}
                                </Button>
                            </Stack>

                            <Grid container spacing={2}>
                                {fields.map((item, index) => {
                                    return (
                                        <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                                            <ControlMUITextField
                                                fullWidth={false}
                                                control={control}
                                                name={`services.${index}`}
                                                label={t("adminPages.serviceName")}
                                                rules={rules}
                                                InputProps={{
                                                    endAdornment: (
                                                        <Delete color='error' fontSize='small' onClick={() => remove(index)} />
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>

                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12 }} >
                        <Button variant='contained' type='submit' fullWidth loading={updateAccountLoading}>
                            {t("common.submit")}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
}

export default DoctorData