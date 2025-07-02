import ListAccounts from '@/components/customAutoCompolete/ListAccounts'
import ControlMUITextField from '@/components/MUI/ControlMUItextField'
import CustomDialog from '@/components/MUI/CustomDialog'
import { createArticles, updateArticles } from '@/lib/api/articles'
import { useAppSelector } from '@/Store/store'
import { Button, FormControl, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const FormDialog = ({
    open,
    handleClose,
    oldData
}: {
    open: boolean,
    handleClose: () => void,
    oldData: any
}) => {
    const { t } = useTranslation()
    const { auth } = useAppSelector((state) => state)
    const { mutate: createArticlesMutation, isPending: createArticlesLoading } = useMutation({
        mutationFn: (data: { title: string, content: string, account: string }) =>
            createArticles(data),
        onError(error) {
            console.log(error);
        }
    });

    const { mutate: updateArticlesMutation, isPending: updateArticlesLoading } = useMutation({
        mutationFn: (data: { id: string, title: string, content: string, account: string }) =>
            updateArticles(data),
        onError(error) {
            console.log(error);
        }
    });

    const [checked, setChecked] = React.useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const { handleSubmit, control, reset, setValue, watch } = useForm()

    const queryClient = useQueryClient(); // Use this to access queryClient

    const onSubmit = async (data: any) => {
        if (oldData) {
            updateArticlesMutation({
                id: oldData.id,
                account: oldData.accountId ?? auth?.user?.accountId,
                title: data.title,
                content: data.content
            }, {
                onSuccess: () => {
                    toast.success(t("common.saveSuccess"))
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
        } else {

            createArticlesMutation({
                account: data.accountId ?? auth?.user?.accountId,
                title: data.title,
                content: data.content
            }, {
                onSuccess: () => {
                    toast.success(t("common.saveSuccess"))
                    queryClient.invalidateQueries({
                        queryKey: ['articles'],
                    });
                    if (!checked) {
                        handleClose()
                    } else {
                        reset({
                            title: "",
                            content: ""
                        })
                    }
                },
                onError(error) {
                    toast.error(t("common.errorMessage"))
                    console.log(error);
                }
            })
        }
    }

    useEffect(() => {
        if (oldData) {
            setValue('accountId', oldData.accountId)
            setValue('title', oldData.title)
            setValue('content', oldData.content)
        }
        return () => { }
    }, [oldData])

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
                <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant='h6'>
                        {oldData ? t("adminPages.editArticle") : t("adminPages.addArticle")}
                    </Typography>
                    {!oldData && <FormControl component="fieldset" variant="standard">
                        <FormControlLabel
                            labelPlacement="start"
                            control={
                                <Switch
                                    checked={checked}
                                    onChange={handleChange}
                                    name="again"

                                />
                            }
                            label={t("adminPages.addAnother")}
                        />
                    </FormControl>}
                </Stack>
            }
            content={
                <Stack py={2} spacing={2}>
                    {auth?.user?.role === 'admin' &&
                        <ListAccounts
                            control={control}
                            name='accountId'
                            label={t("adminPages.account")}
                            rules={{
                                required: t("common.required"),
                            }}
                            disabled={!!oldData}
                        />
                    }
                    <ControlMUITextField
                        control={control}
                        name='title'
                        label={t("adminPages.title")}
                        rows={3}
                        multiline
                        rules={{
                            required: t("common.required"),
                        }}
                    />
                    <ControlMUITextField
                        control={control}
                        name='content'
                        label={t("adminPages.content")}
                        rows={4}
                        multiline
                        rules={{
                            required: t("common.required"),
                        }}
                    />
                </Stack>
            }
            buttonAction={
                <Button loading={createArticlesLoading || updateArticlesLoading} type='submit' variant='contained'>
                    {t("common.submit")}
                </Button>
            }
        />
    )
}

export default FormDialog