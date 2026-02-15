import { Box, Grid, Collapse } from "@mui/material";
import styles from "./styles.module.css";
import globalStyles from "../../global.module.css";
import { cls } from "../../lib/utils";
import { Button } from "../../components/ui/button/button";
import { Dialog } from "../../components/ui/dialog/dialog";
import { Input } from "../../components/ui/input/input";
import { Label } from "../../components/ui/label/label";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";
import { fetcher } from "./_reports";
import { API_ENDPOINTS } from "../../../../config/ApiEndpoints";
import useSWR, { mutate } from "swr";
import { headers } from "../../../../pages/api";
import axios from "axios";
import { useToast } from "../../../../hook/useToast";
const currentMonthName = new Date().toLocaleString("default", {
  month: "long",
});
const currentYear = new Date().getFullYear();
export const Settings = () => {
  const { data: fixtCost, error } = useSWR(`/client/fixed-cost/list`, fetcher, {
    revalidateOnFocus: false,
  });

    const showToast = useToast();
  const fixtCostData =
    fixtCost?.data?.find(
      item =>
        item.month === currentMonthName && Number(item.year) === currentYear
    ) || null;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newItem, setNewItem] = useState({ item: "", value: "" });
  const [formData, setFormData] = useState({
    rent: "",
    total_salary: "",
    utility_cost: "",
    petty_cash: "",
    depreciation_cost: "",
    other_cost: [],
  });

  useEffect(() => {
    if (fixtCostData) {
      setFormData({
        rent: fixtCostData?.rent || "",
        total_salary: fixtCostData?.total_salary || "",
        utility_cost: fixtCostData?.utility_cost || "",
        petty_cash: fixtCostData?.petty_cash || "",
        depreciation_cost: fixtCostData?.depreciation_cost || "",
        other_cost: fixtCostData?.other_cost
          ? JSON.parse(fixtCostData.other_cost)
          : [],
      });
    }
  }, [fixtCostData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewItemChange = e => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        other_cost: JSON.stringify(formData.other_cost),
      };

      const response = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/client/fixed-cost/store`,
        payload,
        { headers }
      );
    showToast('Settings saved successfully!', 'success');
      mutate(`${API_ENDPOINTS.BASE_URL}/client/fixed-cost/list`);
    } catch (error) {
      console.error("Save failed:", error);
      showToast("Failed to save settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    if (!newItem.item || !newItem.value) {
      showToast("Please enter both item name and value.", "warning");
      return;
    }

    setFormData(prev => ({
      ...prev,
      other_cost: [...prev.other_cost, { ...newItem }],
    }));
    setNewItem({ item: "", value: "" });
    setOpen(false);
  };

  const handleRemoveItem = index => {
    const newCosts = [...formData.other_cost];
    newCosts.splice(index, 1);
    setFormData(prev => ({ ...prev, other_cost: newCosts }));
  };

  if (error) return <div>Error loading settings.</div>;
  // if (!fixtCostData) return <div>Loading...</div>;

  return (
    <section>
      <div className={cls(globalStyles.header, globalStyles["flex"])}>
        <Box
          className={cls(globalStyles["flex-between"])}
          sx={{ gap: 1, width: "100%" }}
        >
          <h1>Settings</h1>
          <Button onClick={() => setOpen(true)}>Create New</Button>
        </Box>
      </div>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Fixed Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid container spacing={2}>
              {[
                {
                  label: "Rent",
                  name: "rent",
                  placeholder: "Enter rent amount",
                },
                {
                  label: "Total Payroll (Salary)",
                  name: "total_salary",
                  placeholder: "Enter total payroll",
                },
                {
                  label: "Utility Bill",
                  name: "utility_cost",
                  placeholder: "Enter utility bill",
                },
                {
                  label: "Petty Cash",
                  name: "petty_cash",
                  placeholder: "Enter petty cash",
                },
                {
                  label: "Depreciation Cost",
                  name: "depreciation_cost",
                  placeholder: "Enter depreciation cost",
                },
              ].map(field => (
                <Grid item xs={12} md={6} key={field.name}>
                  <div className={styles.inputGroup}>
                    <Label>{field.label}</Label>
                    <Input
                      type="number"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                    />
                  </div>
                </Grid>
              ))}

              {formData.other_cost.map((item, index) => (
                <Grid item xs={12} md={6} key={`${item.item}-${index}`}>
                  <Collapse in={true}>
                    <div
                      className={styles.inputGroup}
                      style={{ position: "relative" }}
                    >
                      <Label>{item.item}</Label>
                      <Input
                        type="number"
                        value={item.value}
                        onChange={e => {
                          const newCosts = [...formData.other_cost];
                          newCosts[index].value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            other_cost: newCosts,
                          }));
                        }}
                        placeholder={`Enter ${item.item.toLowerCase()}`}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        style={{ position: "absolute", top: 0, right: 0 }}
                      >
                        ❌
                      </Button>
                    </div>
                  </Collapse>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Fixed Cost History</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f3f4f6",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Month
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Year
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Rent
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Salary
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Utility
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Petty Cash
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Depreciation
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Other Cost
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fixtCost?.data?.map((item, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #eee",
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
                        transition: "background-color 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = "#f3f4f6")
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor =
                          i % 2 === 0 ? "#fff" : "#f9fafb")
                      }
                    >
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.month}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.year}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.rent}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.total_salary}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.utility_cost}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.petty_cash}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.depreciation_cost}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {JSON.parse(item.other_cost || "[]").length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: "15px" }}>
                            {JSON.parse(item.other_cost).map((oc, j) => (
                              <li key={j}>
                                {oc.item}: {oc.value}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          border: "1px solid #ddd",
                          fontWeight: "600",
                          color: "#047857", // green-700
                        }}
                      >
                        {item.total_sum}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className={styles.dialogContent}>
          <h2>Create New Item</h2>
          <div className={styles.inputGroup}>
            <Label>Item Name</Label>
            <Input
              name="item"
              value={newItem.item}
              onChange={handleNewItemChange}
              placeholder="Enter item name"
            />
          </div>
          <div className={styles.inputGroup}>
            <Label>Value</Label>
            <Input
              type="number"
              name="value"
              value={newItem.value}
              onChange={handleNewItemChange}
              placeholder="Enter value"
            />
          </div>
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button onClick={handleCreateNew}>Create</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Box>
        </div>
      </Dialog>
    </section>
  );
};
