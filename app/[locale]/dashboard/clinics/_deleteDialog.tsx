import CustomDialog from '@/components/MUI/CustomDialog'
import { deleteClinic } from '@/lib/api/clinics'
import { Button, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const DeleteDialog = ({
    open,
    handleClose,
    id
}: {
    open: boolean,
    handleClose: () => void,
    id: string
}) => {
    const { t } = useTranslation()
    const { handleSubmit } = useForm()

    const { mutate: deleteClinicsMutation, isPending: deleteClinicsLoading } = useMutation({
        mutationFn: (id: string) =>
            deleteClinic(id),
        onError(error) {
            console.log(error);
        }
    });

    const queryClient = useQueryClient(); // Use this to access queryClient
    const onSubmit = async () => {
        deleteClinicsMutation(id, {
            onSuccess: () => {
                toast.success(t("common.deleteSuccess"))
                queryClient.invalidateQueries({
                    queryKey: ['clinics'],
                });
                handleClose()
            },
            onError(error) {
                toast.error(t("common.errorMessage"))
                console.log(error);
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
                t("common.delete")
            }
            content={
                <Typography variant='body1'>
                    {t("adminPages.confirmDeleteClinic")}
                </Typography>
            }
            buttonAction={
                <Button type='submit' loading={deleteClinicsLoading} variant='contained'>
                    {t("common.submit")}
                </Button>
            }
        />
    )
}

export default DeleteDialog