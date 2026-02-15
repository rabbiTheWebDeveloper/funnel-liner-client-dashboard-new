import axios from "axios";
import React, { useEffect, useState } from "react";
import AllNotification from "../../Components/Common/AllNotification/AllNotification";
import { headers } from "../api";
import withAuth from "../../hook/PrivateRoute";

const NotificationPage = ({ busInfo }) => {
 
 
  return (
    <>
      <AllNotification busInfo={busInfo}/>
    </>
  );
};

export default withAuth(NotificationPage, {
  isProtectedRoute: true,
  show: false,
});
