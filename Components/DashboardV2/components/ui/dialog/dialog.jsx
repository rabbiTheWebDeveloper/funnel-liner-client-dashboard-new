import * as React from "react";
import { Dialog as MuiDialog } from "@mui/material";
import styles from "./dialog.module.css";
import { cls } from "../../../lib/utils";

const dialogVariants = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = styles.dialog;
  const variantClasses = styles[variant] || "";
  const sizeClasses = styles[size] || "";

  return cls(baseClasses, variantClasses, sizeClasses, className);
};

const Dialog = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <MuiDialog
        ref={ref}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
        sx={{
          "& .MuiDialog-paper": {
            margin: "0",
          },
          "& .MuiDialog-container": {
            alignItems: "flex-start",
            paddingTop: "5vh",
          },
        }}
        className={dialogVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </MuiDialog>
    );
  }
);

Dialog.displayName = "Dialog";

export { Dialog, dialogVariants }; 