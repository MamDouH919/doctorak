import { Box, Button, Grid, IconButton, Paper, Popover, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SingleImageUploader } from '../MUI/FileUpload'
import { useAppSelector } from '@/Store/store'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ControlMUITextField from '../MUI/ControlMUItextField'
import { TooltipComponent } from '.'
import { updateAccountAdmin, UpdateAdminData, updateDoctorData, UpdateDoctorData } from '@/lib/api/accounts'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Add, ColorLens, Delete } from '@mui/icons-material'
import { HexColorPicker } from "react-colorful"
import MuiSwitch from '../MUI/MuiSwitch'
import ListSpecializations from '../customAutoCompolete/ListSpecializations'

const Admin = ({
    account,
    userId
}: {
    account: any
    userId?: string
}) => {
    const { t, i18n } = useTranslation()
    const { control, handleSubmit, watch, setValue } = useForm<UpdateAdminData>()
    const auth = useAppSelector((state) => state.auth)

    // mutation
    const { mutate: updateAccountMutation, isPending: updateAccountLoading } = useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdateAdminData }) =>
            updateAccountAdmin(id, data),
        onError(error) {
            console.log(error);
        }
    });


    useEffect(() => {
        if (account) {
            setValue('specialization', account.data?.specialization)
            setValue('specialization_needed', account.data?.specialization_needed)
            setValue('isPremium', account.data.isPremium)
            setValue('active', account.data.active)
            setValue('showInHomePage', account.data.showInHomePage)
            setValue('domain', account.data.domain)
        }

        return () => { }
    }, [account, t])

    const rules = {
        required: t("common.required"),
    }

    const onSubmit = async (data: UpdateAdminData) => {
        console.log(data);

        updateAccountMutation({
            id: userId! ?? auth.user?.id!,
            data: {
                active: data.active,
                showInHomePage: data.showInHomePage,
                isPremium: data.isPremium,
                specialization: data.specialization,
                specialization_needed: data.specialization_needed,
                domain: data.domain
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
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <MuiSwitch
                            control={control}
                            name='active'
                            label={t("adminPages.active")}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <MuiSwitch
                            control={control}
                            name='showInHomePage'
                            label={t("adminPages.showInHomePage")}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <MuiSwitch
                            control={control}
                            name='isPremium'
                            label={t("adminPages.isPremium")}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <ControlMUITextField
                            control={control}
                            name='domain'
                            label={t("adminPages.domain")}
                            rules={rules}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <ListSpecializations
                            control={control}
                            name='specialization'
                            label={t("adminPages.specialization")}
                            rules={{
                                required: watch('specialization_needed') ? false : rules.required,
                            }}
                            disabled={!!watch('specialization_needed')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                        <ControlMUITextField
                            control={control}
                            name='specialization_needed'
                            label={t("adminPages.specialization_needed")}
                            rules={{
                                required: watch('specialization') ? false : rules.required,
                            }}
                            disabled={!!watch('specialization')}
                        />
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

export default Admin