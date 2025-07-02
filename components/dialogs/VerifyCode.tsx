import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import CustomDialog from '../MUI/CustomDialog'
import { useState } from 'react'
import { getToken } from '@/action/token'
import ControlMUITextField from '../MUI/ControlMUItextField'
import { useAppDispatch } from '@/Store/store'
import { changeUser } from '@/Store/slices/auth'
import { resendOtp, verifyEmail } from '@/lib/api/auth'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface PropsType {
    open: boolean
    handleClose: () => void
    email: string
}

const VerifyCode = ({
    open,
    handleClose,
    email
}: PropsType) => {
    const router = useRouter()
    // const dispatch = useAppDispatch()
    const { handleSubmit, control, setError } = useForm()
    const { t } = useTranslation()
    // mutation for verify email
    const { mutate: verifyEmailMutation, isPending: verifyEmailLoading } = useMutation({
        mutationFn: (data: { email: string, otp: number }) =>
            verifyEmail(data),
        onError(error) {
            console.log(error);
        }
    });

    // resendOtp mutation
    const { mutate: resendOtpMutation, isPending: resendOtpLoading } = useMutation({
        mutationFn: (data: { email: string }) =>
            resendOtp(data),
        onError(error) {
            console.log(error);
        }
    });

    const onSubmit = async (data: any) => {
        verifyEmailMutation({
            email: email,
            otp: data.otp
        }, {
            onSuccess: async () => {
                toast.success(t("website.verifyCode.success"), {
                    duration: 5000,
                });
                // dispatch(changeUser({
                //     id: response.data.user.id,
                //     name: response.data.user.name,
                //     email: response.data.user.email,
                //     role: response.data.user.role,
                //     ...(response.data.user.role === "user" && { accountId: response.data?.user?.account._id }),
                //     isPremium: response.data?.user?.account.isPremium
                // }));
                handleClose()
                router.push('/')
            },
            onError: async (error) => {
                if (axios.isAxiosError(error) && error.response?.data?.type === "validation-server") {
                    error.response.data.errors.forEach((value: any) => {
                        setError(value.field, {
                            type: "validate",
                            message: value.message,
                        });
                    });
                }
                console.log(error)
            }
        })
    }
    const onResend = async () => {
        resendOtpMutation({ email: email }, {
            onSuccess: async (response) => {
                toast.success(response.message);
            },
            onError: async (error) => {
                if (axios.isAxiosError(error) && error.response?.data?.type === "validation-server") {
                    error.response.data.errors.forEach((value: any) => {
                        setError(value.field, {
                            type: "validate",
                            message: value.message,
                        });
                    });
                } else {
                    toast.error(t("website.verifyCode.error"))
                }
            }
        })
    }
    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit(onSubmit),
                noValidate: true
            }}
            title={
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Typography variant='body1'>{t("website.verifyCode.title")}</Typography>
                </Stack>
            }
            content={
                <Stack spacing={1} mt={2}>
                    <ControlMUITextField
                        control={control}
                        name='otp'
                        label={t("website.verifyCode.otp")}
                        rules={{
                            required: t("common.required"),
                        }}
                    />
                    <Stack alignItems={"flex-start"}>
                        <Button
                            disabled={verifyEmailLoading}
                            onClick={onResend}
                            variant='text'
                            loading={resendOtpLoading}
                        >
                            {t("website.verifyCode.resend")}
                        </Button>
                    </Stack>
                </Stack>
            }
            buttonAction={
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Button
                        loading={verifyEmailLoading}
                        disabled={resendOtpLoading}
                        type='submit' variant='contained'
                    >
                        {t("common.submit")}
                    </Button>
                </Stack>
            }
        />
    )
}

export default VerifyCode