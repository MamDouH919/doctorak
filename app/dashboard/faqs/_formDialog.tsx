import ControlMUITextField from '@/components/MUI/ControlMUItextField'
import CustomDialog from '@/components/MUI/CustomDialog'
import { createFaq } from '@/lib/api/faqs'
import { Button, Stack } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'

const FormDialog = ({
    open,
    handleClose,

}: {
    open: boolean,
    handleClose: () => void,
}) => {
    const { mutateAsync: createFaqsMutation, isPending: createFaqsLoading } = useMutation({
        mutationFn: ({ data }: { data: any }) =>
            createFaq(data),
        onError(error) {
            console.log(error);
        }
    });

    const { handleSubmit, control } = useForm()

    const onSubmit = async (data: any) => {
        console.log(data)

        // await createFaqsMutation(data)
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
                <Stack py={2}>
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