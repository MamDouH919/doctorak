import ListAccounts from '@/components/customAutoCompolete/ListAccounts'
import ControlMUITextField from '@/components/MUI/ControlMUItextField'
import CustomDialog from '@/components/MUI/CustomDialog'
import MUIAutocomplete from '@/components/MUI/MUIAutocomplete'
import useDashboard from '@/hooks/useDashboard'
import { createFaq, updateFaq } from '@/lib/api/faqs'
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

    console.log(oldData)

    const onSubmit = async (data: any) => {
        if (oldData) {
            updateFaqsMutation({
                id: oldData.id,
                account: oldData.accountId ?? auth?.user?.accountId,
                question: data.question,
                answer: data.answer
            }, {
                onSuccess: () => {
                    toast.success("تم تعديل السؤال بنجاح")
                    queryClient.invalidateQueries({
                        queryKey: ['faqs'],
                    });
                    handleClose()
                },
                onError(error) {
                    toast.error("خطأ في تعديل السؤال")
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
                    toast.success("تم اضافة السؤال بنجاح")
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
                    toast.error("خطأ في الاضافة السؤال")
                    console.log(error);
                }
            })
        }
    }

    useEffect(() => {
        if (oldData) {
            setValue('accountId', oldData.accountId)
            setValue('question', oldData.question)
            setValue('answer', oldData.answer)
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
                <Stack direction={"row"} spacing={1} justifyContent={"space-between"}>
                    <Typography variant='h6'>{"إضافة سؤال"}</Typography>
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
                        name='question'
                        label={"السؤال"}
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                    <ControlMUITextField
                        control={control}
                        name='answer'
                        label={"الجواب"}
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                </Stack>
            }
            buttonAction={
                <Button loading={createFaqsLoading} type='submit' variant='contained'>{"تاكيد"}</Button>
            }
        />
    )
}

export default FormDialog