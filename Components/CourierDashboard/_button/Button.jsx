import * as React from "react";
import style from "./style.module.css";

const Button = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={`${style.button} card ${className} ${style[variant]}`}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };
