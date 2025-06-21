import { ArrowDropDown } from "@mui/icons-material";
import {
  Autocomplete,
  AutocompleteProps,
  CircularProgress,
  TextField,
} from "@mui/material";
import { matchSorter } from "match-sorter";
import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  useController,
} from "react-hook-form";

import { FixedSizeList } from "react-window";

const VirtualizedListbox = React.forwardRef<HTMLDivElement, any>(
  function VirtualizedListbox(props, ref) {
    const { children, ...other } = props;
    const items = React.Children.toArray(children);
    const ITEM_HEIGHT = 40; // Height of each option
    const MAX_VISIBLE_ITEMS = 8; // Maximum number of visible items

    return (
      <div
        ref={ref}
        {...other}
        style={{
          overflow: "hidden", // Prevent the outer container from scrolling
          gap: 0,
        }}
      >
        <FixedSizeList
          height={Math.min(
            ITEM_HEIGHT * MAX_VISIBLE_ITEMS,
            items?.length * ITEM_HEIGHT
          )} // Show max 8 items or less
          itemCount={items?.length}
          itemSize={ITEM_HEIGHT}
          width="100%"
          style={{
            direction: "rtl",
          }}
        >
          {({ index, style }) => <div style={style}>{items[index]}</div>}
        </FixedSizeList>
      </div>
    );
  }
);

export interface IProps<T extends FieldValues>
  extends Omit<AutocompleteProps<any, any, any, any>, "renderInput"> {
  name: Path<T>;
  label: string;
  rules?: any;
  valueKey: string;
  control: Control<T>;
  loading: boolean;
  variant?: "outlined" | "filled" | "standard";
  selectFirst?: boolean;
  onChangeFn?: (e?: any) => void;
}

const AutoCompleteComponent = <T extends FieldValues>({
  name,
  label,
  rules,
  options,
  valueKey,
  control,
  defaultValue,
  loading,
  multiple = false,
  variant,
  selectFirst,
  onChangeFn,
  ...rest
}: IProps<T>) => {

  const { field } = useController({ name, control });

  const [valueState, setValueState] = useState([]);

  const handleFilterOptions = (options: any, state: any) => {
    const { inputValue } = state;
    const filteredOptions = options?.filter(
      (option: any) => option.id !== field.value
    ); // test it

    if (inputValue) {
      return matchSorter(filteredOptions, inputValue, {
        keys: ["name", "code"],
        baseSort: () => 0,
      });
    }

    return filteredOptions;
  };

  const handleChange = (_: any, newValue: any) => {
    if (!newValue) {
      field.onChange(multiple ? [] : "");
      setValueState([]);
      if (onChangeFn) {
        onChangeFn();
      }
      return;
    }

    const isArray = Array.isArray(newValue);
    field.onChange(
      isArray ? newValue.map((value) => value[valueKey]) : newValue[valueKey]
    );

    // isArray
    //   ? field.onChange(newValue.map((value) => value[valueKey]))
    //   : field.onChange(newValue[valueKey]);
    if (onChangeFn) {
      onChangeFn();
    }
    setValueState(newValue);
  };

  useEffect(() => {    
    if (field.value) {
      setValueState(
        multiple
          ? options?.filter((opt) => field?.value?.includes(opt[valueKey]))
          : options?.find((opt) => opt[valueKey] == field.value) || null
      );
    } else {
      setValueState([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value, options, multiple]);

  useEffect(() => {
    if (selectFirst && options?.length > 0 && !field.value) {
      const firstOption = options[0];
      field.onChange(firstOption[valueKey]); // Set form value
      setValueState(firstOption); // Set component UI value
    }
  }, [selectFirst, options, field, valueKey]);

  return (
    <Controller
      rules={rules}
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        field: { onChange, ...restFields }, // Same method like ...register,
        fieldState: { error },
      }) => {
        return (
          <Autocomplete
            {...restFields}
            renderInput={(params) => (
              <TextField
                {...params}
                label={rules && rules.required ? `${label} *` : label}
                error={!!error}
                helperText={error?.message}
                variant={variant || "outlined"}
              />
            )}
            defaultChecked={restFields.value} // return value but not selected value
            options={options || []}
            getOptionLabel={(option) => {
              return option?.name ?? "";
            }}
            // change it to id to ensure always get unique key value
            getOptionKey={(option) => option.id ?? option.name}
            //If your options are objects,
            // you must provide the isOptionEqualToValue prop to ensure correct selection and highlighting.
            isOptionEqualToValue={(option, value) =>
              option[valueKey] === value[valueKey]
            }
            value={valueState} // Make sure the value is correctly mapped
            onChange={handleChange}
            filterOptions={handleFilterOptions}
            popupIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <ArrowDropDown /> // Replace with your desired icon for the arrow
              )
            }
            {...rest}
            disableClearable={!field.value}
            ListboxComponent={VirtualizedListbox}
            multiple={multiple}
            defaultValue={selectFirst ? options?.[0] : ""}
          />
        )
      }}
    />
  );
};

export default AutoCompleteComponent;
