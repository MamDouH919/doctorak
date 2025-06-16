import CustomDialog from '@/components/MUI/CustomDialog'
import { deleteFaq } from '@/lib/api/faqs'
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

    const { mutate: deleteFaqsMutation, isPending: deleteFaqsLoading } = useMutation({
        mutationFn: (id: string) =>
            deleteFaq(id),
        onError(error) {
            console.log(error);
        }
    });

    const queryClient = useQueryClient(); // Use this to access queryClient
    const onSubmit = async () => {
        deleteFaqsMutation(id, {
            onSuccess: () => {
                toast.success("تم حذف السؤال بنجاح")
                queryClient.invalidateQueries({
                    queryKey: ['faqs'],
                });
                handleClose()
            },
            onError(error) {
                toast.error("خطأ في حذف السؤال")
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
                <Button type='submit' loading={deleteFaqsLoading} variant='contained'>
                    حذف
                </Button>
            }
        />
    )
}

export default DeleteDialog