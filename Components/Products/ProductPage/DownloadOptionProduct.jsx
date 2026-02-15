"use client";

import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

const DownloadOptionProduct = ({ orders = [] }) => {
  console.log("DownloadOptionProduct orders:", orders);
  
  // 🔹 Prepare data safely - FIXED VERSION
  const prepareData = () => {
    if (!orders.length) return [];

    return orders.map(order => {
      // If there are variations, map through them
      if (order.variations && order.variations.length > 0) {
        return order.variations.map(variation => ({
          "Product Name": order.product_name || "N/A",
          "Product Code": order.product_code || "N/A",
          "Category ID": order.category_id || "N/A",
          Variant: variation.variant || "N/A",
          Quantity: variation.quantity || 0,
          "Price (Each)": variation.price || order.price || 0,
          "Total Value": (variation.quantity || 0) * (variation.price || order.price || 0),
          "Discount Type": order.discount_type || "N/A",
          "Discount Applied":
            order.discount_type === "flat"
              ? `Flat ${order.discount}`
              : `${order.discount || 0}%`,
          "Delivery Charge": order.delivery_charge === "free" ? "Free" : (order.delivery_charge || "Free"),
          "Order Status": order.status === 1 ? "Active" : "Inactive",
          "Created At": moment(order.created_at).format("DD.MM.YYYY"),
          "Updated At": variation.updated_at 
            ? moment(variation.updated_at).format("DD.MM.YYYY")
            : moment(order.created_at).format("DD.MM.YYYY"),
        }));
      } else {
        // If no variations, create a single entry for the main product
        return [{
          "Product Name": order.product_name || "N/A",
          "Product Code": order.product_code || "N/A",
          "Category ID": order.category_id || "N/A",
          Variant: "Default",
          Quantity: order.product_qty || 0,
          "Price (Each)": order.price || 0,
          "Total Value": (order.product_qty || 0) * (order.price || 0),
          "Discount Type": order.discount_type || "N/A",
          "Discount Applied":
            order.discount_type === "flat"
              ? `Flat ${order.discount}`
              : `${order.discount || 0}%`,
          "Delivery Charge": order.delivery_charge === "free" ? "Free" : (order.delivery_charge || "Free"),
          "Order Status": order.status === 1 ? "Active" : "Inactive",
          "Created At": moment(order.created_at).format("DD.MM.YYYY"),
          "Updated At": moment(order.created_at).format("DD.MM.YYYY"),
        }];
      }
    }).flat(); // Flatten the array
  };

  // 🔹 Excel Download
  const downloadExcelFile = () => {
    const data = prepareData();
    console.log("Export data:", data); // Debug log
    if (!data.length) {
      alert("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product List");

    // Auto-size columns
    const maxWidth = data.reduce((w, r) => Math.max(w, r["Product Name"]?.length || 0), 10);
    worksheet['!cols'] = [{ wch: maxWidth + 5 }];

    XLSX.writeFile(workbook, `product_list_${moment().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  // 🔹 PDF Download
  const downloadPDF = () => {
    const data = prepareData();
    console.log("Export data for PDF:", data); // Debug log
    if (!data.length) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(16);
    doc.text("Product List Report", 148, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${moment().format("DD.MM.YYYY HH:mm")}`,
      148,
      22,
      { align: "center" }
    );

    // Prepare table data
    const headers = Object.keys(data[0]);
    const body = data.map(row => Object.values(row));

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 30,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 5, right: 5 },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 40 }, // Product Name
        1: { cellWidth: 20 }, // Product Code
        // Add more column width adjustments as needed
      }
    });

    // Add page number
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`product_list_${moment().format('YYYYMMDD_HHmmss')}.pdf`);
  };

  // 🔹 Simple dropdown handler
  const handleChange = e => {
    if (e.target.value === "excel") downloadExcelFile();
    if (e.target.value === "pdf") downloadPDF();
    e.target.value = "";
  };

  return (
    <select 
      defaultValue="" 
      onChange={handleChange}
      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>
        📥 Download Report
      </option>
      <option value="excel">📊 Download Excel</option>
      <option value="pdf">📄 Download PDF</option>
    </select>
  );
};

export default DownloadOptionProduct;