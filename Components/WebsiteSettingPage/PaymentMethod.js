
import {Tooltip } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getWebsiteSettings, headers, shopId } from "../../pages/api";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { useCallback } from "react";
import { useToast } from "../../hook/useToast";


const PaymentMethod = () => {
  const showToast = useToast();
  const [reFatch, setReFatch] = useState(false);
  const [shippingCost, setShippingCost] = useState(false);
  const [shippingCostData, setShippingCostData] = useState({});
 
  const handleSwitchCommonShippingCost = async event => {
    setShippingCost(event.target.checked);
    axios
      .get(
        `${API_ENDPOINTS.BASE_URL}/client/order-permission/status-update`,
        // { status: event.target.checked ? "1" : "0" },

        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast(
          event.target.checked
            ? "Stock   On  enable"
            : "Stock  On Disable ",
          "success"
        );
        setReFatch(true);
      })
      .catch(function (error) {
        showToast("Something went wrong", "error");
      });
  };

  const handleFetchCommonShippingCostStatus = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}/client/order-permission/status`,
        headers: headers,
      });
      if (data.status) {
        setShippingCost(data?.data?.data?.order_perm_status);
        // setShippingCostData(data?.data?.data.order_perm_status);
        console.log(data.data.data);
      }
    } catch (err) { }
  }, [reFatch]);


  useEffect(() => {
    handleFetchCommonShippingCostStatus();
  }, [handleFetchCommonShippingCostStatus]);
  return (
    <>
    
      <div className="WebsiteSettingPayment boxShadow commonCart cart-6">
        <div className="left d_flex">
          <div className="icon">
            <i className="flaticon-in-stock"></i>
          </div>
          <h4>Order Permission Based on Product Stock Availability<Tooltip
            title={"যেকোনো প্রোডাক্ট স্টক আউট হয়ে গেলে অর্ডার নেয়া অফ করতে চাইলে ট্রিগারটি অফ করুন।"}
            placement="top-start"
          >
            <span style={{ margin: "5px 5px", color: "black", fontSize: "25px", verticalAlign: "middle", display: "inline-block" }}>
              <i className="flaticon-info"></i>
            </span>
          </Tooltip> </h4>
        </div>

        <div className="right">
          {/* <div>fdfs</div> */}
          <div>
            <Switch
              checked={shippingCost}
              onChange={handleSwitchCommonShippingCost}
              color="primary"
              name="mySwitch"
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default PaymentMethod;