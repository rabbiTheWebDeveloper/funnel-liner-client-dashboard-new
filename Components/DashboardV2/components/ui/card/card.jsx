import * as React from "react";
import styles from "./card.module.css";
import { cls } from "../../../lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cls(styles.card, className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cls(styles.cardHeader, className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cls(styles.cardTitle, className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cls(styles.cardDescription, className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cls(styles.cardContent, className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cls(styles.cardFooter, className)} {...props} />
));
CardFooter.displayName = "CardFooter";

const CardIcon = React.forwardRef(({ className, color, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cls(styles.cardIcon, className)}
    style={{
      backgroundColor: color || '#f0f0f0',
    }}
    {...props}
  >
    {children}
  </div>
));
CardIcon.displayName = "CardIcon";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardIcon,
};
