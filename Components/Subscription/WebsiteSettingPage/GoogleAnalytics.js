import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useToast } from "../../hook/useToast";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { Button } from "@mui/material";
import { headers } from "../../pages/api";

const validationSchema = yup.object().shape({
  google_analytics: yup
    .string()
    .when('defaultValueProvided', {
      is: (defaultValueProvided) => defaultValueProvided,
      then: yup.string(),
      otherwise: yup.string().notRequired(),
    }),
});

const GoogleAnalytics = ({ googleTagManager }) => {
  const showToast = useToast();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.POST_GOOGLE_TAG_MANAGER}`,
        data,
        {
          headers: headers,
        }
      );
      if(response?.data?.success){
        showToast("Successfully Updated Analytics Property ID");
      }
     
      
    } catch (error) {
      showToast("Something went wrong! Please provide valid data");
    }
  };

  return (
    <div className="DashboardTabsItem FacebookPixel">
      <div className="Header">
        <h4>Google Analytics Setting</h4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="ProductTable">
          <div className="FacebookPixel">
            <div className="Form">
              <div className="customInput">
                <label>Analytics Property ID</label>
                <input
                  id="google_analytics"
                  type="text"
                  {...register("google_analytics")}
                  defaultValue={googleTagManager?.google_analytics}
                  placeholder="Enter Analytics Property ID"
                />
                {errors.google_analytics && (
                  <p className="error">{errors.google_analytics.message}</p>
                )}
              </div>
              <div className="duelButton">
                <Button type="submit">Save</Button>
                <Button className="red">Reset</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GoogleAnalytics;
