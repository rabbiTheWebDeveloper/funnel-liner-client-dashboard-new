import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useToast } from "../../hook/useToast";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { Button, Tooltip } from "@mui/material";
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

const steps = [
  "Log in to your Google Analytics account.",
  "Click on 'Admin' in the navigation menu.",
  "Under the 'Property' column, select 'Property Settings'.",
  "In the 'Property Settings' section, find 'Data collection and modification'.",
  "Click on 'Data Streams'.",
  "Locate and click on your site link.",
  "You'll find the Measurement ID for your site on this page."
];

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
        showToast(response?.data?.message);
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
                <label>Google Analytics Measurement ID
                <Tooltip
                    title={
                      <div>
                        <p><h5 style={{color:"white"}}>To find your Google Analytics Measurement ID:</h5></p>
                        <div>
                          {steps.map((step, index) => (
                            <div key={index}>{`${index + 1}. ${step}`}</div>
                          ))}
                        </div>
                      </div>
                    }
                    placement="top-start"
                  >
                    <span style={{ margin: "5px 5px", color: "black", fontSize: "25px", verticalAlign: "middle", display: "inline-block" }}>
                      <i className="flaticon-info"></i>
                    </span>
                  </Tooltip>
                </label>
                <input
                  id="google_analytics"
                  type="text"
                  {...register("google_analytics")}
                  defaultValue={googleTagManager?.google_analytics}
                  placeholder="e.g. G-LHTQH2P5K2"
                />
                {errors.google_analytics && (
                  <p className="error">{errors.google_analytics.message}</p>
                )}
              </div>
              <div className="duelButton">
                <Button type="submit">Update</Button>
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
