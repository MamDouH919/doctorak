
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import CustomDialog from '../MUI/CustomDialog'
import { useState } from 'react'
import { getToken } from '@/action/token'

interface PropsType {
    open: boolean
    handleClose: () => void
}

const LogoutDialog = ({
    open,
    handleClose
}: PropsType) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { t } = useTranslation()
    const { handleSubmit } = useForm()

    const onSubmit = async () => {
        const token = await getToken()
        setLoading(true)
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // get tooken from cookie
                token: token
            })
        })
            .then(response => {
                setLoading(false)
                if (response.ok) {
                    toast.success("تم تسجيل الخروج بنجاح")
                    
                    router.push('/login')
                } else {
                    toast.error("حدث خطأ ما")
                }
            })
            .catch(error => {
                setLoading(false)
                toast.error("حدث خطأ ما")
            }).finally(() => {
                handleClose()
                setLoading(false)
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
            content={
                <Stack py={2}>
                    <Typography textAlign={"center"}>
                        هل أنت متأكد من أنك تريد تسجيل الخروج؟
                    </Typography>
                </Stack>
            }
            buttonAction={
                <Button loading={loading} type='submit' variant='contained'>{"تسجيل الخروج"}</Button>
            }
        />
    )
}

export default LogoutDialog