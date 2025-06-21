import CustomDialog from '@/components/MUI/CustomDialog'
import { deleteArticles } from '@/lib/api/articles'
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

    const { mutate: deleteArticlesMutation, isPending: deleteArticlesLoading } = useMutation({
        mutationFn: (id: string) =>
            deleteArticles(id),
        onError(error) {
            console.log(error);
        }
    });

    const queryClient = useQueryClient(); // Use this to access queryClient
    const onSubmit = async () => {
        deleteArticlesMutation(id, {
            onSuccess: () => {
                toast.success("تم حذف المقال بنجاح")
                queryClient.invalidateQueries({
                    queryKey: ['articles'],
                });
                handleClose()
            },
            onError(error) {
                toast.error("خطأ في حذف المقال")
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
                    هل أنت متأكد من أنك تريد حذف هذا المقال؟
                </Typography>
            }
            buttonAction={
                <Button type='submit' loading={deleteArticlesLoading} variant='contained'>
                    حذف
                </Button>
            }
        />
    )
}

export default DeleteDialog