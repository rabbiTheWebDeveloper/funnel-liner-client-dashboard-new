import { useState, useCallback } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { headers } from "../../pages/api";
// import { API_ENDPOINTS } from "../../config/ApiEndpoints";
// import { headers } from "../../pages/api";

const useSalesTarget = () => {
  const [salesTarget, setSalesTarget] = useState({});

  const fetchSalesTarget = useCallback(async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.SALES_TARGET}`, {
        headers: headers,
        params: { date: "today" },
      });
      if (response?.data?.success) {
        setSalesTarget(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching sales target", error);
    }
  }, []);

  return { salesTarget, fetchSalesTarget };
};

export default useSalesTarget;
