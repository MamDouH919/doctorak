import { Checkbox } from "@mui/material";
import { useEffect, useRef } from "react";

export function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & React.ComponentProps<typeof Checkbox>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <Checkbox
      inputRef={ref}
      indeterminate={indeterminate && !rest.checked}
      sx={{
        padding: "4px",
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
      {...rest}
    />
  );
}
