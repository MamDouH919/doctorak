import React from 'react';
import {
    Collapse,
    Box,
    Stack
} from '@mui/material';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import MuiTimePicker from '../MUI/MuiTimePicker';
import MuiSingleCheckbox from '../MUI/MuiSingleCheckbox';
import { CreateAccount } from '@/types/account';

export const Appointments = () => {
    const { control, watch } = useFormContext<CreateAccount>();
    const { fields } = useFieldArray({ control, name: 'appointments' });
    const appointments = watch('appointments');

    return (
        <Box sx={{ p: 2 }}>
            {fields.map((field, index) => {
                const checked = appointments?.[index]?.checked;

                return (
                    <Box key={field.id} sx={{ mb: 2 }}>
                        <MuiSingleCheckbox
                            control={control}
                            name={`appointments.${index}.checked`}
                            label={appointments[index].day}
                        />

                        <Collapse in={checked}>
                            <Stack direction="row" spacing={2} py={2}>
                                <MuiTimePicker
                                    control={control}
                                    name={`appointments.${index}.timeFrom`}
                                    label="من الساعة"
                                    rules={{ required: checked ? 'مطلوب' : false }}
                                />
                                <MuiTimePicker
                                    control={control}
                                    name={`appointments.${index}.timeTo`}
                                    label="إلى الساعة"
                                    rules={{ required: checked ? 'مطلوب' : false }}
                                />
                            </Stack>
                        </Collapse>
                    </Box>
                );
            })}
        </Box>
    );
};

