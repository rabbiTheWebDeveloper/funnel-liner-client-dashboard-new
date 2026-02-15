import { Button, Switch, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { headers, shopId } from "../../pages/api";
import { useToast } from "../../hook/useToast";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { googleTagManager, googleTagManagerNoscript, googleTagManagerText } from "../../constant/constant";

const validationSchema = yup.object().shape({
  gtm_head: yup
    .string()
    .when('defaultValueProvided', {
      is: (defaultValueProvided) => defaultValueProvided,
      then: yup.string(),
      otherwise: yup.string().notRequired(),
    }),
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

const stepsTagManager = [
  "Log in to your Google Tag Manager account.",
  "In the dashboard, select the container where you want to find the GTM ID.",
  "Click on the container name to enter the container.",
  "In the top right corner, you'll find a 'Container ID' or 'GTM ID.' This is your unique GTM ID for the selected container."
];

const GoogleTagManager = ({ googleTagManager }) => {
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
      if (response?.data?.success) {
        showToast(response?.data?.message);
      }
    } catch (error) {
      showToast("Something went wrong! Please provide valid data");
    }
  };;

  return (
    <div className="DashboardTabsItem FacebookPixel">
      <div className="Header">
        <h4>Google Tag Manager Setting</h4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="ProductTable">
          <div className="FacebookPixel">
            <div className="Form">

              <div className="customInput">
                <label> Google Tag Manager ID
                  <Tooltip
                    title={
                      <div>
                        <p><h5 style={{color:"white"}}>How to Find Your Google Tag Manager (GTM) ID</h5></p>
                        {/* <ol>
                          {steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol> */}

                        <div>
                          {stepsTagManager.map((step, index) => (
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
                  rows={10}
                  id="gtm_head"
                  type="text"
                  {...register("gtm_head")}
                  defaultValue={googleTagManager?.gtm_head}
                  placeholder={"e.g. GTM-M5W9Q2XC"}
                />
                {errors.gtm_head && (
                  <p className="error">This field is required</p>
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

export default GoogleTagManager;
