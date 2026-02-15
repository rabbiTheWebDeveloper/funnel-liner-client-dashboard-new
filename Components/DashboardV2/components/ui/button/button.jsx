import * as React from "react";
import { Button as MuiButton } from "@mui/material";
import { Slot } from "@radix-ui/react-slot";
import styles from "./button.module.css";
import { cls } from "../../../lib/utils";

const buttonVariants = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = styles.button;
  const variantClasses = styles[variant] || "";
  const sizeClasses = styles[size] || "";

  return cls(baseClasses, variantClasses, sizeClasses, className);
};

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : MuiButton;
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        variant="contained"
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
