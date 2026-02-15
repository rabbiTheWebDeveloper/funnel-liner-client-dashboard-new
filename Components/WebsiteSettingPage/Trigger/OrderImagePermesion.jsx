import { Switch } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { headers } from '../../../pages/api';
import { API_ENDPOINTS } from '../../../config/ApiEndpoints';


const OrderImagePermesion = ({response , showToast}) => {
  const [shippingCost, setShippingCost] = useState(response?.order_otp_perm);

  const handleSwitchCommonShippingCost = async ({ target: { checked } }) => {
    setShippingCost(checked);
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.ORDERS_IMAGE_PERMISSION}`,
        { headers }
      );
      showToast(
        checked
          ? "Image attachment option for orders has been successfully enabled."
          : "Image attachment option for orders has been successfully disabled.",
        "success"
      );
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };
  
  useEffect(() => {
    const shippingPermission = response.order_attach_img_perm === 1 ? true : false;
    setShippingCost(shippingPermission);
  }, [response.order_otp_perm]);
  return (
    <div className="WebsiteSettingPayment boxShadow commonCart cart-2">
    <div className="left d_flex">
      <div className="icon">
      <i className="flaticon-mail" />
      </div>
      <h4>Enable image attachment option for orders</h4>
    </div>

    <div className="right">
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
  );
};

export default OrderImagePermesion;