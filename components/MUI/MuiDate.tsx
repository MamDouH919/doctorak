import {
    FormControl,
    FormHelperText,
    IconButton,
    Stack,
} from "@mui/material";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Clear } from "@mui/icons-material";
import { parseISO } from "date-fns";

interface MUIDateProps {
    control: Control<any>;
    disabled?: boolean;
    name: string;
    label?: string;
    rules?: Record<string, any>;
    defaultValue?: Date | null;
    variant?: "filled" | "outlined" | "standard";
    onChange?: (_value: Date | null) => void;
    value?: Date | null;
    InputProps?: Record<string, any>;
    [key: string]: any;
    disablePast?: boolean
}

const MUIDate: React.FC<MUIDateProps> = ({
    control,
    disabled,
    name,
    label,
    rules,
    defaultValue,
    onChange,
    value,
    disablePast,
    ...restProps
}) => {
    const {
        formState: { errors },
        field: { value: fieldValue, onChange: fieldChange, },
    } = useController({
        name,
        control,
        rules: { ...rules },
        defaultValue: defaultValue ?? null,
    });

    // Parse the value if it's a string
    const parsedValue = value ? (typeof value === 'string' ? parseISO(value) : value) : null;
    const parsedFieldValue = fieldValue ? (typeof fieldValue === 'string' ? parseISO(fieldValue) : fieldValue) : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormControl variant="outlined" fullWidth size="small">
                <DatePicker
                    {...restProps}
                    sx={{
                        ".MuiPickersInputBase-sectionsContainer": {
                            padding: 1,
                        },
                    }}
                    label={label}
                    value={parsedValue || parsedFieldValue}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => {
                        fieldChange(newValue);
                        if (onChange) {
                            onChange(newValue instanceof Date ? newValue : newValue?.toDate() ?? null);
                        }
                    }}
                    disabled={disabled}
                    disablePast={disablePast ?? false}
                    slotProps={{
                        textField: {
                            InputProps: {
                                startAdornment: (
                                    <Stack direction="row" pr={1} alignItems="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => fieldChange(null)}
                                            aria-label="clear"
                                        >
                                            <Clear fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                ),
                            }
                        },
                    }}
                />
                {errors[name] && (
                    <FormHelperText error>
                        {errors[name]?.message as string}
                    </FormHelperText>
                )}
            </FormControl>
        </LocalizationProvider>
    );
};

export default MUIDate;
