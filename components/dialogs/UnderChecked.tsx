
"use client"
import { useTranslation } from 'react-i18next'
import { Stack, Typography } from '@mui/material'
import CustomDialog from '../MUI/CustomDialog'
import { useAppDispatch, useAppSelector } from '@/Store/store'
import { changeDialogState } from '@/Store/slices/underChecked'
import { redirect } from 'next/navigation'

interface PropsType {
    open: boolean
    handleClose: () => void
}

const UnderChecked = () => {
    const underChecked = useAppSelector((state) => state.underChecked)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const handleClose = () => {
        dispatch(changeDialogState({
            state: false
        }))
        redirect('/')
    }

    return (
        <CustomDialog
            open={underChecked.state}
            handleClose={handleClose}
            content={
                <Stack py={2}>
                    <Typography textAlign={"center"}>
                        {t("website.accountNotActive")}
                    </Typography>
                </Stack>
            }
        />
    )
}

export default UnderChecked