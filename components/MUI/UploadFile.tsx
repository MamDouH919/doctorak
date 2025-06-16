import React from "react";
import { useState, type ChangeEvent } from "react";
import { Icon, IconButton, InputAdornment, Stack, styled, Typography } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { useController } from "react-hook-form";
import ControlMUITextField from "./ControlMUItextField";

const Input = styled("input")({
    display: "none",
});

interface UploadFileProps extends Omit<TextFieldProps, 'name' | 'control'> {
    name: string;
    control: any;
    defaultValue?: any;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    icon: string;
    accept: string;
    setValue: any;
    iconDisable?: boolean;
    rules?: any;
    fileName?: string;
    label: string;
    maxSize: number; // Max file size in bytes
}

const UploadFile: React.FC<UploadFileProps> = (props) => {
    const {
        name,
        control,
        defaultValue,
        onChange,
        icon,
        accept,
        setValue,
        iconDisable,
        rules,
        fileName,
        maxSize,
        label,
    } = props;

    const {
        field: { onChange: fieldChange, value, ...fieldProps },
    } = useController({
        name,
        control,
        defaultValue: defaultValue ?? "",
    });

    // const [_fileInfo, setFileInfo] = useState<{ name: string; size: number | null }>({ name: "", size: null });
    const [fileError, setFileError] = useState<string | null>(null);

    const handleChangeShipment = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > maxSize) {
                setFileError(`File size exceeds the maximum size of ${maxSize / 1024} KB`);
                // setFileInfo({ name: "", size: null });
                return;
            }
            setFileError(null);
            // setFileInfo({ name: file.name, size: file.size }); // Store file name and size
            setValue(fileName ?? "fileName", file.name, { shouldValidate: true });
        }
    };

    return (
        <Stack width={"100%"}>
            <ControlMUITextField
                label={label}
                control={control}
                name={fileName ?? "fileName"}
                readOnly
                rules={rules}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <label htmlFor={`icon-button-${fileName}`}>
                                    <Input
                                        {...fieldProps}
                                        name={name}
                                        disabled={iconDisable}
                                        value={value?.filename}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0];
                                            if (file && file.size <= maxSize) {
                                                fieldChange(file);
                                                handleChangeShipment(e);
                                            } else {
                                                setFileError(
                                                    `File size exceeds the maximum size of ${maxSize / 1024} KB`
                                                );
                                            }
                                            if (onChange) {
                                                onChange(e)
                                            }
                                        }}
                                        onClick={(event: any) => {
                                            if (!value) {
                                                event.target.value = null;
                                            }
                                        }}
                                        accept={accept}
                                        id={`icon-button-${fileName}`}
                                        type="file"
                                    />
                                    <IconButton
                                        disabled={iconDisable}
                                        color="default"
                                        aria-label="upload"
                                        component="span"
                                        size="small"
                                    >
                                        <Icon fontSize="inherit">{icon}</Icon>
                                    </IconButton>
                                </label>
                            </InputAdornment>
                        ),
                    }
                }}
            />
            {/* Display file name and size */}
            {fileError && <Typography color={"error.main"}>{fileError}</Typography>}
        </Stack>
    );
};

export default UploadFile;
