import { Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { useAppSelector } from '@/Store/store'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ControlMUITextField from '../MUI/ControlMUItextField'
import { updateDoctorData, UpdateDoctorData, updateVideosAndSocial, UpdateVideosAndSocial } from '@/lib/api/accounts'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Add, Delete } from '@mui/icons-material'
import MuiSelect from '../MUI/MuiSelect'

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


const VideosAndSocial = ({
    account,
    userId
}: {
    account: any
    userId?: string
}) => {
    const { t } = useTranslation()
    const { control, handleSubmit, setValue } = useForm()
    const auth = useAppSelector((state) => state.auth)

    // mutation
    const { mutate: updateAccountMutation, isPending: updateAccountLoading } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateVideosAndSocial }) =>
            updateVideosAndSocial(id, data),
        onError(error) {
            console.log(error);
        }
    });

    const { fields, append, remove } = useFieldArray({ control: control, name: "social" });
    const { fields: videosFields, append: appendVideos, remove: removeVideos } = useFieldArray({ control: control, name: "videos" });

    useEffect(() => {
        if (account) {
            setValue('social', account.data.social)
            setValue('videos', account.data.videos)
        }

        return () => { }
    }, [account, t])

    const rules = {
        required: t("common.required"),
    }

    const onSubmit = async (data: any) => {
        updateAccountMutation({
            id: userId! ?? auth.user?.accountId!,
            data: {
                social: data.social,
                videos: data.videos
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

    const watchedItems = useWatch({
        control: control,
        name: "social",
    });

    return (
        <Paper component={Stack} p={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
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
                                            control={control}
                                            variant="filled"
                                            data={filterSelectOptions}
                                            rules={rules}
                                        />
                                        <ControlMUITextField
                                            label={t("adminPages.link")}
                                            control={control}
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
                                            control={control}
                                            variant="filled"
                                            data={selectOptions}
                                            rules={rules}
                                        />
                                        <ControlMUITextField
                                            label={t("adminPages.link")}
                                            control={control}
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
                        <Button variant='contained' type='submit' fullWidth loading={updateAccountLoading}>
                            {t("common.submit")}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
}

export default VideosAndSocial