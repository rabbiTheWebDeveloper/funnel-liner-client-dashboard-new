import { Grid } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";
import {
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart/chart"; // Ensure this is the correct path
import styles from "../../global.module.css";
import { cls } from "../../lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../../components/ui/button/button";
import { RefreshCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { visitorUrl } from "../../../../constant/constant";
import { shopId } from "../../../../pages/api";

const MAX_DATA_POINTS = 20;

const RealtimeVisitor = () => {
  const [onlineVisitors, setOnlineVisitors] = useState(0);
  const [realtimeData, setRealtimeData] = useState(() => {
    const initialData = Array.from({ length: MAX_DATA_POINTS }, (_, i) => ({
      time: `${i}:00`,
      visitors: onlineVisitors,
    }));
    return initialData;
  });
  const [growth, setGrowth] = useState(0);

  // Fetch data for the chart
  const fetchRealtimeData = useCallback(() => {
    setRealtimeData(prevData => {
      const newVisitors = onlineVisitors;
      const lastVisitors = prevData[prevData.length - 1]?.visitors || 1;
      const growthPercent = ((newVisitors - lastVisitors) / lastVisitors) * 100;
      setGrowth(Math.round(growthPercent));

      const nextHour = parseInt(prevData[prevData.length - 1]?.time || 0) + 1;
      const newData = [
        ...prevData.slice(1),
        { time: `${nextHour}:00`, visitors: newVisitors },
      ];

      return newData;
    });
  }, [onlineVisitors]);

  // Fetch online visitor data from the API
  const fetchVisitorData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${visitorUrl}shop-current-visit/active-users/${shopId}`
      );
      const { data } = response.data;
      setOnlineVisitors(data?.currentVisitors ?? 0);
    } catch (error) {
      console.error("Error fetching visitor data:", error);
      setOnlineVisitors(0);
    }
  }, []);

  // Update data at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      fetchVisitorData();
      fetchRealtimeData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchRealtimeData, fetchVisitorData]);

  // console.log(`realtimeData`, onlineVisitors);
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card className={styles.dashboard_card}>
        <CardHeader className={cls(styles.performance_card_header)}>
          <CardTitle>Realtime Visitors</CardTitle>
          <Button
            variant="outline"
            size="icon"
            className={cls(styles.small_button, "box-shadow-none")}
            onClick={fetchVisitorData}
          >
            <RefreshCcw size={14} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className={styles["flex-between"]}>
            <h1 className={styles.card_value}>
              {realtimeData[realtimeData.length - 1]?.visitors}
            </h1>
            <div
              className={cls(
                styles["card-analytics"],
                growth >= 0 ? styles.growth : styles.down
              )}
            >
              {growth >= 0 ? <ArrowUp /> : <ArrowDown />} {Math.abs(growth)}%
            </div>
          </div>

          {/* Wrap chart with ChartContainer */}
          <ChartContainer
            config={{
              visitors: {
                label: "Active Visitors",
                color: "hsl(var(--primary))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={realtimeData}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis hide dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <Area
                  dataKey="visitors"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  isAnimationActive={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RealtimeVisitor;
