import CustomDialog from '@/components/MUI/CustomDialog'
import { deleteClinic } from '@/lib/api/clinics'
import { Button, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
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
                toast.success("تم حذف العيادة بنجاح")
                queryClient.invalidateQueries({
                    queryKey: ['clinics'],
                });
                handleClose()
            },
            onError(error) {
                toast.error("خطأ في حذف العيادة")
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
            content={
                <Typography variant='body1' align='center'>
                    هل أنت متأكد من أنك تريد حذف هذا السؤال؟
                </Typography>
            }
            buttonAction={
                <Button type='submit' loading={deleteClinicsLoading} variant='contained'>
                    حذف
                </Button>
            }
        />
    )
}

export default DeleteDialog