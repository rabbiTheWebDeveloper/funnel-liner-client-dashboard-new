import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card/card";
import { DateSelector } from "../components/date-selector/DateSelector";
import { SelectItem } from "../components/ui/select/select";
import {
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart/chart";
import styles from "../global.module.css";
import { cls } from "../lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip } from "../components/ui/tooltip/tooltip";
import { Button } from "../components/ui/button/button";
import { RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { headers } from "../../../pages/api";
import SuperFetch from "../../../hook/Axios";
import OrderSource from "./salesPerformance/OrderSource";
import RealtimeVisitor from "./salesPerformance/RealtimeVisitor";
import LandingPageVisitor from "./salesPerformance/LandingPageVisitor";
import WebsiteTraffic from "./salesPerformance/WebsiteTraffic";

const MAX_DATA_POINTS = 50;

export const SalesPerformanceSection = () => {
  const [overview_data, setOverview_data] = useState("week");
  const [reportData, setReportData] = useState([]);

  const chart_data = {
    "chart-status": overview_data,
  };
  useEffect(() => {
    SuperFetch.post("/client/chart/statistics", chart_data, {
      headers: headers,
    })
      .then(res => {
        setReportData(res.data.data);
      })
      .catch(error => {});
  }, [overview_data]);

  // const [selectedValue, setSelectedValue] = useState("today");
  // const [customDateRange, setCustomDateRange] = useState({ startDate: null, endDate: null });

  const handleDateSelectorChange = (value, startDate, endDate) => {
    setOverview_data(value);
    // setCustomDateRange({ startDate, endDate });
  };

  // console.log("sdsd" , overview_data);

  return (
    <section>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader className={cls(styles.performance_card_header)}>
              <CardTitle>Sales Performance</CardTitle>
              <DateSelector
                placeholder="Today"
                defaultValue={overview_data}
                onValueChange={handleDateSelectorChange}
              >
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </DateSelector>
            </CardHeader>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <ChartContainer
                config={{
                  amount: {
                    label: "Amount",
                    color: "hsl(var(--primary))",
                  },
                }}
                style={{
                  height: "300px",
                }}
              >
                <AreaChart
                  data={reportData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 12,
                      fontFamily: "var(--font-inter)",
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fontFamily: "var(--font-inter)",
                    }}
                    width={30}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--foreground) / 0.2)"
                  />
                  <Area
                    strokeWidth={2}
                    dataKey="Amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={0.6}
                    fill="hsl(var(--primary))"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: "hsl(var(--primary))!important" }}
                  />
                </AreaChart>
              </ChartContainer>
              {/* <Box
                className={styles["flex-center"]}
                sx={{ gap: "0.25rem", mt: 1, height: "100%" }}
              >
                <Box
                  sx={{
                    height: "12px",
                    width: "12px",
                    borderRadius: "4px",
                    backgroundColor: "hsl(var(--primary))",
                  }}
                ></Box>
                <h1 className={styles.card_title}>Amount</h1>
                <div
                  className={cls(
                    styles["card-analytics"],
                    styles["flex-end"],
                    styles.growth,
                    styles.small
                  )}
                >
                  <ArrowUp /> 45%
                </div>
              </Box> */}
            </CardContent>
          </Card>
        </Grid>

        <OrderSource />

        {/* <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader className={cls(styles.performance_card_header)}>
              <CardTitle>Order Source</CardTitle>
              <DateSelector
                placeholder="Today"
                defaultValue="today"
                showCalender
              >
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last_7_days">Last 7 days</SelectItem>
                <SelectItem value="this_month">This month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </DateSelector>
            </CardHeader>
            <CardContent>
              <div className={styles.order_source_content}>
                <div className={styles.metrics_container}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {[
                      {
                        label: "Landing Page",
                        value: 7,
                        color: "hsl(var(--primary))",
                        percentage: "54%",
                      },
                      {
                        label: "Website",
                        value: 1,
                        color: "hsl(var(--chart-1))",
                        percentage: "8%",
                      },
                      {
                        label: "Phone Call",
                        value: 2,
                        color: "hsl(var(--chart-2))",
                        percentage: "15%",
                      },
                      {
                        label: "Social Media",
                        value: 3,
                        color: "hsl(var(--chart-4))",
                        percentage: "23%",
                      },
                    ].map(item => (
                      <Box className={styles["metric-item"]} key={item.label}>
                        <Box
                          className={styles["flex-center"]}
                          sx={{ gap: "0.5rem" }}
                        >
                          <Box
                            sx={{
                              height: "12px",
                              width: "12px",
                              borderRadius: "4px",
                              backgroundColor: item.color,
                            }}
                          />
                          <h1 className={styles.card_title}>{item.label}</h1>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span className={styles.metric_value}>
                            {item.value}
                          </span>
                          <span className={styles.metric_percentage}>
                            {item.percentage}
                          </span>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </div>
                <div className={styles.chart_container}>
                  <ChartContainer
                    config={{
                      order_source: {
                        label: "Order Source",
                      },
                      landing_page: {
                        label: "Landing Page",
                        color: "hsl(var(--primary))",
                      },
                      website: {
                        label: "Website",
                        color: "hsl(var(--chart-1))",
                      },
                      phone_call: {
                        label: "Phone Call",
                        color: "hsl(var(--chart-2))",
                      },
                      social_media: {
                        label: "Social Media",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    style={{
                      height: "300px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={200} height={200}>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={[
                            {
                              order_source: "landing_page",
                              value: 7,
                              fill: "hsl(var(--primary))",
                            },
                            {
                              order_source: "website",
                              value: 1,
                              fill: "hsl(var(--chart-1))",
                            },
                            {
                              order_source: "phone_call",
                              value: 2,
                              fill: "hsl(var(--chart-2))",
                            },
                            {
                              order_source: "social_media",
                              value: 3,
                              fill: "hsl(var(--chart-4))",
                            },
                          ]}
                          dataKey="value"
                          nameKey="order_source"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={100}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid> */}

        <RealtimeVisitor />

        <LandingPageVisitor />
        <WebsiteTraffic />

    
      </Grid>
    </section>
  );
};
