import ListAccounts from '@/components/customAutoCompolete/ListAccounts'
import ControlMUITextField from '@/components/MUI/ControlMUItextField'
import CustomDialog from '@/components/MUI/CustomDialog'
import { createArticles, updateArticles } from '@/lib/api/articles'
import { useAppSelector } from '@/Store/store'
import { Button, FormControl, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
                    toast.success("تم تعديل المقال بنجاح")
                    queryClient.invalidateQueries({
                        queryKey: ['articles'],
                    });
                    handleClose()
                },
                onError(error) {
                    toast.error("خطأ في تعديل المقال")
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
                    toast.success("تم اضافة المقال بنجاح")
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
                    toast.error("خطأ في الاضافة المقال")
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
                    <Typography variant='h6'>{"إضافة مقال"}</Typography>
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
                            label="إضافة مرة آخري"
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
                            label={"الحساب"}
                            rules={{
                                required: "هذا الحقل مطلوب",
                            }}
                            disabled={!!oldData}
                        />
                    }
                    <ControlMUITextField
                        control={control}
                        name='title'
                        label={"العنوان"}
                        rows={3}
                        multiline
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                    <ControlMUITextField
                        control={control}
                        name='content'
                        label={"المحتوى"}
                        rows={4}
                        multiline
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                </Stack>
            }
            buttonAction={
                <Button loading={createArticlesLoading} type='submit' variant='contained'>{"تاكيد"}</Button>
            }
        />
    )
}

export default FormDialog