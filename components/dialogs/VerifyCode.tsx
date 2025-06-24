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
    const [resendLoading, setResendLoading] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { handleSubmit, control, setError } = useForm()

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
            onSuccess: async (response) => {
                toast.success(response.message);
                dispatch(changeUser({
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                    ...(response.data.role === "user" && { accountId: response.data?.account._id }),
                    isPremium: response.data.account.isPremium
                }));
                handleClose()
                router.push('/dashboard')
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
                    toast.error("حدث خطأ أثناء إعادة إرسال رمز التحقق")
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
                    <Typography variant='body1'>{"التحقق من البريد الإلكتروني"}</Typography>
                </Stack>
            }
            content={
                <Stack spacing={1} mt={2}>
                    <ControlMUITextField
                        control={control}
                        name='otp'
                        label={"الرمز المرسل إليك"}
                        rules={{
                            required: "الرمز المرسل إليك مطلوب",
                        }}
                    />
                    <Stack alignItems={"flex-start"}>
                        <Button
                            disabled={verifyEmailLoading}
                            onClick={onResend}
                            variant='text'
                            loading={resendOtpLoading}
                        >
                            {"إعادة آرسال"}
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
                        {"تأكيد"}
                    </Button>
                </Stack>
            }
        />
    )
}

export default VerifyCode