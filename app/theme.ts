// src/theme.ts
import { createTheme } from '@mui/material/styles';

export default function getTheme({
    primary,
    secondary,
    dir
}:{
    primary: string,
    secondary: string,
    dir: "ltr" | "rtl"
}) {
  return createTheme({
    direction: dir,
    shape: {
      borderRadius: 15,
    },
    components: {
      MuiIcon: {
        styleOverrides: {
          root: {
            fontFamily: "'Material Icons Outlined' !important",
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            textTransform: "capitalize",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "0 16px",
            maxHeight: "45px",
            height: "45px",
            whiteSpace: "nowrap",
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          variant: "filled",
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            "& label ,& input ,& .MuiSelect-select": {},
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
    },

    palette: {
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      background: {
        default: "#fafafa",
        paper: "#fff",
      },
    },

    typography: {
      fontFamily: [`cairo`, "sans-serif"].join(","),
      fontSize: 12.5,
    },
  });
}
