import type { ChangeEvent } from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { useController } from "react-hook-form";
import type { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ControlMUITextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'control'> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: any;
  readOnly?: boolean;
  rules?: {
    required?: boolean | string;
    validate?: {
      whiteSpace?: (_value: string) => boolean | string;
      [key: string]: ((_value: any) => boolean | string) | undefined;
    };
  };
  label?: string;
  serverValidation?: Record<string, string[]>;
  onChange?: (_event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ControlMUITextField = <T extends FieldValues>(props: ControlMUITextFieldProps<T>) => {
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
    <TextField
      inputRef={ref}
      {...fieldProps}
      {...restProps}
      label={isRequired ? `${label} *` : label}
      defaultValue={defaultValue}
      autoComplete="off"
      id={name}
      variant={variant || "outlined"}
      fullWidth
      multiline={!!props.rows}
      error={Boolean(fieldError || serverValidation?.[serverError])}
      helperText={
        fieldError?.message ||
        (serverValidation && serverValidation?.[serverError]?.[0]) ||
        null
      }
      inputProps={{
        readOnly: readOnly,
        ...inputProps,
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

export default ControlMUITextField;
