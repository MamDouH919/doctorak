import React, { memo } from "react";
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    // FormLabel,
    FormHelperText,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { useController } from "react-hook-form";
import type { FieldError } from "react-hook-form";

interface MUICheckboxGroupProps extends Omit<TextFieldProps, 'name' | 'control'> {
    control: any;
    data: { value: string | number; key: React.ReactNode | string }[];
    name: string;
    disabled?: boolean;
    margin?: "none" | "dense" | "normal";
    label: string;
    onChanges?: (selectedValues: (string | number)[]) => void;
    rules?: any; // You can type this more strictly based on your validation rules
    readOnly?: boolean;
    defaultValue?: (string | number)[];
}

const MuiCheckBox: React.FC<MUICheckboxGroupProps> = (props) => {
    const {
        control,
        data,
        name,
        disabled = false,
        // margin = "none",
        // label,
        onChanges,
        rules,
        readOnly = false,
        defaultValue = [],
    } = props;


    const {
        formState: { errors },
        field: { value: val, onChange: fieldChange },
    } = useController({
        name,
        control,
        rules: { ...rules },
        defaultValue: defaultValue || [],
    });

    const errorName = name.includes(".") && name.split(".");
    const fieldError: FieldError | undefined = errorName
        ? (errors?.[errorName[0]] as any)?.[errorName[1]]
        : (errors?.[name] as FieldError | undefined);

    // const isRequired = (rules && rules.required) || (rules && rules.validate);

    const handleCheckboxChange = (value: string | number) => {
        const currentValues = Array.isArray(val) ? val : [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value) // Remove if already selected
            : [...currentValues, value]; // Add if not selected
        fieldChange(newValues);
        if (onChanges) {
            onChanges(newValues);
        }
    };

    return (
        <FormControl variant="filled" fullWidth size="small">
            {/* <FormLabel>{isRequired ? label + " *" : label}</FormLabel> */}
            <FormGroup>
                {data?.map((item, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                checked={Array.isArray(val) && val.includes(item.value)}
                                onChange={() => handleCheckboxChange(item.value)}
                                disabled={disabled || readOnly}
                            />
                        }
                        label={item.key}
                        sx={{
                            m: 0,
                            '& .MuiFormControlLabel-label': {
                                flexGrow: 1,
                            }
                        }}
                    />
                ))}
            </FormGroup>
            {fieldError?.message && (
                <FormHelperText error>{fieldError.message}</FormHelperText>
            )}
        </FormControl>
    );
};

export default memo(MuiCheckBox);
