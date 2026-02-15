import { Box, Container } from "@mui/material";
import { cls } from "../../lib/utils";
import globalStyles from "../../global.module.css";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import { Card, CardContent } from "../../components/ui/card/card";
import { Button } from "../../components/ui/button/button";
import { FileDown, Printer } from "lucide-react";
import { Badge } from "../../components/ui/badge/badge";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import styles from "../reports/styles.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu/dropdown-menu";
import { DashboardLayout } from "../../DashboardLayout";
import useSWR from "swr";
import { fetcher } from "../reports/_reports";
import { API_ENDPOINTS } from "../../../../config/ApiEndpoints";
import { useState } from "react";
import HeaderDescription from "../../../Common/HeaderDescription/HeaderDescription";

export const SalesReportTabs = () => {
  const [selectedFilter, setSelectedFilter] = useState("this_month");

  const {
    data: salesReport,
    error,
    mutate,
  } = useSWR(`/client/sales-target-report?type=${selectedFilter}`, fetcher, {
    revalidateOnFocus: false,
  });

  const reportData = salesReport ? salesReport?.data : [];

  const getColorByPercentage = percentage => {
    if (percentage < 30) return `hsl(var(--destructive))`; // red
    if (percentage < 60) return `hsl(var(--warning))`; // orange
    if (percentage < 80) return `hsl(var(--success))`; // green
    return `hsl(var(--primary))`; // primary color
  };

  // Handle filter change
  const handleFilterChange = filterValue => {
    setSelectedFilter(filterValue);
    // SWR will automatically re-fetch when selectedFilter changes
  };

  const exportToExcel = () => {
    const exportData = reportData.map(row => ({
      Date: row.date,
      "Target Amount": `BDT ${row.target}`,
      "Achievement Amount": `BDT ${row.achived}`,
      "Achievement %": `${row.ratio}%`,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Target Reports");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `sales_target_reports_${selectedFilter}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");

    const tableData = reportData.map(row => [
      row.date,
      `BDT ${row.target}`,
      `BDT ${row.achived}`,
      `${row.ratio}%`,
    ]);

    autoTable(doc, {
      head: [["Date", "Target Amount", "Achievement Amount", "Achievement %"]],
      body: tableData,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 8,
        font: "helvetica",
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 100 }, // Date
        1: { cellWidth: 150 }, // Target
        2: { cellWidth: 150 }, // Achievement
        3: { cellWidth: 100 }, // Percentage
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: 80,
        fontSize: 10,
        fontStyle: "bold",
        font: "helvetica",
        halign: "left",
        cellPadding: 8,
      },
      didDrawPage: function (data) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(
          `Sales Target Reports - ${getFilterDisplayName(selectedFilter)}`,
          data.settings.margin.left,
          30
        );
      },
    });

    doc.save(`sales_target_reports_${selectedFilter}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper function to get display names for filters
  const getFilterDisplayName = filterValue => {
    const filterMap = {
      this_month: "This Month",
      last_month: "Last Month",
      "september-24": "September - 24",
      "august-24": "August - 24",
      "july-24": "July - 24",
    };
    return filterMap[filterValue] || filterValue;
  };

  return (
    <DashboardLayout>
      <HeaderDescription
        headerIcon={"flaticon-product"}
        title={"Sales Target Reports"}
        subTitle={"View detailed sales target achievement reports"}
        search={false}
        order={false}
        backbutton={true}
      />
      <Container>
        <section>
          <div className={cls(globalStyles.header, globalStyles["flex"])}>
            <Box
              className={cls(globalStyles["flex-between"])}
              sx={{ gap: 1, width: "100%" }}
            >
              <h1></h1>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", padding: 1 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={styles.dropdownMenuButton}
                    >
                      <FileDown />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={exportToExcel}>
                      <FileDown />
                      Export to Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToPDF}>
                      <FileDown />
                      Export to PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint}>
                      <Printer />
                      Print
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DateSelector
                  placeholder={getFilterDisplayName(selectedFilter)}
                  defaultValue={selectedFilter}
                  onValueChange={handleFilterChange}
                >
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  {/* <SelectItem value="september-24">September - 24</SelectItem>
                  <SelectItem value="august-24">August - 24</SelectItem>
                  <SelectItem value="july-24">July - 24</SelectItem> */}
                </DateSelector>
              </Box>
            </Box>
          </div>

          <Card className={globalStyles.dashboard_card}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <span>Filter: {getFilterDisplayName(selectedFilter)}</span>
                {reportData.length > 0 && (
                  <span>Total Records: {reportData.length}</span>
                )}
              </Box>

              <Box sx={{ overflow: "auto" }}>
                <table
                  className={cls(
                    globalStyles.card_table,
                    globalStyles.table_highlight
                  )}
                >
                  <thead>
                    <tr
                      className={cls(
                        globalStyles.card_table_item,
                        globalStyles.card_table_header
                      )}
                    >
                      <th className={globalStyles.card_table_cell}>
                        <h1 className={globalStyles.card_title}>Date</h1>
                      </th>
                      <th className={globalStyles.card_table_cell}>
                        <h1 className={globalStyles.card_title}>
                          Target Amount
                        </h1>
                      </th>
                      <th className={globalStyles.card_table_cell}>
                        <h1 className={globalStyles.card_title}>
                          Achievement Amount
                        </h1>
                      </th>
                      <th className={globalStyles.card_table_cell}>
                        <h1 className={globalStyles.card_title}>Status</h1>
                      </th>
                      <th
                        className={cls(
                          globalStyles.card_table_cell,
                          globalStyles.right
                        )}
                      >
                        <h1 className={globalStyles.card_title}>
                          Achievement %
                        </h1>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData?.length > 0 ? (
                      reportData.map(row => (
                        <tr
                          key={row.id}
                          className={globalStyles.card_table_item}
                        >
                          <td className={globalStyles.card_table_cell}>
                            <h1 className={globalStyles.card_title}>
                              {row.date}
                            </h1>
                          </td>
                          <td className={globalStyles.card_table_cell}>
                            <h1 className={globalStyles.card_title}>
                              BDT {row.target}
                            </h1>
                          </td>
                          <td className={globalStyles.card_table_cell}>
                            <h1 className={globalStyles.card_title}>
                              BDT {row.achived}
                            </h1>
                          </td>
                          <td className={globalStyles.card_table_cell}>
                            <h1 className={globalStyles.card_title}>
                              {row.status}
                            </h1>
                          </td>
                          <td
                            className={cls(
                              globalStyles.card_table_cell,
                              globalStyles.right
                            )}
                          >
                            <Badge
                              style={{
                                backgroundColor: getColorByPercentage(
                                  row.ratio
                                ),
                                color: "white",
                              }}
                            >
                              {row.ratio}%
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className={globalStyles.card_table_cell}
                          style={{ textAlign: "center" }}
                        >
                          <h1 className={globalStyles.card_title}>
                            {error ? "Error loading data" : "No data available"}
                          </h1>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </section>
      </Container>
    </DashboardLayout>
  );
};
