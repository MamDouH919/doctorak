import React, { memo } from "react";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    useTheme,
} from "@mui/material";
import type {
    SelectChangeEvent,
    TextFieldProps
} from "@mui/material";
import { useController } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import get from "lodash/get";

interface MUIselectProps extends Omit<TextFieldProps, 'name' | 'control'> {
    control: any;
    data: { value: string | number; key: string, disabled?: boolean }[];
    name: string;
    disabled?: boolean;
    margin?: "none" | "dense" | "normal";
    label: string;
    onChanges?: (_event: SelectChangeEvent<string | number>) => void;
    rules?: any;
    readOnly?: boolean;
    defaultValue?: string | number;
}

const MUIselect: React.FC<MUIselectProps> = (props) => {
    const {
        control,
        data,
        name,
        disabled = false,
        margin = "none",
        label,
        onChanges,
        rules,
        readOnly = false,
        defaultValue,
    } = props;

    const theme = useTheme();
    const dir = theme.direction;

    const {
        formState: { errors },
        field: { ref, value: val, onChange: fieldChange, ...fieldProps },
    } = useController({
        name,
        control,
        rules: { ...rules },
        defaultValue: data && defaultValue ? defaultValue : "",
    });

    const fieldError = get(errors, name) as FieldError | undefined;

    const isRequired = rules?.required || rules?.validate;

    return (
        <FormControl margin={margin} fullWidth size="small">
            <InputLabel id={name}>{isRequired ? label + " *" : label}</InputLabel>

            <Select
                {...fieldProps}
                variant="outlined"
                inputRef={ref}
                inputProps={{ readOnly }}
                label={label}
                error={Boolean(fieldError)}
                value={val}
                disabled={disabled}
                onChange={(e) => {
                    fieldChange(e.target.value);
                    if (onChanges) {
                        onChanges(e);
                    }
                }}
            >
                {data?.map((item, index) => (
                    <MenuItem key={index} value={item.value} dir={dir} disabled={item.disabled}>
                        {item.key}
                    </MenuItem>
                ))}
            </Select>

            {fieldError?.message && (
                <FormHelperText error>{fieldError.message}</FormHelperText>
            )}
        </FormControl>
    );
};

export default memo(MUIselect);
