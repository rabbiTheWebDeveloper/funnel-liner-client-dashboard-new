import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import { AreaChart, CartesianGrid, Area, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart/chart";
import styles from "../../global.module.css";
import { cls } from "../../lib/utils";
import { Tooltip } from "../../components/ui/tooltip/tooltip";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../App/reports/_reports";

const formatAmPm = data => {
  return data.map(item => {
    const period = item.hour < 12 ? "AM" : "PM";
    const hour = item.hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.
    return {
      hour: `${hour} ${period}`,
      count: item.count,
    };
  });
};

const findPeakHour = (data = []) => {
  // Find the item with the maximum count
  const peak = data.reduce(
    (max, item) => (item.count > max.count ? item : max),
    data[0]
  );

  // Format the hour to AM/PM
  const period = peak?.hour < 12 ? "AM" : "PM";
  const hour = peak?.hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.

  return {
    hour: `${hour} ${period}`,
    count: peak?.count,
  };
};
const formatDate = date => date.toISOString().split("T")[0];
const WebsiteTraffic = () => {
  const today = new Date();
  const past = new Date(today); // Create a copy of today
  past.setDate(today.getDate() - 6); // Set to 7 days ago
  const [dateRange, setDateRange] = useState({
    from: formatDate(past),
    to: formatDate(today),
  });
  const { data, error, mutate } = useSWR(
    "/client/visitors?type=website" +
      `&dataType=custome&startDate=${dateRange.from}&end_date=${dateRange.to}`,
    fetcher
  );
  // console.log("data website", data.data);
  const reportData = (Array.isArray(data?.data) && data?.data[0]) || {};
  const handlePeriodChange = (value, startDate, endDate) => {
    const today = new Date();
    const past = new Date(today);
    const formatDate = date => date?.toISOString().split("T")[0];

    if (value === "today") {
      setDateRange({ from: formatDate(today), to: formatDate(today) });
    } else if (value === "yesterday") {
      past.setDate(today.getDate() - 1);
      setDateRange({ from: formatDate(past), to: formatDate(past) });
    } else if (value === "weekly") {
      past.setDate(today.getDate() - 6);
      setDateRange({ from: formatDate(past), to: formatDate(today) });
    } else if (value === "monthly") {
      past.setDate(today.getDate() - 29);
      setDateRange({ from: formatDate(past), to: formatDate(today) });
    } else if (value === "custom" && startDate && endDate) {
      setDateRange({ from: formatDate(startDate), to: formatDate(endDate) });
    }
  };
  if (error) return;
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card className={styles.dashboard_card}>
        <CardHeader className={cls(styles.performance_card_header)}>
          <CardTitle>Website Traffic</CardTitle>
          <DateSelector
            placeholder="Today"
            showCalender
            defaultValue="today"
            onValueChange={handlePeriodChange}
          >
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
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
              visitors: {
                label: "Visitors",
                color: "hsl(var(--primary))",
              },
            }}
          >
            <AreaChart
              data={formatAmPm(reportData?.hourly_counts || [])}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
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
              />
              <Area
                dataKey="count"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            </AreaChart>
          </ChartContainer>
          <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={6}>
              <Box
                className={styles["flex-center"]}
                sx={{ gap: "0.25rem", height: "100%" }}
              >
                <Box
                  sx={{
                    height: "12px",
                    width: "12px",
                    borderRadius: "4px",
                    backgroundColor: "hsl(var(--primary))",
                  }}
                ></Box>
                <Tooltip title="Total Visitors" placement="top">
                  <h1 className={cls(styles.card_title, styles.truncate)}>
                    Total Visitors
                  </h1>
                </Tooltip>
                <div
                  className={cls(
                    styles["card-analytics"],
                    styles["flex-end"],
                    styles.growth,
                    styles.small
                  )}
                >
                  {/* <ArrowUp /> 45% */}
                  {reportData?.total_visitors}
                </div>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                className={styles["flex-center"]}
                sx={{ gap: "0.25rem", height: "100%" }}
              >
                <Tooltip
                  title={findPeakHour(reportData?.hourly_counts)?.hour}
                  placement="top"
                >
                  <h1 className={cls(styles.card_title, styles.truncate)}>
                    Peak Hour: {findPeakHour(reportData?.hourly_counts)?.hour}
                  </h1>
                </Tooltip>
                <div
                  className={cls(
                    styles["card-analytics"],
                    styles["flex-end"],
                    styles.growth,
                    styles.small
                  )}
                >
                  {findPeakHour(reportData?.hourly_counts).count} visitors
                </div>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: "auto",
            }}
          ></Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WebsiteTraffic;
