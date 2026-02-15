import * as React from "react";
import styles from "./input.module.css";
import { cls } from "../../../lib/utils";

const inputVariants = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = styles.input;
  const variantClasses = styles[variant] || "";
  const sizeClasses = styles[size] || "";

  return cls(baseClasses, variantClasses, sizeClasses, className);
};

const Input = React.forwardRef(
  ({ className, variant, size, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={inputVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants }; 