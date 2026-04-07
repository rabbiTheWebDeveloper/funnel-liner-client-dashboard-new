import { Grid, Box } from "@mui/material";
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
  Minus,
  ArrowDown,
  ArrowUp,
  MessageSquare,
  CheckCircle,
  Truck,
  RotateCcw,
  Users,
  ClipboardList,
  History ,
  CheckSquare,
  Package,
  Clock,
  XCircle,
  Percent,
  Wallet,
} from "lucide-react";

import styles from "../global.module.css";
import { cls } from "../lib/utils";
import { useState, useEffect } from "react";
import axios from "axios";
import { headers } from "../../../pages/api/index";
const baseUrl = `/client/analytics`;
import { fetcher } from "../App/reports/_reports";
import useSWR from "swr";
import DailyAnalytics from "./DailyAnalytics";
import PaymentRequestSection from "./PaymentRequestSection";
const formatDate = date => date.toISOString().split("T")[0];
export const BusinessAnalyticsSection = ({ busInfo }) => {
  const today = new Date();
  const past = new Date(today); // Create a copy of today
  past.setDate(today.getDate() - 6); // Set to 7 days ago
  const [dateRange, setDateRange] = useState({
    from: formatDate(past),
    to: formatDate(today),
  });
  const [steadfastBalance, setSteadfastBalance] = useState(0);
  const { data, error, isLoading } = useSWR(
    baseUrl + `?from=${dateRange.from}&to=${dateRange.to}`,
    fetcher
  );

  const allData = data?.data || {};

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


  const handleFetchSteadfastBalance = async () => {
    try {
      let res = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/courier/courier-balance?provider=steadfast`,
        headers: headers,
      });
      if (res?.data?.data !== undefined) {
        setSteadfastBalance(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching steadfast balance:", err);
    }
  };

  useEffect(() => {
    handleFetchSteadfastBalance();
  }, []);
  const {
    order_status_analytics,
    business_analytics,
    traffic_order_analytics,
  } = allData;
  // console.log(order_status_analytics);
  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box
          className={cls(styles["flex-between"])}
          sx={{ gap: 1, width: "100%" }}
        >
          <h1>Business Analytics</h1>
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
        </Box>
      </div>

      {/* Rate Analysis Section */}
      <div className={styles.section_label}>Rate Analysis</div>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Conversation Rate
                  <CardIcon color="#e3f2fd">
                    <MessageSquare size={20} color="#2196f3" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Landing Page</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {business_analytics?.conversation_rate?.landing_page}
                  </h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Website</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {business_analytics?.conversation_rate?.website}
                  </h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Confirmation Rate
                  <CardIcon color="#e8f5e9">
                    <CheckCircle size={20} color="#4caf50" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based On Visitor</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {" "}
                    {business_analytics?.confirmation_rate?.based_on_visitor}
                  </h1>
                  <div className={cls(styles["card-analytics"], styles.down)}>
                    <ArrowDown />{" "}
                    {
                      business_analytics?.confirmation_rate
                        ?.growth_based_on_visitor
                    }
                  </div>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based on Order</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {business_analytics?.confirmation_rate?.based_on_order}
                  </h1>
                  <div className={cls(styles["card-analytics"], styles.growth)}>
                    <ArrowUp />{" "}
                    {
                      business_analytics?.confirmation_rate
                        ?.growth_based_on_order
                    }
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Delivery Rate
                  <CardIcon color="#fff3e0">
                    <Truck size={20} color="#ff9800" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based on Order</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {business_analytics?.delivery_rate?.based_on_order}
                  </h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>
                  Based on Confirmed Order
                </h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {
                      business_analytics?.delivery_rate
                        ?.based_on_confirmed_order
                    }
                  </h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Return Rate
                  <CardIcon color="#fce4ec">
                    <RotateCcw size={20} color="#e91e63" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based on Order</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {business_analytics?.return_rate?.based_on_order}
                  </h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>
                  Based on Confirmed Order
                </h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {business_analytics?.return_rate?.based_on_confirmed_order}
                  </h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Traffic & Orders Section */}
      <div className={styles.section_label}>Traffic & Orders</div>
      <Grid container spacing={2} sx={{ mt: 0 }}>

      <DailyAnalytics />
        <Grid item xs={12} sm={6} lg={2.4}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Visitor
                  <CardIcon color="#e1f5fe">
                    <Users size={20} color="#03a9f4" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>

            
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Landing Page</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {traffic_order_analytics?.visitors?.landing}
                  </h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Website</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {traffic_order_analytics?.visitors?.website}
                  </h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Total</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {traffic_order_analytics?.visitors?.total}
                  </h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        

        <Grid item xs={12} sm={6} lg={2.4}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Receive
                  <CardIcon color="#f3e5f5">
                    <ClipboardList size={20} color="#9c27b0" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Quantity</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {traffic_order_analytics?.order_received?.received}
                  </h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Amount</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    ৳ {traffic_order_analytics?.order_received?.received_amount}
                  </h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={2.4}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Confirm
                  <CardIcon color="#e8f5e9">
                    <CheckSquare size={20} color="#4caf50" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Quantity</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {traffic_order_analytics?.order_confirmed?.confirmed}
                  </h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Amount</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    ৳{" "}
                    {traffic_order_analytics?.order_confirmed?.confirmed_amount}
                  </h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={2.4}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Delivery
                  <CardIcon color="#fff3e0">
                    <Package size={20} color="#ff9800" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Quantity</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {traffic_order_analytics?.order_delivered?.delivered}
                  </h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Amount</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    ৳{" "}
                    {traffic_order_analytics?.order_delivered?.delivered_amount}
                  </h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Status Section */}
      <div className={styles.section_label}>Order Status</div>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={6} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Pending
                  <CardIcon color="#e8eaf6">
                    <Clock size={20} color="#3f51b5" />
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
                  {order_status_analytics?.pending}
                </h1>
                <div className={cls(styles["card-analytics"], styles.growth)}>
                  <ArrowUp /> {order_status_analytics?.pending_growth}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Cancel
                  <CardIcon color="#ffebee">
                    <XCircle size={20} color="#f44336" />
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
                  {order_status_analytics?.cancelled}
                </h1>
                <div className={cls(styles["card-analytics"])}>
                  <Minus />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Discount Amount
                  <CardIcon color="#ede7f6">
                    <Percent size={20} color="#673ab7" />
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
                  ৳ {order_status_analytics?.discount}
                </h1>
                <div className={cls(styles["card-analytics"], styles.growth)}>
                  <ArrowUp /> {order_status_analytics?.discount_growth}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Card
            className={styles.dashboard_card}
            style={{
              border: "1px solid #e0f2f1",
              boxShadow: "0 4px 12px rgba(0, 150, 136, 0.08)",
              background: "linear-gradient(135deg, #ffffff 0%, #f4fbf9 100%)",
            }}
          >
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  <span style={{ fontWeight: 600, color: "#009688" }}>
                    Steadfast Balance
                  </span>
                  <img
                    src="/images/steadfast.png"
                    alt="Steadfast Balance"
                    style={{ height: "32px", width: "auto", objectFit: "contain" }}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1
                  className={styles.card_value}
                  style={{
                    fontSize: "1.6rem",
                    color: "#009688",
                    fontWeight: "bold",
                  }}
                >
                  ৳ {steadfastBalance ? steadfastBalance : 0}
                </h1>
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#666",
                  marginTop: "6px",
                  fontWeight: 500,
                }}
              >
               
              </div>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </section>
  );
};
