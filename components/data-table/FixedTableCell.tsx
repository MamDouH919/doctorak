import { memo, ReactNode } from "react";
import { styled } from '@mui/material/styles';
import { TableCell, TableCellProps } from "@mui/material";
// import { useTranslation } from "react-i18next";

const PREFIX = 'FixedTableCell';

const classes = {
    cellWidth: `${PREFIX}-cellWidth`
};

const StyledTableCell = styled(TableCell)(() => ({
    [`& .${classes.cellWidth}`]: {
        whiteSpace: "normal",
        maxWidth: "200px",
        inlineSize: "max-content",
    }
}));

interface FixedTableCellProps extends TableCellProps {
    allowPlaceholder?: boolean;
    dir?: "ltr" | "rtl";
    children?: ReactNode;
}

export const FixedTableCell = memo(function FixedTableCell(props: FixedTableCellProps) {
    const { allowPlaceholder = true, dir, ...restProps } = props;
    // const { t } = useTranslation();
    return (
        <StyledTableCell {...restProps}>
            <div className={classes.cellWidth} dir={dir}>
                {props.children ?? (allowPlaceholder && "ــــ")}
            </div>
        </StyledTableCell>
    );
});

FixedTableCell.displayName = 'FixedTableCell';