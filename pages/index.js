import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { headers } from "./api";
// import Dashboard from "../Components/HomePage/Dashboard";
import withAuth from "../hook/PrivateRoute";
import FirstSetup from "../Components/HomePage/FirstSetup/FirstSetup";
import useOrderLiveData from "../hook/useOrderLiveData";
import { Dashboard } from "../Components/DashboardV2/dashboard";

const HomePage = ({ busInfo }) => {
  const [isApiResponse, setIsApiResponse] = useState(false);
  const [info, setInfo] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const skip1 = Cookies.get("Skip_status");
  const totalTask = Cookies.get("total_task");

  const handleFetchBasicInfo = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/client/shop-steps`, { headers });
      setInfo(data?.data);
      Cookies.set("total_task", data?.data?.total_task);
      setIsApiResponse(true);
    } catch (err) {}
  }, [apiUrl]);

  useEffect(() => {
    handleFetchBasicInfo();
  }, [handleFetchBasicInfo]);

  const skip = () => {
    Cookies.set("Skip_status", true);
    window.location.href = "/";
  };
  return (
    <div className="HomePage">
      {isApiResponse && (
        totalTask !== "6" ? (
          skip1 !== "true" ? <FirstSetup skip={skip} busInfo={busInfo} shopStep={info} /> : <Dashboard busInfo={busInfo} />
        ) : (
          <Dashboard busInfo={busInfo} currentDashboard = "new" />
        )
      )}
    </div>
  );
};

export default withAuth(HomePage, {
  isProtectedRoute: true,
  show: false,
});
