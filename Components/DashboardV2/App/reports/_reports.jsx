import { Box } from "@mui/material";
import { cls } from "../../lib/utils";
import globalStyles from "../../global.module.css";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import { Card, CardContent } from "../../components/ui/card/card";
import { Input } from "../../components/ui/input/input";
import { Dialog } from "../../components/ui/dialog/dialog";
import { Textarea } from "../../components/ui/textarea/textarea";
import { Button } from "../../components/ui/button/button";
import { useState } from "react";
import { FileDown, Printer } from "lucide-react";
import { Tooltip } from "../../components/ui/tooltip/tooltip";
import { Badge } from "../../components/ui/badge/badge";
import styles from "./styles.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu/dropdown-menu";
import useSWR from "swr";
import { headers } from "../../../../pages/api";
import { API_ENDPOINTS } from "../../../../config/ApiEndpoints";
import axios from "axios";
import { useToast } from "../../../../hook/useToast";
const baseUrl = `/client/product-profit-calculation/report`;
export const fetcher = async url => {
  const res = await fetch(`${API_ENDPOINTS.BASE_URL + url}`, {
    method: "GET",
    headers: headers,
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const formatDate = date => date.toISOString().split("T")[0];
export const ReportTabs = () => {
    const showToast = useToast();
  const today = new Date();
  const past = new Date(today); // Create a copy of today
  past.setDate(today.getDate() - 6); // Set to 7 days ago
  const [dateRange, setDateRange] = useState({
    from: formatDate(past),
    to: formatDate(today),
  });
  const { data, error, mutate } = useSWR(
    baseUrl +
      `?range=custom&start_date=${dateRange.from}&end_date=${dateRange.to}`,
    fetcher
  );
  const [noteDialog, setNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState({
    product_id: null,
    date: "",
    notes: "",
  });
  const [rowValues, setRowValues] = useState({});

  const getRowId = row => `${row?.product_id}-${row?.date}`;

  const handleValueChange = (row, field, value) => {
    const rowId = getRowId(row);
    setRowValues(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const getValue = (row, field, originalValue) => {
    const rowId = getRowId(row);
    return rowValues[rowId]?.[field] ?? originalValue;
  };

  const handleAdSpendSave = async row => {
    const rowId = getRowId(row);
    try {
      const payload = {
        product_id: row.product_id,
        date: row.date,
        ad_spend: getValue(row, "adSpend", row.adSpend || 0),
      };

      const res = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/client/product-profit-calculation/add_notes`,
        payload,
        { headers }
      );
      console.log(res);
     showToast('Ad Spend saved successfully!', 'success');
      mutate(
        baseUrl +
          `?range=custom&start_date=${dateRange.from}&end_date=${dateRange.to}`
      );
    } catch (error) {
      console.error("Ad Spend save failed:", error);
      showToast('Failed to save Ad Spend.', 'error');
    }
  };

  const reportData = data?.data || [];
  const handlePeriodChange = value => {
    const today = new Date();
    const past = new Date(today);
    if (value === "7d") {
      past.setDate(today.getDate() - 6);
      setDateRange({
        from: formatDate(past),
        to: formatDate(today),
      });
    } else if (value === "30d") {
      past.setDate(today.getDate() - 29);
      setDateRange({
        from: formatDate(past),
        to: formatDate(today),
      });
    }
  };

  const handleNoteClick = (product_id, date, notes) => {
    setSelectedNote({ product_id, date, notes });
    setNoteDialog(true);
  };
  const handleNoteSave = async () => {
    try {
      const payload = {
        ...selectedNote,
      };
      const response = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/client/product-profit-calculation/add_notes`,
        payload,
        { headers }
      );

      showToast('Note saved successfully!', 'success');
      mutate(`${API_ENDPOINTS.BASE_URL + baseUrl}`);
    } catch (error) {
      console.error("Save failed:", error);
      showToast('Failed to save settings.', 'error');
    } finally {
      // setLoading(false);
      setNoteDialog(true);
    }
  };

  const calculateProfit = (confirmedAmount, fixedCost, adSpend) => {
    const totalCost = Number(fixedCost) + Number(adSpend);
    const profitAmount = Number(confirmedAmount) - totalCost;
    const profitPercentage =
      totalCost > 0 ? ((profitAmount / totalCost) * 100).toFixed(2) : 0;

    return {
      amount: profitAmount,
      percent: profitPercentage,
    };
  };

  const exportToExcel = () => {
    const exportData = reportData.map(row => ({
      Date: row.date,
      "Product ID": row.product_id,
      "Product Name": row.product_name,
      "Receive Order Quantity": row.receiveQty,
      "Receive Order Amount": row.receiveAmount,
      "Confirmed Order Quantity": row.confirmQty,
      "Confirmed Order Amount": row.confirmAmount,
      "Product Cost": row.productCost,
      "Fixed Cost": getValue(row.id, "fixedCost", row.fixedCost),
      "Ad Spend": getValue(row.id, "adSpend", row.adSpend),
      Return: row.returnAmount || 0,
      "Profit %": calculateProfit(
        row.confirmAmount,
        getValue(row.id, "fixedCost", row.fixedCost),
        getValue(row.id, "adSpend", row.adSpend)
      ).percent,
      "Profit Amount": calculateProfit(
        row.confirmAmount,
        getValue(row.id, "fixedCost", row.fixedCost),
        getValue(row.id, "adSpend", row.adSpend)
      ).amount,
      Note: row.note || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profit Reports");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "profit_reports.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");

    const tableData = reportData.map(row => [
      row.date,
      row.productName,
      `Qt: ${row.receiveOrder.qt}\nAmount: ${row.receiveOrder.amount}`,
      `Qt: ${row.confirmedOrder.qt}\nAmount: ${row.confirmedOrder.amount}`,
      `BDT ${row.productCost}`,
      `BDT ${getValue(row.id, "fixedCost", row.fixedCost)}`,
      `BDT ${getValue(row.id, "adSpend", row.adSpend)}`,
      `BDT ${row.return}`,
      `${
        calculateProfit(
          row.confirmedOrder.amount,
          getValue(row.id, "fixedCost", row.fixedCost),
          getValue(row.id, "adSpend", row.adSpend)
        ).percent
      }%\nBDT ${
        calculateProfit(
          row.confirmedOrder.amount,
          getValue(row.id, "fixedCost", row.fixedCost),
          getValue(row.id, "adSpend", row.adSpend)
        ).amount
      }`,
      row.note,
    ]);

    autoTable(doc, {
      head: [
        [
          "Date",
          "Product Name",
          "Receive Order",
          "Confirmed Order",
          "Product Cost",
          "Fixed Cost",
          "Ad Spend",
          "Return",
          "Profit",
          "Note",
        ],
      ],
      body: tableData,
      theme: "plain",
      styles: {
        fontSize: 8,
        cellPadding: 4,
        font: "helvetica",
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 100 },
        2: { cellWidth: 70 },
        3: { cellWidth: 70 },
        4: { cellWidth: 60 },
        5: { cellWidth: 60 },
        6: { cellWidth: 60 },
        7: { cellWidth: 60 },
        8: { cellWidth: 70 },
        9: { cellWidth: 100 },
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: 80,
        fontSize: 8,
        fontStyle: "bold",
        font: "helvetica",
        halign: "left",
        cellPadding: 4,
      },
      didDrawPage: function (data) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Profit Reports", data.settings.margin.left, 30);
      },
      didDrawCell: function (data) {
        if (data.cell.section === "body") {
          const { x, y, width, height } = data.cell;
          doc.setDrawColor(200, 200, 200);
          doc.line(x, y + height, x + width, y + height);
        }
      },
    });

    doc.save("profit_reports.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  if (error) return <div>Failed to load reports.</div>;
  if (!reportData) return <div>Loading...</div>;

  return (
    <section>
      <div className={cls(globalStyles.header, globalStyles["flex"])}>
        <Box
          className={cls(globalStyles["flex-between"])}
          sx={{ gap: 1, width: "100%" }}
        >
          <h1>Profit Reports</h1>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
              placeholder="Last 7 Days"
              defaultValue="7d"
              // showCalender

              onValueChange={handlePeriodChange}
            >
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>

              {/* <SelectItem value="custom">Custom</SelectItem> */}
            </DateSelector>
          </Box>
        </Box>
      </div>

      {/* Display current filter info */}
      {dateRange.start_date && dateRange.end_date && (
        <Box
          sx={{
            mb: 2,
            p: 1,
            backgroundColor: "hsl(var(--muted))",
            borderRadius: 1,
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Showing data from {dateRange.start_date} to {dateRange.end_date}
          </span>
        </Box>
      )}

      <Card className={globalStyles.dashboard_card}>
        <CardContent>
          <Box sx={{ overflow: "auto" }}>
            <table
              className={cls(
                globalStyles.card_table,
                globalStyles.table_highlight,
                "profit-report-table"
              )}
            >
              {/* ... rest of your table code remains the same ... */}
              <thead>
                <tr
                  className={cls(
                    globalStyles.card_table_item,
                    globalStyles.card_table_header
                  )}
                >
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Date</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Product Name</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Receive Order</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Confirmed Order</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Product Cost</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Fixed Cost</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Ad Spend</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Return</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Profit</h1>
                  </th>
                  <th
                    className={cls(
                      globalStyles.card_table_cell,
                      globalStyles.right
                    )}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Note</h1>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(row => (
                  <tr key={row.id} className={globalStyles.card_table_item}>
                    <td>
                      <h1
                        className={cls(
                          globalStyles.card_title,
                          globalStyles.truncate_alt
                        )}
                        style={{
                          paddingRight: "1rem",
                        }}
                      >
                        {row.date}
                      </h1>
                    </td>
                    <td>
                      <Tooltip
                        title={row.product_name}
                        placement="top"
                        className={styles.tooltipHidden}
                      >
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles.truncate,
                            "pdf-full-text"
                          )}
                        >
                          {row.product_name}
                        </h1>
                      </Tooltip>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Qt:
                          </span>
                          {row.receiveQty}
                        </h1>
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                            paddingRight: "1.5rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Amount:
                          </span>
                          {row.receiveAmount}
                        </h1>
                      </Box>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Qt:
                          </span>
                          {row.confirmQty}
                        </h1>
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                            paddingRight: "1.5rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Amount:
                          </span>
                          {row.confirmAmount}
                        </h1>
                      </Box>
                    </td>
                    <td>
                      <h1
                        className={globalStyles.card_title}
                        style={{
                          paddingRight: "1.5rem",
                        }}
                      >
                        BDT {row.productCost}
                      </h1>
                    </td>
                    <td>
                      {/* <Box
                        sx={{
                          display: "flex",
                          padding: ".5rem 0",
                          paddingRight: "1.5rem",
                        }}
                      >
                        <Input
                          type="number"
                          value={getValue(row.id, "fixedCost", row.fixedCost)}
                          onChange={e =>
                            handleValueChange(
                              row.id,
                              "fixedCost",
                              e.target.value
                            )
                          }
                          size="sm"
                          style={{
                            paddingRight: "1.5rem",
                            width: "6rem",
                          }}
                        />
                      </Box> */}
                      <h1
                        className={globalStyles.card_title}
                        style={{
                          paddingRight: "1.5rem",
                        }}
                      >
                        BDT {row?.fixedCost}
                      </h1>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Input
                          type="number"
                          size="sm"
                          value={getValue(row, "adSpend", row.adSpend)}
                          onChange={e =>
                            handleValueChange(row, "adSpend", e.target.value)
                          }
                          style={{ width: "6rem" }}
                        />
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "hsl(var(--primary))",
                          }}
                          variant="outlined"
                          onClick={() => handleAdSpendSave(row)}
                        >
                          Save
                        </Button>
                      </Box>
                    </td>

                    <td>
                      <h1
                        className={globalStyles.card_title}
                        style={{
                          paddingRight: "4.5rem",
                        }}
                      >
                        BDT {row.returnAmount}
                      </h1>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                          padding: ".65rem 0",
                          paddingRight: "1.5rem",
                          justifyContent: "center",
                        }}
                      >
                        <div>
                          <Badge>
                            %
                            {
                              calculateProfit(
                                row?.confirmAmount,
                                getValue(row.id, "fixedCost", row.fixedCost),
                                getValue(row.id, "adSpend", row.adSpend)
                              ).percent
                            }
                          </Badge>
                        </div>
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            color: "hsl(var(--primary))",
                          }}
                        >
                          BDT
                          {
                            calculateProfit(
                              row?.confirmAmount,
                              getValue(row.id, "fixedCost", row.fixedCost),
                              getValue(row.id, "adSpend", row.adSpend)
                            ).amount
                          }
                        </h1>
                      </Box>
                    </td>
                    <td
                      className={cls(
                        globalStyles.right,
                        globalStyles.card_table_cell
                      )}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="note-button"
                        style={{
                          boxShadow: "none",
                        }}
                        onClick={() =>
                          handleNoteClick(row.product_id, row.date, row?.note)
                        }
                      >
                        Note
                      </Button>
                      <span
                        className="note-text"
                        style={{
                          display: "none",
                          whiteSpace: "normal",
                          maxWidth: "200px",
                          textAlign: "left",
                        }}
                      >
                        {row?.notes}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={noteDialog} onClose={() => setNoteDialog(false)}>
        <div className={styles.dialogContent}>
          <h2>Add Note</h2>
          <Textarea
            value={selectedNote.notes}
            onChange={e =>
              setSelectedNote(prev => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Enter your note here..."
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button onClick={handleNoteSave}>Save</Button>
            <Button
              variant="outline"
              onClick={() => setNoteDialog(false)}
              className={globalStyles["box-shadow-none"]}
            >
              Cancel
            </Button>
          </Box>
        </div>
      </Dialog>
    </section>
  );
};
