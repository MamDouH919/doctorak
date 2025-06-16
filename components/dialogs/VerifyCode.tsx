import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import CustomDialog from '../MUI/CustomDialog'
import { useState } from 'react'
import { getToken } from '@/action/token'
import ControlMUITextField from '../MUI/ControlMUItextField'

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
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const router = useRouter()
    const { t } = useTranslation()
    const { handleSubmit, control, setError } = useForm()

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    otp: data.otp
                })
            })

            const result = await response.json();

            if (result.typeError === 'validation') {
                if (result.field === 'email') {
                    setError("email", { type: "manual", message: result.message });
                }
                return
            }

            if (response.type === 'error') {
                toast.error(result.message);
            } else {
                toast.success("تم تسجيل الدخول بنجاح");
                handleClose()
                router.push('/dashboard')
            }

            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }
    const onResend = async () => {
        setResendLoading(true)
        try {
            const response = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            })

            const result = await response.json();

            if (response.type === 'error') {
                toast.error(result.message);
            } else {
                toast.success(result.message);
            }

        } catch (error) {
            setResendLoading(false)
        }
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
            content={
                <Stack py={2}>
                    <ControlMUITextField
                        control={control}
                        name='otp'
                        label={"الرمز المرسل إليك"}
                        rules={{
                            required: "الرمز المرسل إليك مطلوب",
                        }}
                    />
                </Stack>
            }
            buttonAction={
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Button loading={loading} disabled={resendLoading} type='submit' variant='contained'>{"تأكيد"}</Button>
                    <Button
                        disabled={loading}
                        onClick={onResend}
                        variant='contained'
                        loading={resendLoading}
                    >
                        {"إعادة آرسال"}
                    </Button>
                </Stack>
            }
        />
    )
}

export default VerifyCode