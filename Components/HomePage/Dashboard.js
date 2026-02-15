import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Channel from "./Channel";
import ChartJs from "./ChartJs";
import HomePageCart from "./HomePageCart/HomePageCart";
import WebsiteLink from "./WebsiteLink";
// Cart Img
import axios from "axios";
import { headers } from "../../pages/api";
import cartImg11 from "../../public/images/homepage-icon/11.png";
import cartImg2 from "../../public/images/homepage-icon/2.png";
import cartImg3 from "../../public/images/homepage-icon/3.png";
import cartImg4 from "../../public/images/homepage-icon/4.png";
import cartImg5 from "../../public/images/homepage-icon/5.png";
import cartImg6 from "../../public/images/homepage-icon/6.png";
import cartImg7 from "../../public/images/homepage-icon/7.png";
import cartImg8 from "../../public/images/homepage-icon/8.png";
import cartImg9 from "../../public/images/homepage-icon/9.png";
import { filterOrder } from "./HomeUtlis";
import RecentOrder from "./RecentOrder";
import TopSellingProducts from "./TopSellingProducts";
import SalesTarget from "./SalesTarget";
import { useCallback } from "react";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import VisitorCart from "./HomePageCart/VisitorCart";
import VisitorStats from "./HomePageCart/VisitorCart";
function formatDateToBST(date) {
  return date?.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
}

