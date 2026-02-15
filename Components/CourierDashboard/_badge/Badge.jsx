import * as React from "react";
import style from "./style.module.css";

const Badge = React.forwardRef(({ className, color, ...props }, ref) => (
  <div
    ref={ref}
    className={style.badge}
    style={{ backgroundColor: color }}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
