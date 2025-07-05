import ListAccounts from '@/components/customAutoCompolete/ListAccounts'
import ListCities from '@/components/customAutoCompolete/ListCities'
import ListDays from '@/components/customAutoCompolete/ListDays'
import ListGovernorate from '@/components/customAutoCompolete/ListGovernorate'
import ControlMUITextField from '@/components/MUI/ControlMUItextField'
import CustomDialog from '@/components/MUI/CustomDialog'
import MuiTimePicker from '@/components/MUI/MuiTimePicker'
import { createClinic, updateClinic } from '@/lib/api/clinics'
import { updateFaq } from '@/lib/api/faqs'
import { useAppSelector } from '@/Store/store'
import { Add, Delete } from '@mui/icons-material'
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const getTime = (time: string | Date) => moment(time).locale("en").format('HH:mm');
const stringFormatToDate = (date: string) => moment(date, "HH:mm").locale("en").toDate();

const FormDialog = ({
    open,
    handleClose,
    oldData
}: {
    open: boolean,
    handleClose: () => void,
    oldData: any
}) => {
    const { t, i18n } = useTranslation()
    const { auth } = useAppSelector((state) => state)
    const { mutate: createFaqsMutation, isPending: createFaqsLoading } = useMutation({
        mutationFn: (data: createClinic) =>
            createClinic(data),
        onError(error) {
            console.log(error);
        }
    });

    const { mutate: updateFaqsMutation, isPending: updateFaqsLoading } = useMutation({
        mutationFn: (data: createClinic & { id: string }) =>
            updateClinic(data),
        onError(error) {
            console.log(error);
        }
    });

    const { handleSubmit, control, reset, watch } = useForm()
    const { fields, append, remove } =
        useFieldArray({ control: control, name: "appointments" });


    const queryClient = useQueryClient(); // Use this to access queryClient

    const onSubmit = async (data: any) => {
        if (oldData) {
            updateFaqsMutation({
                id: oldData._id,
                account: data.accountId ?? auth?.user?.accountId,
                name: data.name,
                phone: "+20" + data.phone,
                mobile: "+20" + data.mobile,
                governorate: data.governorate,
                city: data.city,
                address: data.address,
                appointments: data.appointments.map((item: any) => ({
                    day: item.day,
                    timeFrom: getTime(item.timeFrom),
                    timeTo: getTime(item.timeTo)
                }))
            }, {
                onSuccess: () => {
                    toast.success(t("common.saveSuccess"))
                    queryClient.invalidateQueries({
                        queryKey: ['clinics'],
                    });
                    handleClose()
                },
                onError(error) {
                    toast.error("خطأ في تعديل العيادة")
                    console.log(error);
                }
            })
        } else {

            createFaqsMutation({
                account: data.accountId ?? auth?.user?.accountId,
                name: data.name,
                phone: "+20" + data.phone,
                mobile: "+20" + data.mobile,
                governorate: data.governorate,
                city: data.city,
                address: data.address,
                appointments: data.appointments.map((item: any) => ({
                    day: item.day,
                    timeFrom: getTime(item.timeFrom),
                    timeTo: getTime(item.timeTo)
                }))
            }, {
                onSuccess: () => {
                    toast.success("تم اضافة العيادة بنجاح")
                    queryClient.invalidateQueries({
                        queryKey: ['clinics'],
                    });
                    handleClose()
                },
                onError(error) {
                    toast.error("خطأ في الاضافة العيادة")
                    console.log(error);
                }
            })
        }
    }

    useEffect(() => {
        if (oldData) {

            // Reset appointments
            reset({
                accountId: oldData.account._id,
                name: oldData.name[i18n.language as "ar" | "en"],
                phone: oldData.phone.replace("+20", ""),
                mobile: oldData.mobile.replace("+20", ""),
                governorate: oldData.governorate._id,
                city: oldData.city._id,
                address: oldData.address[i18n.language as "ar" | "en"],

                appointments: oldData.appointments.map((item: any) => ({
                    day: item.day,
                    timeFrom: stringFormatToDate(item.timeFrom),
                    timeTo: stringFormatToDate(item.timeTo)
                }))
            });
        }
        return () => { }
    }, [oldData])

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            maxWidth='sm'
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit(onSubmit),
                noValidate: true
            }}
            title={
                <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant='h6'>
                        {oldData ? t("adminPages.editClinic") : t("adminPages.addClinic")}
                    </Typography>
                </Stack>
            }
            content={
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        {auth?.user?.role === 'admin' &&
                            <Grid size={{ xs: 12 }}>
                                <ListAccounts
                                    control={control}
                                    name='accountId'
                                    label={t("adminPages.account")}
                                    rules={{
                                        required: t("common.required")
                                    }}
                                    disabled={!!oldData}
                                />
                            </Grid>
                        }
                        <Grid size={{ xs: 12 }}>
                            <ControlMUITextField
                                control={control}
                                name='name'
                                label={t("adminPages.name")}
                                rules={{
                                    required: t("common.required")
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ControlMUITextField
                                control={control}
                                name='phone'
                                label={t("adminPages.phone")}
                                rules={{
                                    required: t("common.required")
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ControlMUITextField
                                control={control}
                                name='mobile'
                                label={t("adminPages.mobile")}
                                rules={{
                                    required: t("common.required")
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ListGovernorate
                                control={control}
                                name='governorate'
                                label={t("adminPages.governorate")}
                                rules={{
                                    required: t("common.required")
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ListCities
                                skip={!watch('governorate')}
                                disabled={!watch('governorate')}
                                governorateId={watch('governorate')}
                                control={control}
                                name='city'
                                label={t("adminPages.city")}
                                rules={{
                                    required: t("common.required")
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <ControlMUITextField
                                control={control}
                                name='address'
                                label={t("adminPages.address")}
                                rules={{
                                    required: t("common.required")
                                }}
                                rows={3}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack spacing={2}>
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Typography variant='h6' fontWeight='bold' color='primary.main' gutterBottom>
                                        {t("adminPages.appointments")}
                                    </Typography>
                                    <Button
                                        variant='outlined'
                                        startIcon={<Add />}
                                        onClick={() => append({ day: "", timeFrom: "", timeTo: "" })}
                                    >
                                        {t("common.add")}
                                    </Button>
                                </Stack>
                                <Stack spacing={2}>
                                    {
                                        fields.map((item, index) => {
                                            return (
                                                <Stack key={item.id} direction={"row"} spacing={2} alignItems="center">
                                                    <ListDays
                                                        name={`appointments.${index}.day`}
                                                        label={t("adminPages.day")}
                                                        control={control}
                                                        rules={{
                                                            required: t("common.required")
                                                        }}
                                                    />
                                                    <MuiTimePicker
                                                        control={control}
                                                        name={`appointments.${index}.timeFrom`}
                                                        label={t("adminPages.fromTime")}
                                                        rules={{ required: t("common.required") }}
                                                    />
                                                    <MuiTimePicker
                                                        control={control}
                                                        name={`appointments.${index}.timeTo`}
                                                        label={t("adminPages.toTime")}
                                                        rules={{ required: t("common.required") }}
                                                    />
                                                    <IconButton onClick={() => remove(index)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Stack>
                                            );
                                        })
                                    }
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            }
            buttonAction={
                <Button loading={createFaqsLoading || updateFaqsLoading} type='submit' variant='contained'>
                    {t("common.submit")}
                </Button>
            }
        />
    )
}

export default FormDialog