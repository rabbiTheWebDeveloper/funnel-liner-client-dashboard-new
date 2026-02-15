import { useState, useCallback } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { headers } from "../../pages/api";


const useOrderStatistics = (dateRange) => {
  const [reportData, setReportData] = useState({});
  const [ratioData, setRatioData] = useState({});
  console.log(dateRange)

  const fetchOrderStatistics = useCallback(async () => {
    const params = {
      date: dateRange,
      start_date: dateRange,
      end_date: dateRange,
      confirmed_date :dateRange,
      sales_date :dateRange,
      pending_date : dateRange,
      cancel_date :dateRange,
      discount_payment: dateRange,
      advance_payment: dateRange,
    };

    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.ORDERS_STATIC}`, {
        headers,
        params,
      });
      if (response?.data?.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching order statistics", error);
    }
  }, [dateRange]);

  const fetchRatioStatistics = useCallback(async () => {
    const params = {
      total: dateRange,
      confirm: dateRange,
      sales_amount: dateRange,
      cancel: dateRange,
      discount_amount: dateRange,
      advance_amount: dateRange,
    };

    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.RATIO_STATISTICS}`, {
        headers,
        params,
      });
      if (response?.data?.success) {
        setRatioData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching ratio statistics", error);
    }
  }, [dateRange]);

  return { reportData, ratioData, fetchOrderStatistics, fetchRatioStatistics };
};

export default useOrderStatistics;
