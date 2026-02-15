import React, { useState } from 'react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"; // For Excel download
import jsPDF from "jspdf"; // For PDF generation
import "jspdf-autotable"; // For table generation in PDF
import moment from 'moment';

const DownloadOption = ({ orders,setPerPage }) => {
  const [selectedOption, setSelectedOption] = useState("");
  // Function to generate and download Excel file
  const downloadExcelFile = () => {
    // Flatten data for product-wise Excel
    const excelData = orders.flatMap((order, index) => 
      order.order_details.map(detail => ({
        "Order No": order.order_no,
        "Order Date": moment(order.created_at).format("DD.MM.YY"),  
        "Customer Name": order.customer_name,
        Phone: order.phone,
        Address: order.address,
        "Product Name": detail.product,
        "Product Code": detail.product_code,
        "Due": order.due,
        "Advanced ": order.advanced,
        "Variant": detail.variations?.variant || "N/A",
        "Quantity": detail.quantity,
        "Price (Each)": detail.price,
        "Total Price": detail.price * detail.quantity,
        "Discount Applied": detail.discount_type === "flat"
          ? `Flat ${detail.discount}`
          : `${detail.discount}%`,
        "Shipping Cost (Each)": detail.shipping_cost,
        "Shipping Cost (Combined)": order.shipping_cost,
        "Order Status": order.order_status,
        "Order Source": order.order_type,
        "Courier": order.courier_provider || "N/A",
      }))
    );
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      header: [
        "Order No",
        "Order Date",
        "Customer Name",
        "Phone",
        "Address",
        "Product Name",
        "Product Code",
        "Due",
        "Advanced ",
        "Variant",
        "Quantity",
        "Price (Each)",
        "Total Price",
        "Discount Applied",
        "Shipping Cost (Each)",
        "Shipping Cost (Combined)",
        "Order Status",
        "Order Source",
        "Courier"
       
      ],
    });
  
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product-Wise Orders");
  
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    saveAs(file, "product_wise_order_report.xlsx");
  };



  // PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add company logo (centered)
   

    // Header style
    doc.setFontSize(14);
    doc.setTextColor(0); // Black color
    doc.setFont("helvetica", "bold");
  
    // Center the logo and text
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 50; // Width of the logo
    const logoHeight = 20; // Height of the logo
    const centerX = (pageWidth - logoWidth) / 2;
  
    // doc.addImage(logoBase64, "png", centerX, 10, logoWidth, logoHeight); // Logo centered
    doc.text("FunnelLiner", pageWidth / 2, 30, { align: "center" ,"color": "#6b2cd1" });
    doc.text("Order Report", pageWidth / 2, 40, { align: "center" }); // Center-aligned title
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 50, {
      align: "center",
    });
    doc.text("Description: FunnelLiner Order Report", pageWidth / 2, 60, {
      align: "center",
    });
  
    // Prepare data for table
    const tableData = orders.flatMap(order => {
      return order.order_details.map(detail => ({
        OrderNo: order.order_no,
        Customer: order.customer_name,
        Phone: order.phone,
        Address: order.address,
        Product: detail.product,
        Quantity: detail.quantity,
        Price: detail.price,
        Total: detail.price * detail.quantity,
      }));
    });
  
    // Add table
    doc.autoTable({
      head: [
        [
          "Order No",
          "Customer",
          "Phone",
          "Address",
          "Product",
          "Quantity",
          "Price",
          "Total",
        ],
      ],
      body: tableData.map(row => Object.values(row)),
      startY: 70, // Table starts below the description
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Black background, white text for header
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray rows
    });
  
    // Save PDF
    doc.save("order_report.pdf");
  };

  const handleOptionChange = event => {
    setSelectedOption(event.target.value);
    if (event.target.value === "excel") {
      downloadExcelFile();
    } else if (event.target.value === "pdf") {
      generatePDF();
    }
    setSelectedOption("");
  };
console.log("orders",orders)
  return (
    <select
      name="downloadReport"
      value={selectedOption}
      onChange={handleOptionChange}
    >
      <option value="" disabled>
        Download Report
      </option>
      <option value="excel">As Excel</option>
      <option value="pdf">As PDF</option>
    </select>
  );
};

export default DownloadOption;
