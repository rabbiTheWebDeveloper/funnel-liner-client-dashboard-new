import { Box, Grid } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardIcon,
} from "../components/ui/card/card";
import { DateSelector } from "../components/date-selector/DateSelector";
import { SelectItem } from "../components/ui/select/select";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import styles from "../global.module.css";
import { cls } from "../lib/utils";
import { fetcher } from "../App/reports/_reports";
import useSWR from "swr";
import { useState } from "react";

const baseUrl = `/client/analytics/sales`;
const formatDate = date => date.toISOString().split("T")[0];

export const SalesAnalyticsSection = () => {
  const today = new Date();
  const past = new Date(today); // Create a copy of today
  past.setDate(today.getDate() - 6); // Set to 7 days ago

  const [dateRange, setDateRange] = useState({
    from: formatDate(past),
    to: formatDate(today),
  });

  const { data, error, isLoading } = useSWR(
    baseUrl + `?from=${dateRange.from}&to=${dateRange.to}`,
    fetcher
  );

  const salesAnaly = data?.data || {};

  const handlePeriodChange = value => {
    console.log("Selected:", value);
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

  // Helper function to render growth indicator
  const renderGrowthIndicator = growth => {
    if (!growth || growth === "0%") {
      return (
        <div className={cls(styles["card-analytics"])}>
          <Minus /> 0%
        </div>
      );
    }

    const growthValue = parseFloat(growth);
    if (growthValue > 0) {
      return (
        <div className={cls(styles["card-analytics"], styles.growth)}>
          <ArrowUp /> {growth}
        </div>
      );
    } else {
      return (
        <div className={cls(styles["card-analytics"], styles.down)}>
          <ArrowDown /> {Math.abs(growthValue)}%
        </div>
      );
    }
  };

  // Safe value display
  const displayValue = (value, prefix = "") => {
    if (value === undefined || value === null) return `${prefix}0`;
    return `${prefix}${value}`;
  };

  if (error) {
    return (
      <section>
        <div className={styles.error}>
          Failed to load analytics data. Please try again.
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box
          className={cls(styles["flex-between"])}
          sx={{ gap: 1, width: "100%" }}
        >
          <h1>Sales Analytics</h1>
          <DateSelector
            placeholder="Last 7 Days"
            defaultValue="7d"
            onValueChange={handlePeriodChange}
          >
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </DateSelector>
        </Box>
      </div>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        {/* Average Store Views */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            className={cls(styles.dashboard_card, isLoading && styles.loading)}
          >
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Average Store Views Per Day
                  <CardIcon color="#e3f2fd">
                    <Eye size={20} color="#2196f3" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>
                  {isLoading
                    ? "..."
                    : displayValue(
                        salesAnaly?.average_store_views_per_day?.value
                      )}
                </h1>
                {renderGrowthIndicator(
                  salesAnaly?.average_store_views_per_day?.growth
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Orders */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            className={cls(styles.dashboard_card, isLoading && styles.loading)}
          >
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Average Orders Per Day
                  <CardIcon color="#e8f5e9">
                    <ShoppingCart size={20} color="#4caf50" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>
                  {isLoading
                    ? "..."
                    : displayValue(salesAnaly?.average_orders_per_day?.value)}
                </h1>
                {renderGrowthIndicator(
                  salesAnaly?.average_orders_per_day?.growth
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Order Value */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            className={cls(styles.dashboard_card, isLoading && styles.loading)}
          >
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Average Order Value
                  <CardIcon color="#fff3e0">
                    <DollarSign size={20} color="#ff9800" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>
                  {isLoading
                    ? "..."
                    : `৳ ${displayValue(
                        salesAnaly?.average_order_value?.value
                      )}`}
                </h1>
                {renderGrowthIndicator(salesAnaly?.average_order_value?.growth)}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Sales */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            className={cls(styles.dashboard_card, isLoading && styles.loading)}
          >
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Average Sales per Day
                  <CardIcon color="#fce4ec">
                    <TrendingUp size={20} color="#e91e63" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>
                  {isLoading
                    ? "..."
                    : `৳ ${displayValue(
                        salesAnaly?.average_sales_per_day?.value
                      )}`}
                </h1>
                {renderGrowthIndicator(
                  salesAnaly?.average_sales_per_day?.growth
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};
