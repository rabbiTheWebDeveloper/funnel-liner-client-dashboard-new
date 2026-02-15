import React from "react";
import styles from "./badge.module.css";
import { cls } from "../../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  return (
    <div className={cls(styles.badge, styles[variant], className)} {...props} />
  );
}

export { Badge };
