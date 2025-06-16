import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Paper, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

interface propsInput {
  PaperProps?: any;
  handleClose: () => void;
  open: boolean;
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  buttonAction?: string | React.ReactNode;
  hideActions?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  stopCloseOnBackdropClick?: boolean;
  disableCancel?: boolean;
}

const DialogContentStyle = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const DialogTitleStyle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  "& h2": {
    padding: theme.spacing(1),
  },
}));

export default function CustomDialog(props: propsInput) {
  const {
    open,
    handleClose,
    PaperProps,
    title,
    content,
    buttonAction,
    hideActions = false,
    maxWidth = "xs",
    stopCloseOnBackdropClick = false,
    disableCancel
  } = props;

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          if (stopCloseOnBackdropClick) {
            return
          }
          handleClose()
        }}
        PaperProps={PaperProps}
        maxWidth={maxWidth}
      >
        {title && (
          <Paper
            sx={{ background: (theme) => theme.palette.background.default }}
          >
            <DialogTitleStyle textTransform={"capitalize"}>
              {title}
            </DialogTitleStyle>
          </Paper>
        )}
        {content && <DialogContentStyle>{content}</DialogContentStyle>}
        {!hideActions && (
          <DialogActions
            sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
          >
            <Stack direction={"row"} spacing={1}>
              <Button onClick={handleClose} color='inherit' variant='contained' disabled={disableCancel}>
                {"إلغاء"}
              </Button>
              {buttonAction}
            </Stack>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
