import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { styled } from "@mui/material/styles";
import React from 'react';

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

interface CustomProps {
    name?: string;
    label: string;
}

type TextFieldCustomProps = CustomProps & TextFieldProps;

const TextFieldCustom: React.FC<TextFieldCustomProps> = ({ name, label, ...props }) => {
    return (
        <Root
            {...props} // Spread the remaining props to the TextField component
            name={name}
            label={label}
            variant="outlined"
        />
    );
}

export default TextFieldCustom;
