import React, { memo } from "react";
import {
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useController } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";


interface MUIAutocompleteProps {
  control: Control<any>;
  data: { value: string | number; key: string }[];
  name: string;
  disabled?: boolean;
  margin?: "none" | "dense" | "normal";
  label: string;
  rules?: any; // You can type this more strictly based on your validation rules
  readOnly?: boolean;
  defaultValue?: Array<string | number>;
}

const MUIAutocomplete: React.FC<MUIAutocompleteProps> = (props) => {
  const {
    control,
    data,
    name,
    disabled = false,
    margin = "none",
    label,
    rules,
    readOnly = false,
    defaultValue = [],
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

  // Map `defaultValue` or current `value` to the corresponding objects in `data`  
  const selectedValues = data.filter((item) => val?.includes(item.value));

  return (
    <FormControl margin={margin} fullWidth>
      <Autocomplete
        {...fieldProps}
        multiple
        options={data}
        getOptionLabel={(option) => option.key}
        value={selectedValues} // Use mapped selected values
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_, selectedOptions) =>
          fieldChange(selectedOptions.map((option) => option.value))
        }
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


export default memo(MUIAutocomplete);
