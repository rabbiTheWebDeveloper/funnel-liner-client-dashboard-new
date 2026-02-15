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
    gtm_body: yup
    .string()
    .when('defaultValueProvided', {
      is: (defaultValueProvided) => defaultValueProvided,
      then: yup.string(),
      otherwise: yup.string().notRequired(),
    }),
});

const GoogleTagManager = ({googleTagManager }) => {
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
        showToast("Successfully Updated Analytics Property ID");
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
                <label> Google Tag Manager
                  <Tooltip
                    title={googleTagManagerText}
                    placement="top-start"
                  >
                    <span style={{ margin: "5px 5px", color: "black", fontSize: "25px", verticalAlign: "middle", display: "inline-block" }}>
                      <i className="flaticon-info"></i>
                    </span>
                  </Tooltip>
                </label>
                <textarea
                  rows={10}
                  id="gtm_head"
                  type="text"
                  {...register("gtm_head")}
                  defaultValue={googleTagManager?.gtm_head}
                  placeholder={`<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-M5W9Q2XC');</script>
                  `}
                />
                {errors.gtm_head && (
                  <p className="error">This field is required</p>
                )}
              </div>

              <div className="customInput">
                <label> Google Tag Manager (noscript)
                  <Tooltip
                    title={googleTagManagerNoscript}
                    placement="top-start"
                  >
                    <span style={{ margin: "5px 5px", color: "black", fontSize: "25px", verticalAlign: "middle", display: "inline-block" }}>
                      <i className="flaticon-info"></i>
                    </span>
                  </Tooltip>
                </label>
                <textarea
                  rows={10}
                  id="gtm_body"
                  type="text"
                  {...register("gtm_body")}
                  defaultValue={googleTagManager?.gtm_body}
                  placeholder={`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5W9Q2XC"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                  `}
                />
                {errors.gtm_body && (
                  <p className="error">This field is required</p>
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

export default GoogleTagManager;
