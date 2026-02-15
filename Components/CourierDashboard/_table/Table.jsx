import * as React from "react";

import style from "./style.module.css";
import { Button } from "@mui/material";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className={style.tableContainer}>
    <table
      border="0"
      ref={ref}
      className={`${style.table} custom-table ${className}`}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableTop = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${style.tableTop} custom-tableTop ${className}`}
    {...props}
  />
));
TableTop.displayName = "TableTop";

const TableTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${style.tableTitle} custom-tableTitle ${className}`}
    {...props}
  />
));
TableTop.displayName = "TableTitle";

const TableButton = React.forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    className={`${style.tableButton} custom-tableButton ${className}`}
    {...props}
  />
));
TableTop.displayName = "TableButton";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={`${style.tableHeader} custom-tableHeader ${className}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={`${style.tableBody} custom-tableBody ${className}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`${style.tableRow} custom-tableRow ${className}`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`${style.tableHead} custom-tableHead ${className}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={`${style.tableCell} custom-tableCell ${className}`}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export {
  Table,
  TableTop,
  TableTitle,
  TableButton,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
};
