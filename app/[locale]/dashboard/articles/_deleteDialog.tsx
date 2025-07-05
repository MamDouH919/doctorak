import CustomDialog from '@/components/MUI/CustomDialog'
import { deleteArticles } from '@/lib/api/articles'
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
                toast.success(t("common.deleteSuccess"))
                queryClient.invalidateQueries({
                    queryKey: ['articles'],
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
            title={t("common.delete")}
            content={
                <Typography variant='body1'>
                    {t("adminPages.confirmDeleteArticle")}
                </Typography>
            }
            buttonAction={
                <Button type='submit' loading={deleteArticlesLoading} variant='contained'>
                    {t("common.submit")}
                </Button>
            }
        />
    )
}

export default DeleteDialog