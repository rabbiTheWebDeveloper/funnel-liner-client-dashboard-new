import * as React from "react";
import styles from "./label.module.css";
import { cls } from "../../../lib/utils";

const labelVariants = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = styles.label;
  const variantClasses = styles[variant] || "";
  const sizeClasses = styles[size] || "";

  return cls(baseClasses, variantClasses, sizeClasses, className);
};

const Label = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={labelVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label, labelVariants }; 