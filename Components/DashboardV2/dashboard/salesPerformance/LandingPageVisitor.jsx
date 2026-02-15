import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import { CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart/chart";
import styles from "../../global.module.css";
import { cls } from "../../lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip } from "../../components/ui/tooltip/tooltip";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../App/reports/_reports";
import { formatDate } from "../../../../constant/dashbord";

const LandingPageVisitor = () => {
  const today = new Date();
  const past = new Date(today); // Create a copy of today
  past.setDate(today.getDate() - 6); // Set to 7 days ago
  const [dateRange, setDateRange] = useState({
    from: formatDate(past),
    to: formatDate(today),
  });
  const { data, error, mutate } = useSWR(
    "/client/visitors/get_counts?type=landing" +
      `&dataType=custom&startDate=${dateRange.from}&end_date=${dateRange.to}`,
    fetcher
  );
  const reportData = data?.data || [];
  const handlePeriodChange = (value, startDate, endDate) => {
    const today = new Date();
    const past = new Date(today);
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
  // console.log("reportData", reportData);
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card className={styles.dashboard_card}>
        <CardHeader className={cls(styles.performance_card_header)}>
          <CardTitle>Landing Page Visitors</CardTitle>
          <DateSelector
            placeholder="Today"
            defaultValue="today"
            showCalender
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
            <BarChart
              data={reportData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="landingPageSlug"
                tick={{
                  fontSize: 12,
                  fontFamily: "var(--font-inter)",
                }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{
                  fontSize: 12,
                  fontFamily: "var(--font-inter)",
                }}
              />
              <Bar
                dataKey="total_visitors"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
          <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
            {/* {Array.isArray(reportData)  &&
              reportData?.map((item) => (
                <Grid item xs={6} key={item.id}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: "hsl(var(--primary))",
                      }}
                    ></Box>
                    <Tooltip title={item.landingPageSlug} placement="top">
                      <h1 className={cls(styles.card_title, styles.truncate)}>
                        {item.landingPageSlug}
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
                      <ArrowUp /> {item.total_visitors}%
                    </div>
                  </Box>
                </Grid>
              ))} */}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LandingPageVisitor;
