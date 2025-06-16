import React, { memo } from "react";
import {
    FormControl,
    FormHelperText,
    TextField,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useController } from "react-hook-form";
import type { FieldError, Control } from "react-hook-form";

interface MUIAutocompleteSingleProps {
    control: Control<any>;
    data: { value: string | number | boolean | null; key: string }[];
    name: string;
    disabled?: boolean;
    margin?: "none" | "dense" | "normal";
    label: string;
    rules?: any;
    readOnly?: boolean;
    defaultValue?: string | number | null;
}

const AutoComplete: React.FC<MUIAutocompleteSingleProps> = (props) => {
    const {
        control,
        data,
        name,
        disabled = false,
        margin = "none",
        label,
        rules,
        readOnly = false,
        defaultValue = null,
    } = props;

    const {
        formState: { errors },
        field: { ref, value: val, onChange: fieldChange, ...fieldProps },
    } = useController({
        name,
        control,
        rules: { ...rules },
        defaultValue,
    });

    const errorName = name.includes(".") && name.split(".");
    const fieldError: FieldError | undefined = errorName
        ? (errors?.[errorName[0]] as any)?.[errorName[1]]
        : (errors?.[name] as FieldError | undefined);

    const isRequired = (rules && rules.required) || (rules && rules.validate);

    // Find selected value from data
    const selectedValue = data.find((item) => item.value === val) || null;

    return (
        <FormControl margin={margin} fullWidth>
            <Autocomplete
                {...fieldProps}
                options={data}
                getOptionLabel={(option) => option.key}
                value={selectedValue}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(_, selectedOption) => fieldChange(selectedOption?.value || null)}
                disabled={disabled}
                readOnly={readOnly}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={isRequired ? label + " *" : label}
                        error={Boolean(fieldError)}
                        inputRef={ref}
                    />
                )}
            />
            {fieldError?.message && (
                <FormHelperText error>{fieldError.message}</FormHelperText>
            )}
        </FormControl>
    );
};

export default memo(AutoComplete);