import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const DownloadOptionSubCategory = ({ subCategories, categories }) => {
  const [selectedOption, setSelectedOption] = useState("");

  // Get parent category name by id
  const getParentCategoryName = (parentId) => {
    const parent = categories?.find((cat) => cat.id === parentId);
    return parent ? parent.name : "N/A";
  };

  // Prepare data for Excel and PDF
  const prepareData = () =>
    subCategories.map((item) => ({
      "Sub Category ID": item.id,
      "Sub Category Name": item.name,
      "Parent Category": getParentCategoryName(item.parent_id),
      Slug: item.slug,
      Description: item.description || "N/A",
      "Shop ID": item.shop_id,
      "Parent ID": item.parent_id,
      Status: item.status === 1 ? "Active" : "Inactive",
      "Created At": moment(item.created_at).format("DD.MM.YYYY"),
      "Updated At": moment(item.updated_at).format("DD.MM.YYYY"),
      "Category Image URL": item.category_image || "N/A",
    }));

  // Generate Excel file
  const downloadExcelFile = () => {
    const data = prepareData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sub Categories");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "sub_category_list.xlsx");
  };

  // Generate PDF file
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Title
    doc.setFontSize(14);
    doc.text("Sub Category List Report", pageWidth / 2, 20, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${moment().format("DD.MM.YYYY")}`,
      pageWidth / 2,
      30,
      {
        align: "center",
      }
    );

    // Prepare table data
    const data = prepareData();
    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Save PDF
    doc.save("sub_category_list.pdf");
  };

  // Handle dropdown change
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "excel") {
      downloadExcelFile();
    } else if (event.target.value === "pdf") {
      generatePDF();
    }
    setSelectedOption("");
  };

  return (
    <select
      name="downloadReport"
      value={selectedOption}
      onChange={handleOptionChange}
      style={{ padding: "8px", borderRadius: "4px", margin: "10px 0" }}
    >
      <option value="" disabled>
        Download Report
      </option>
      <option value="excel">As Excel</option>
      {/* <option value="pdf">As PDF</option> */}
    </select>
  );
};

export default DownloadOptionSubCategory;
