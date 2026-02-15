import * as React from "react";
import { Tooltip as MuiTooltip } from "@mui/material";
import { Slot } from "@radix-ui/react-slot";
import styles from "./tooltip.module.css";
import { cls } from "../../../lib/utils";

const tooltipVariants = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = styles.tooltip;
  const variantClasses = styles[variant] || "";
  const sizeClasses = styles[size] || "";

  return cls(baseClasses, variantClasses, sizeClasses, className);
};

const Tooltip = React.forwardRef(
  (
    { className, variant, size, asChild = false, children, content, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <MuiTooltip
        title={content}
        classes={{
          tooltip: tooltipVariants({ variant, size, className }),
          arrow: styles.arrow,
        }}
        ref={ref}
        {...props}
      >
        <Comp>{children}</Comp>
      </MuiTooltip>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip, tooltipVariants };
