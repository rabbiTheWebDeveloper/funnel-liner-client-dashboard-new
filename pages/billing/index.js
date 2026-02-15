import React, { useEffect, useState } from "react";
// import Subscription from "../../Components/Subscription/Subscription";
import SuperFetch from "../../hook/Axios";
import withAuth from "../../hook/PrivateRoute";
import { headers } from "../api";
import Cookies from "js-cookie";
import useLoading from "../../hook/useLoading";
import Subscription from "../../Components/Subscription/Subscription.js";

const Index = ({ busInfo, handelFetchBusInfo }) => {
  const { merchant } = busInfo || {};
  // const [subscriptions, setSubscriptions] = useState([]);
  const [isApiResponse, setIsApiResponse] = useState(false);
  // useEffect(() => {
  //   SuperFetch.get("/client/subscription/info", { headers: headers }).then(
  //     (res) => {
  //       setSubscriptions(res.data?.data);
    
  //       setIsApiResponse(true);
  //     }
  //   );
  // }, []);

  return (
    <>
      <Subscription
        // subscriptions={subscriptions}
        merchant={merchant}
        handelFetchBusInfo={handelFetchBusInfo}
        isApiResponse={isApiResponse}
      />
    </>
  );
};

export default withAuth(Index, {
  isProtectedRoute: true,
  show: true,
});
