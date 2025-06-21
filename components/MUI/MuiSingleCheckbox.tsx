import React, { memo } from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";
import { useController, FieldError, Control } from "react-hook-form";

interface MUISingleCheckboxProps {
    control: Control<any>;
    name: string;
    label: React.ReactNode;
    disabled?: boolean;
    readOnly?: boolean;
    rules?: any;
    defaultValue?: boolean;
    onChange?: (checked: boolean) => void;
}

const MuiSingleCheckbox: React.FC<MUISingleCheckboxProps> = ({
    control,
    name,
    label,
    disabled,
    readOnly,
    rules,
    defaultValue,
    onChange,
}) => {
    const {
        field: { value, onChange: fieldOnChange },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules,
        defaultValue,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        fieldOnChange(checked); // update form state
        onChange?.(checked);    // call external handler
    };

    return (
        <FormControl fullWidth size="small" error={!!error}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!value}
                        onChange={handleChange}
                        disabled={disabled || readOnly}
                    />
                }
                label={label}
                sx={{ m: 0 }}
            />
            {error?.message && (
                <FormHelperText>{error.message}</FormHelperText>
            )}
        </FormControl>
    );
};

export default memo(MuiSingleCheckbox);
