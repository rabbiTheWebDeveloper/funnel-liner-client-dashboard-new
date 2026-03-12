import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart/chart";
import styles from "../../global.module.css";
import { cls } from "../../lib/utils";
import { useState, useMemo } from "react";
import { API_ENDPOINTS } from "../../../../config/ApiEndpoints";
import { fetcher } from "../../App/reports/_reports";
import useSWR from "swr";
import { formatDate } from "../../../../constant/dashbord"; // ✅ must return "10/07/2025, 12:00:00 AM"

// ✅ color mapping for consistent color scheme
const colorMapping = {
  Landing: "hsl(var(--primary))",
  Website: "hsl(var(--chart-1))",
  Phone: "hsl(var(--chart-2))",
  Social: "hsl(var(--chart-4))",
  Others: "hsl(var(--chart-5))",
  Woocommerce: "hsl(var(--chart-6))",
};

const OrderSource = () => {
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - 1);

  const [dateRange, setDateRange] = useState({
    from: formatDate(past),
    to: formatDate(today),
  });

  // ✅ fetch API data
  const { data, error } = useSWR(
    `${API_ENDPOINTS.DASHBOARD.PIH_CHART}?channel_status=custom&start_date=${encodeURIComponent(
      dateRange.from
    )}&end_date=${encodeURIComponent(dateRange.to)}`,
    fetcher
  );

  const orderSource = data?.data || [];

  // ✅ Calculate total and percentage
  const totalValue = useMemo(
    () => orderSource.reduce((sum, item) => sum + item.value, 0),
    [orderSource]
  );

  // ✅ Prepare metric + chart data dynamically
  const metricData = orderSource.map((item) => {
    const percentage =
      totalValue > 0
        ? ((item.value / totalValue) * 100).toFixed(1) + "%"
        : "0%";
    return {
      label: item.name,
      value: item.value,
      color: colorMapping[item.name] || "hsl(var(--muted))",
      percentage,
    };
  });

  const chartData = orderSource.map((item) => ({
    order_source: item.name.toLowerCase().replace(" ", "_"),
    value: item.value,
    fill: colorMapping[item.name] || "hsl(var(--muted))",
  }));

  // ✅ Handle period change
  const handlePeriodChange = (value, startDate, endDate) => {
    const now = new Date();
    const past = new Date(now);

    if (value === "today") {
      setDateRange({ from: formatDate(now), to: formatDate(now) });
    } else if (value === "yesterday") {
      past.setDate(now.getDate() - 1);
      setDateRange({ from: formatDate(past), to: formatDate(past) });
    } else if (value === "7d" || value === "weekly") {
      past.setDate(now.getDate() - 6);
      setDateRange({ from: formatDate(past), to: formatDate(now) });
    } else if (value === "30d" || value === "monthly") {
      past.setDate(now.getDate() - 29);
      setDateRange({ from: formatDate(past), to: formatDate(now) });
    } else if (value === "custom" && startDate && endDate) {
      setDateRange({
        from: formatDate(startDate),
        to: formatDate(endDate),
      });
    }
  };

  return (
    <Grid item xs={12} sm={6} lg={6}>
      <Card className={styles.dashboard_card}>
        <CardHeader className={cls(styles.performance_card_header)}>
          <CardTitle>Order Source</CardTitle>

          {/* ✅ Date Selector */}
          <DateSelector
            placeholder="Today"
            defaultValue="yesterday"
            showCalender
            onValueChange={handlePeriodChange}
          >
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </DateSelector>
        </CardHeader>

        <CardContent>
          <div className={styles.order_source_content}>
            {/* ✅ Left: Dynamic metrics */}
            <div className={styles.metrics_container}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {metricData.length > 0 ? (
                  metricData.map((item) => (
                    <Box className={styles["metric-item"]} key={item.label}>
                      <Box className={styles["flex-center"]} sx={{ gap: "0.5rem" }}>
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className={styles.metric_value}>{item.value}</span>
                        <span className={styles.metric_percentage}>{item.percentage}</span>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <p>No data available</p>
                )}
              </Box>
            </div>

            {/* ✅ Right: Dynamic chart */}
            <div className={styles.chart_container}>
              <ChartContainer
                config={{
                  order_source: { label: "Order Source" },
                  ...Object.fromEntries(
                    Object.keys(colorMapping).map((key) => [
                      key.toLowerCase(),
                      { label: key, color: colorMapping[key] },
                    ])
                  ),
                }}
                style={{ height: "300px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={200} height={200}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
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
    </Grid>
  );
};

export default OrderSource;
