import ListAccounts from '@/components/customAutoCompolete/ListAccounts'
import ControlMUITextField from '@/components/MUI/ControlMUItextField'
import CustomDialog from '@/components/MUI/CustomDialog'
import { createFaq, updateFaq } from '@/lib/api/faqs'
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
    const { t, i18n } = useTranslation()
    const { auth } = useAppSelector((state) => state)
    const { mutate: createFaqsMutation, isPending: createFaqsLoading } = useMutation({
        mutationFn: (data: { question: string, answer: string, account: string }) =>
            createFaq(data),
        onError(error) {
            console.log(error);
        }
    });

    const { mutate: updateFaqsMutation, isPending: updateFaqsLoading } = useMutation({
        mutationFn: (data: { id: string, question: string, answer: string, account: string }) =>
            updateFaq(data),
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
            updateFaqsMutation({
                id: oldData.id,
                account: oldData.accountId ?? auth?.user?.accountId,
                question: data.question,
                answer: data.answer
            }, {
                onSuccess: () => {
                    toast.success(t("common.saveSuccess"))
                    queryClient.invalidateQueries({
                        queryKey: ['faqs'],
                    });
                    handleClose()
                },
                onError(error) {
                    toast.error(t("common.errorMessage"))
                    console.log(error);
                }
            })
        } else {

            createFaqsMutation({
                account: data.accountId ?? auth?.user?.accountId,
                question: data.question,
                answer: data.answer
            }, {
                onSuccess: () => {
                    toast.success(t("common.saveSuccess"))
                    queryClient.invalidateQueries({
                        queryKey: ['faqs'],
                    });
                    if (!checked) {
                        handleClose()
                    } else {
                        reset({
                            question: "",
                            answer: ""
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
            setValue('question', oldData.question[i18n.language as "ar" | "en"])
            setValue('answer', oldData.answer[i18n.language as "ar" | "en"])
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
                        {oldData? t("adminPages.editFaq") : t("adminPages.addFaq")}
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
                        name='question'
                        label={t("adminPages.question")}
                        rows={3}
                        multiline
                        rules={{
                            required: t("common.required"),
                        }}
                    />
                    <ControlMUITextField
                        control={control}
                        name='answer'
                        label={t("adminPages.answer")}
                        rows={4}
                        multiline
                        rules={{
                            required: t("common.required"),
                        }}
                    />
                </Stack>
            }
            buttonAction={
                <Button loading={createFaqsLoading || updateFaqsLoading} type='submit' variant='contained'>
                    {t("common.submit")}
                </Button>
            }
        />
    )
}

export default FormDialog