const Dashboard = ({ busInfo }) => {
  const [date, setTotalOrderDate] = useState("today");
  const [confirmed_date, setTotalConfirmedDate] = useState("today");
  const [sales_date, setTotalSalesDate] = useState("today");
  const [pending_date, setPending_date] = useState("today");
  const [cancel_date, setCancel_date] = useState("today");
  const [discount_date, setDiscount_date] = useState("today");
  const [advance_date, setAdvance_date] = useState("today");
  const [reportData, setReportData] = useState({});
  const [ratioData, setRatioData] = useState({});
  const [salesTarget, setSalesTarget] = useState({});
  const [fatch, setfatch] = useState(false);
  const [advancedPaymentConfig, setAdvancedPaymentConfig] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateReport, setDateReport] = useState("today");
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);
  // , month, year
  const orderStatic = useCallback(async () => {
    const startDateWithOneDayAdded = formatDateToBST(startDate);
    const endDateWithOneDayAdded = formatDateToBST(endDate);
    const params = {
      date: date,
      start_date: startDateWithOneDayAdded,
      end_date: endDateWithOneDayAdded,
      confirmed_date: confirmed_date,
      sales_date: sales_date,
      pending_date: pending_date,
      cancel_date: cancel_date,
      discount_payment: discount_date,
      advance_payment: advance_date,
    };
    if (
      date !== "custom" && startDate !== null && endDate !== null ||
      confirmed_date === "custom" && startDate !== null && endDate !== null ||
      sales_date === "custom" && startDate !== null && endDate !== null ||
      pending_date === "custom" && startDate !== null && endDate !== null ||
      cancel_date === "custom" && startDate !== null && endDate !== null ||
      discount_date === "custom" && startDate !== null && endDate !== null ||
      advance_date === "custom" && startDate !== null && endDate !== null
    ) {
      try {
        let dataRes = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.ORDERS_STATIC}`,
          headers: headers,
          params,
        });
        if (dataRes?.data?.success) {
          setReportData(dataRes.data.data);
        }
      } catch (err) {
        // Handle the error here
      }

    }
    else if (
      date === "today" || "yesterday" || "weekly" || "monthly" ||
      confirmed_date === "today" || "yesterday" || "weekly" || "monthly" ||
      sales_date === "today" || "yesterday" || "weekly" || "monthly" ||
      pending_date === "today" || "yesterday" || "weekly" || "monthly" ||
      cancel_date === "today" || "yesterday" || "weekly" || "monthly" ||
      discount_date === "today" || "yesterday" || "weekly" || "monthly" ||
      advance_date === "today" || "yesterday" || "weekly" || "monthly"
    ) {
      try {
        let dataRes = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.ORDERS_STATIC}`,
          headers: headers,
          params,
        });
        if (dataRes?.data?.success) {
          setReportData(dataRes.data.data);
        }
      } catch (err) {
        // Handle the error here
      }

    }


  }, [
    date,
    confirmed_date,
    sales_date,
    advance_date,
    discount_date,
    pending_date,
    cancel_date,
    startDate && endDate
  ]);


  const handelFactchRatioStatic = useCallback(async () => {
    const params = {
      total: date,
      confirm: confirmed_date,
      sales_amount: sales_date,
      cancel: cancel_date,
      discount_amount: discount_date,
      advance_amount: advance_date,
    }
    if (
      date !== "custom" ||
      confirmed_date !== "custom" ||
      sales_date !== "custom" ||
      pending_date !== "custom" ||
      cancel_date !== "custom" ||
      discount_date !== "custom" ||
      advance_date !== "custom") {
      try {
        setLoading(true);
        let dataRes = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.RATIO_STATISTICS}`,
          headers: headers,
          params,
        });
        if (dataRes?.data?.success) {
          setRatioData(dataRes?.data?.data);;
        }
      } catch (err) {
        // Handle the error here
      }finally {
        setLoading(false);
      }

    }

  }, [
    date,
    confirmed_date,
    sales_date,
    cancel_date,
    discount_date,
    advance_date,
  ]);


  const handleFetchDeliveryReport = useCallback(async () => {
    const params = {
      date: dateReport,
      start_date: startDate,
      end_date: endDate
    }
    try {
      if (
        dateReport === "custom" &&
        startDate !== null &&
        endDate !== null
      ) {
        let dataRes = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.ORDER_DELIVERY_REPORT}`,
          headers: headers,
          params,
        });
        if (dataRes?.data?.success) {
          setReport(dataRes?.data?.data)
        }
      } else if (
        dateReport === "today" ||
        dateReport === "yesterday" ||
        dateReport === "weekly" ||
        dateReport === "monthly" ||
        dateReport === "all"
      ){
        let dataRes = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.ORDER_DELIVERY_REPORT}`,
          headers: headers,
          params,
        });
        if (dataRes?.data?.success) {
          setReport(dataRes?.data?.data)
        }

      }

    } catch (err) {
      // Handle the error here
    }
  }, [
    dateReport ,startDate,endDate
  ]);


  const handleFetchSellsTarget = useCallback(async () => {
    const params = {
      date: dateReport,
    }
    try {
      let dataRes = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.SALES_TARGET}`,
        headers: headers,
        params,
      });
      if (dataRes?.data?.success) {
        setSalesTarget(dataRes?.data?.data);
      }
    } catch (err) {
      // Handle the error here
    }
    setfatch(false);
  }, [
    fatch
  ]);

  const salesTargetRfatch = () => {
    setfatch(true);
  };

  const handleFetchAdvancePaymentStatus = useCallback(async () => {
    const params = {
      date: dateReport,
    }
    try {
      let dataRes = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.ORDER_ADVANCE_PAYMENT_CONFIG}`,
        headers: headers,
        params,
      });
      if (dataRes?.data?.success) {
        setAdvancedPaymentConfig(dataRes?.data?.data?.advanced_payment);
      }
    } catch (err) {
      // Handle the error here
    }
  }, []);
  useEffect(() => {
    handelFactchRatioStatic();
    orderStatic();
  }, [orderStatic, handelFactchRatioStatic]);

  useEffect(() => {
    handleFetchDeliveryReport()
  }, [handleFetchDeliveryReport])

  useEffect(() => {
    handleFetchSellsTarget();
  }, [handleFetchSellsTarget]);

  useEffect(() => {
    handleFetchAdvancePaymentStatus();
  }, [handleFetchAdvancePaymentStatus]);

  return (
    <section className="WebsiteLink">
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WebsiteLink busInfo={busInfo}
            currentDashboard="old"
             />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <ChartJs />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <Channel />
          </Grid>

          {/* Total Visitor */}
          <Grid item xs={12} sm={6} md={4}>
            <VisitorStats
              title="Total Visitor"
              increase="increase"
              filter={true}
              number="00"
              cartIcon="flaticon-trending"
              increaseTitle="+65% (30 days)"
              // cartImg={cartImg1}
            />
          </Grid>

          {/* Total Order */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
            loading={loading}
              setEndDate={setEndDate}
              endDate={endDate}
              setStartDate={setStartDate}
              startDate={startDate}
              data={date}
              setFetchData={setTotalOrderDate}
              title="Total Order"
              increase={
                ratioData?.total_order_ratio?.startsWith("-") === false
                  ? "increase"
                  : "decrease"
              }
              number={reportData?.total}
              cartIcon={
                ratioData?.total_order_ratio?.startsWith("-") === false
                  ? "flaticon-trending"
                  : "flaticon-down-arrow"
              }
              increaseTitle={`${ratioData?.total_order_ratio !== null
                  ? ratioData?.total_order_ratio?.startsWith("-") === false
                    ? "+" + ratioData?.total_order_ratio
                    : ratioData?.total_order_ratio
                  : "0%"
                }  (${filterOrder(date)})`}
              cartImg={cartImg2}
            />
          </Grid>

          {/* Confirmed Order */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
               loading={loading}
              setEndDate={setEndDate}
              endDate={endDate}
              setStartDate={setStartDate}
              startDate={startDate}
              data={confirmed_date}
              setFetchData={setTotalConfirmedDate}
              title="Confirmed Order"
              number={reportData?.confirmed
                ?.toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              cartImg={cartImg3}
              increase={
                ratioData?.confirmed_order_ratio?.startsWith("-") === false
                  ? "increase"
                  : "decrease"
              }
              cartIcon={
                ratioData?.confirmed_order_ratio?.startsWith("-") === false
                  ? "flaticon-trending"
                  : "flaticon-down-arrow"
              }
              increaseTitle={`${ratioData?.confirmed_order_ratio !== null
                  ? ratioData?.confirmed_order_ratio?.startsWith("-") === false
                    ? "+" + ratioData?.confirmed_order_ratio
                    : ratioData?.confirmed_order_ratio
                  : "0%"
                }  (${filterOrder(confirmed_date)})`}
            />
          </Grid>

          {/* Order Pending */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
               loading={loading}
              data={pending_date}
              setFetchData={setPending_date}
              filter={true}
              title="Order Pending"
              number={reportData?.pending ? reportData?.pending : 0}
              cartImg={cartImg4}
            />
          </Grid>

          {/* Cancel Order */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
               loading={loading}
              setEndDate={setEndDate}
              endDate={endDate}
              setStartDate={setStartDate}
              startDate={startDate}
              data={cancel_date}
              setFetchData={setCancel_date}
              title="Cancel Order"
              number={reportData?.cancel}
              cartImg={cartImg5}
              increase={
                ratioData?.cancel_order_ratio?.startsWith("-") === false
                  ? "increase"
                  : "decrease"
              }
              cartIcon={
                ratioData?.cancel_order_ratio?.startsWith("-") === false
                  ? "flaticon-trending"
                  : "flaticon-down-arrow"
              }
              increaseTitle={`${ratioData?.cancel_order_ratio !== null
                  ? ratioData?.cancel_order_ratio?.startsWith("-") === false
                    ? "+" + ratioData?.cancel_order_ratio
                    : ratioData?.cancel_order_ratio
                  : "0%"
                }  (${filterOrder(cancel_date)})`}
            />
          </Grid>

          {/* Sales Amount */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
               loading={loading}
              setEndDate={setEndDate}
              endDate={endDate}
              setStartDate={setStartDate}
              startDate={startDate}
              data={sales_date}
              setFetchData={setTotalSalesDate}
              title="Sales Amount"
              number={reportData?.sales
                ?.toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              cartImg={cartImg6}
              increase={
                ratioData?.sales_amount_ratio?.startsWith("-") === false
                  ? "increase"
                  : "decrease"
              }
              cartIcon={
                ratioData?.sales_amount_ratio?.startsWith("-") === false
                  ? "flaticon-trending"
                  : "flaticon-down-arrow"
              }
              increaseTitle={`${ratioData?.sales_amount_ratio !== null
                  ? ratioData?.sales_amount_ratio?.startsWith("-") === false
                    ? "+" + ratioData?.sales_amount_ratio
                    : ratioData?.sales_amount_ratio
                  : "0%"
                }
                                          (${filterOrder(sales_date)})`}
            />
          </Grid>

          {/* Discount Amount */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
               loading={loading}
              setEndDate={setEndDate}
              endDate={endDate}
              setStartDate={setStartDate}
              startDate={startDate}
              data={discount_date}
              setFetchData={setDiscount_date}
              title="Discount Amount"
              number={reportData?.discount_payment
                ?.toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              cartImg={cartImg7}
              increase={
                ratioData?.discount_amount_ratio?.startsWith("-") === false
                  ? "increase"
                  : "decrease"
              }
              cartIcon={
                ratioData?.discount_amount_ratio?.startsWith("-") === false
                  ? "flaticon-trending"
                  : "flaticon-down-arrow"
              }
              increaseTitle={`${ratioData?.discount_amount_ratio !== null
                  ? ratioData?.discount_amount_ratio?.startsWith("-") === false
                    ? "+" + ratioData?.discount_amount_ratio
                    : ratioData?.discount_amount_ratio
                  : "0%"
                }  (${filterOrder(discount_date)})`}
            />
          </Grid>

          {/* Available Courier Balance */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
              title="Available Courier Balance"
              filter={true}
              increase="increase"
              number={busInfo?.courier_balance ? busInfo?.courier_balance : 0}
              cartIcon=""
              increaseTitle=""
              cartImg={cartImg8}
            />
          </Grid>

          {/* Delivery Report */}
          <Grid item xs={12} sm={6} md={4}>
            <HomePageCart
              setEndDate={setEndDate}
              endDate={endDate}
              setStartDate={setStartDate}
              startDate={startDate}
              data={dateReport}
              setFetchData={setDateReport}
              title="Delivery Report"
              listItem={true}
              deliveryCount={report.delivered}
              deliveryReturnCount={report.returned}
              returnRatioCount={report.returned_ratio}
              cartImg={cartImg9}
            />
          </Grid>

          {advancedPaymentConfig && (
            <Grid item xs={12} sm={6} md={4}>
              <HomePageCart
                setEndDate={setEndDate}
                endDate={endDate}
                setStartDate={setStartDate}
                startDate={startDate}
                data={advance_date}
                setFetchData={setAdvance_date}
                title="Advance Collection"
                number={reportData?.advance_payment
                  ?.toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                cartImg={cartImg11}
                increase={
                  ratioData?.advance_amount_ratio?.startsWith("-") === false
                    ? "increase"
                    : "decrease"
                }
                cartIcon={
                  ratioData?.advance_amount_ratio?.startsWith("-") === false
                    ? "flaticon-trending"
                    : "flaticon-down-arrow"
                }
                increaseTitle={`${ratioData?.advance_amount_ratio !== null
                    ? ratioData?.advance_amount_ratio?.startsWith("-") === false
                      ? "+" + ratioData?.advance_amount_ratio
                      : ratioData?.advance_amount_ratio
                    : "0%"
                  }  (${filterOrder(advance_date)})`}
              />
            </Grid>
          )}

          {/* Sales Target */}
          <Grid item xs={12} sm={12} md={12}>
            {/* <HomePageCart salesTargetRfatch={salesTargetRfatch} filter={true} salesTarget={salesTarget} title="Sales Target" openSale={true} listItem={false} listItem2={true} deliveryCount="0" deliveryReturnCount="0" returnRatioCount="0.0" cartImg={cartImg10} /> */}

            <SalesTarget
              salesTargetRfatch={salesTargetRfatch}
              salesTarget={salesTarget}
            ></SalesTarget>

          </Grid>

          {/* Advance Collection */}

          {/* <Grid item xs={12}>
                            <DataTable />
                        </Grid> */}
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {/* recentOrder */}
          <Grid item xs={12} sm={12} md={6}>
            <RecentOrder />
          </Grid>

          {/* TopSellingProduct */}
          <Grid item xs={12} sm={12} md={6}>
            <TopSellingProducts />
          </Grid>
          {/* <Grid item xs={12}>
                          <DataTable />
                      </Grid> */}
        </Grid>
      </Container>
    </section>
  );
};

export default Dashboard;
