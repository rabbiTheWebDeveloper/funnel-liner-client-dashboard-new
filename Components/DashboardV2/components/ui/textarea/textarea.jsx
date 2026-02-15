import * as React from "react";
import styles from "./textarea.module.css";
import { cls } from "../../../lib/utils";

const textareaVariants = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = styles.textarea;
  const variantClasses = styles[variant] || "";
  const sizeClasses = styles[size] || "";

  return cls(baseClasses, variantClasses, sizeClasses, className);
};

const Textarea = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={textareaVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants }; 