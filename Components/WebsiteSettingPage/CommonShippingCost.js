import { Button, Grid } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { headers } from "../../pages/api";
import axios from "axios";
import Swal from "sweetalert2";

const CommonShippingCost = ({ shopId, shippingCostData }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async data => {
    try {
      const formData = new FormData();
      formData.append("inside", data?.inside);
      formData.append("outside", data.outside);
      formData.append("shop_id", shopId);
      formData.append("subarea", data.subarea);

      const response = await axios.post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.POST_COMMON_SHIPPING_COST}`,
        formData,
        {
          headers: headers,
        }
      );

      const { message } = response?.data || {};
      Swal.fire(message, "success");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div className="DashboardTabsItem">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="BusinessInfo">
          <div className="BusinessInfoItem">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <h4>Shipping Cost Info</h4>
                <p>Update your Shipping Cost</p>

                {["inside", "outside", "subarea"].map(field => (
                  <div className="customInput" key={field}>
                    <label>{`Delivery charge ${
                      field.charAt(0).toUpperCase() + field.slice(1)
                    }`}</label>
                    <input
                      type="number"
                      min="0"
                      onWheel={e => e.target.blur()}
                      {...register(field)}
                      defaultValue={shippingCostData?.[field]}
                    />
                  </div>
                ))}
              </Grid>
            </Grid>
          </div>
          <div className="duelButton">
            <Button type="submit">Update</Button>
            <Button className="red">Reset</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommonShippingCost;
