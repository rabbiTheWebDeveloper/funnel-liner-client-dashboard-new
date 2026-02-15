import * as React from "react";
import style from "./style.module.css";
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`${style.card} card ${className}`} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, color, ...props }, ref) => (
  <div
    ref={ref}
    style={{ backgroundColor: color }}
    className={style.cardHeader}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={style.cardTitle} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={style.cardDescription} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, color, ...props }, ref) => (
  <div
    className={`${style.cardContent} cardContent ${className}`}
    style={{ color }}
    ref={ref}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardCell = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={style.cardCell} {...props} />
));
CardCell.displayName = "CardCell";

const CardCellBody = React.forwardRef(({ className, color, ...props }, ref) => (
  <div ref={ref} className={style.cardCellBody} style={{ color }} {...props} />
));
CardCellBody.displayName = "CardCellBody";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={style.cardFooter} {...props} />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardCell,
  CardCellBody,
  CardDescription,
  CardContent,
};
