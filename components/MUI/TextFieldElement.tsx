import React from "react";
import type { ChangeEvent } from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { useController } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const Root = styled(TextField)(() => ({
    [`& input[type=number]::-webkit-inner-spin-button`]: {
        WebkitAppearance: "none",
        margin: 0,
    },
    [`& input[type=number]::-webkit-outer-spin-button`]: {
        WebkitAppearance: "none",
        margin: 0,
    },
}));

interface ControlMUITextFieldProps extends Omit<TextFieldProps, 'name' | 'control'> {
    name: string;
    control: any;
    defaultValue?: any;
    readOnly?: boolean;
    inputProps?: any;
    rules?: {
        required?: boolean | string;
        validate?: {
            whiteSpace?: (value: string) => boolean | string;
            [key: string]: ((value: any) => boolean | string) | undefined;
        };
    };
    inputSlotProps?: any
    serverValidation?: Record<string, string[]>;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TextFieldElement: React.FC<ControlMUITextFieldProps> = (props) => {
    const {
        name,
        control,
        defaultValue,
        readOnly,
        inputProps,
        rules,
        onChange,
        variant,
        size,
        serverValidation,
        label,
        inputSlotProps,
        ...restProps
    } = props;

    const { t } = useTranslation();

    const {
        formState: { errors },
        field: { ref, onChange: fieldChange, ...fieldProps },
    } = useController({
        name,
        control,
        rules: {
            ...rules,
            validate: {
                whiteSpace: (value: string) => {
                    if (value && typeof value === "string") {
                        return !!value.trim() || t("fieldIsRequired");
                    }
                    return true;
                },
                ...(rules?.validate ?? {}),
            },
        },
        defaultValue: defaultValue ?? "",
    });

    const errorName = name.includes(".") && name.split(".");
    const serverError = errorName ? errorName[1] : name;

    const fieldError = errorName
        ? (errors?.[errorName[0]] as Record<string, FieldError | undefined>)?.[errorName[1]]
        : (errors?.[name] as FieldError);

    const isRequired =
        rules?.required ||
        (rules?.validate?.max && typeof rules?.validate?.max === "function") ||
        (rules?.validate?.require && typeof rules?.validate?.require === "function");

    return (
        <Root
            inputRef={ref}
            {...fieldProps}
            {...restProps}
            label={isRequired ? `${label} *` : label}
            defaultValue={defaultValue}
            autoComplete="off"
            id={name}
            variant={variant || "filled"}
            fullWidth
            multiline={!!props.rows}
            error={Boolean(fieldError || serverValidation?.[serverError])}
            helperText={
                fieldError?.message ||
                (serverValidation && serverValidation?.[serverError]?.[0]) ||
                null
            }
            slotProps={{
                input: {
                    inputProps: {
                        readOnly: readOnly,
                        ...inputProps,
                    },
                    ...inputSlotProps
                }
            }}
            onChange={(e) => {
                fieldChange(e);
                if (onChange) {
                    onChange(e);
                }
            }}
            size={size ?? "small"}
        />
    );
};

export default TextFieldElement;
