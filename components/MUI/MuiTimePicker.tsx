import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormHelperText, FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";

interface MuiTimePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    onChange?: (value: Date | null) => void;
    defaultValue?: Date | null;
    [key: string]: any;
    rules?: {
        required?: boolean | string;
        validate?: {
            whiteSpace?: (value: string) => boolean | string;
            [key: string]: ((value: any) => boolean | string) | undefined;
        };
    };
}

const MuiTimePicker = <T extends FieldValues>({
    control,
    name,
    label,
    onChange,
    defaultValue = null,
    rules = {},
    ...restProps
}: MuiTimePickerProps<T>) => {
    const { t } = useTranslation();

    const validationRules = {
        required: rules.required || false,
        validate: {
            ...(rules.validate || {}),
            ...(rules?.validate?.whiteSpace && {
                whiteSpace: (value: any) => {
                    if (typeof value === "string") {
                        return rules.validate!.whiteSpace!(value);
                    }
                    return true;
                },
            }),
        },
    };

    const {
        field: { onChange: fieldOnChange, value },
        formState: { errors },
    } = useController({
        name,
        control,
        defaultValue: defaultValue as T[Path<T>] | undefined,
        rules: validationRules,
    });

    const [selectedTime, setSelectedTime] = useState<Date | null>(defaultValue ?? value ?? null);

    useEffect(() => {
        setSelectedTime(value ? (value as any).toDate?.() || value : null);
    }, [value]);

    const errorName = name.includes(".") ? name.split(".") : null;
    const fieldError = errorName
        ? (errors?.[errorName[0]] as Record<string, any>)?.[errorName[1]]
        : errors?.[name as keyof typeof errors];

    return (
        <FormControl fullWidth error={!!fieldError} size="small">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                    label={label}
                    value={selectedTime}
                    onChange={(newValue) => {
                        const time = newValue ? (newValue instanceof Date ? newValue : newValue.toDate?.()) : null;
                        setSelectedTime(time);
                        fieldOnChange(time);
                        if (onChange) onChange(time);
                    }}
                    minutesStep={1}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!fieldError,
                            helperText: fieldError?.message,
                        },
                    }}
                    {...restProps}
                />
            </LocalizationProvider>
        </FormControl>
    );
};

export default MuiTimePicker;
