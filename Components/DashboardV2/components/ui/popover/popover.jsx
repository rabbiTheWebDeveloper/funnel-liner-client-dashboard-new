import * as React from "react";
import { Popover as MuiPopover } from "@mui/material";
import { cls } from "../../../lib/utils";
import styles from "./popover.module.css";

const Popover = React.forwardRef(({ 
  className,
  children,
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "left",
  },
  marginThreshold = 8,
  ...props 
}, ref) => (
  <MuiPopover
    ref={ref}
    classes={{
      paper: cls(styles.paper, className)
    }}
    anchorOrigin={anchorOrigin}
    transformOrigin={transformOrigin}
    marginThreshold={marginThreshold}
    {...props}
  >
    {children}
  </MuiPopover>
));

Popover.displayName = "Popover";

export { Popover };
