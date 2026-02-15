import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import style from "./style.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useToast } from "../../hook/useToast";
import { DomainAssignInstruction } from "./DomainAssignInstruction";
import { DomainEdit } from "./DomainEdit";
import { Spinner } from "./Spinner";
import { headers, shopId } from "../../pages/api";
import { domainRegex } from "../../constant/constant";

export const DomainRequest = ({ shopName }) => {
  const [websiteSettingsData, setWebsiteSettingData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const router = useRouter();
  const toast = useToast();
  const [refreshCount, setRefreshCount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchWebsiteSettings();
  }, [customDomain]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("refreshData")) || {};
    const { date, count } = storedData;
    const today = new Date().toLocaleDateString();
    if (date !== today) {
      setRefreshCount(0);
      localStorage.setItem(
        "refreshData",
        JSON.stringify({ date: today, count: 0 })
      );
    } else {
      setRefreshCount(count || 0);
    }
  }, []);

  const fetchWebsiteSettings = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/client/settings/business-info`, {
        headers: headers,
      })
      .then(response => {
        setWebsiteSettingData(response?.data?.data || {});
      })
      .catch(error => {
        console.error("Error fetching website settings:", error);
      });
  };
  const onSubmit = data => {
    if (!domainRegex.test(data.domain_request)) {
      // or shopName if defined elsewhere
      toast("Please enter a valid domain name.", "error");
      return;
    }

    data.shop_name = shopName;
    data.shop_id = shopId;
    data.domain_status = "pending";

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/settings/domain/update`,
        data,
        {
          headers: headers,
        }
      )
      .then(response => {
        toast(response.data.msg);
        fetchWebsiteSettings();
      })
      .catch(error => {
        toast(
          error.response?.data?.msg ||
            "Oops! Something went wrong. Please try again later or contact support."
        );
      });

    reset();
  };

  const handleRefresh = () => {
    if (refreshCount < 5) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/settings/domain/refresh`,
          {},
          {
            headers: headers,
          }
        )
        .then(response => {
          toast(response.data.msg);
          fetchWebsiteSettings();
          const newCount = refreshCount + 1;
          setRefreshCount(newCount);
          localStorage.setItem(
            "refreshData",
            JSON.stringify({
              date: new Date().toLocaleDateString(),
              count: newCount,
            })
          );
        })
        .catch(error => {
          toast(
            error.response?.data?.errMgs ||
              "Oops! Something went wrong. Please try again later or contact support."
          );
        });
    } else {
      toast("Maximum refresh limit reached for today.");
    }
  };

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleDomainChange = event => {
    setCustomDomain(event.target.value);
  };

  return (
    <div className={style.domainRequest}>
      <div className={style.title}>
        <h1>Domains</h1>
        <p>These domains are assigned to your website.</p>
      </div>

      <div className={style.content}>
        {websiteSettingsData?.domain_status !== "connected" &&
          websiteSettingsData?.domain_status !== "pending" && (
            <div className={style.addDomain}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={style.addDomainInput}
              >
                <input
                  aria-label="Domain Alias"
                  placeholder="yourwebsite.com"
                  aria-invalid="false"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  data-geist-input=""
                  spellCheck="false"
                  type="text"
                  {...register("domain_request", { required: true })}
                />
                <Button
                  variant="contained"
                  type="submit"
                  className={style.addDomainButton}
                >
                  Add
                </Button>
              </form>
            </div>
          )}

        <div className={style.domainList}>
          <div className={style.domain}>
            {websiteSettingsData?.domain_status === "" && (
              <div className={style.domainName}>
                <h1>
                  {websiteSettingsData?.domain_request || "yourwebsite.com"}
                </h1>
              </div>
            )}

            {!isEdit && websiteSettingsData?.domain_status === "failed" && (
              <div className={style.statuses}>
                <div className={style.domainName}>
                  <h1>
                    {websiteSettingsData?.domain_request || "yourwebsite.com"}
                  </h1>
                </div>
                <div className={`${style.status} ${style.invalid}`}>
                  <div className={style.statusIcon}>
                    <svg
                      shapeRendering="geometricPrecision"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="currentColor"
                      ></circle>
                      <path
                        d="M15 9L9 15"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M9 9L15 15"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>

                  <h4>Invalid Configuration</h4>
                </div>
              </div>
            )}

            {!isEdit && websiteSettingsData?.domain_status === "rejected" && (
              <div className={style.statuses}>
                <div className={style.domainName}>
                  <h1>
                    {websiteSettingsData?.domain_request || "yourwebsite.com"}
                  </h1>
                </div>
                <div className={`${style.status} ${style.invalid}`}>
                  <div className={style.statusIcon}>
                    <svg
                      shapeRendering="geometricPrecision"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="currentColor"
                      ></circle>
                      <path
                        d="M15 9L9 15"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M9 9L15 15"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>

                  <h4>Rejected</h4>
                </div>
              </div>
            )}

            {!isEdit && websiteSettingsData?.domain_status === "rejected" && (
              <div className={style.title}>
                <h4 style={{ paddingTop: "20px" }}>
                  Reason:{" "}
                  {websiteSettingsData?.reject_reason ?? "No Reason Found!"}
                </h4>
              </div>
            )}

            {isEdit ? (
              websiteSettingsData?.domain_status !== "connected" &&
              websiteSettingsData?.domain_status !== "pending" ? (
                <DomainEdit />
              ) : (
                <DomainAssignInstruction />
              )
            ) : (
              ""
            )}
            {websiteSettingsData?.domain_status == "failed" && (
              <DomainAssignInstruction />
            )}
          </div>

          {websiteSettingsData?.domain_status === "pending" && (
            <div className={style.domain}>
              <div className={style.domainName}>
                <h1>
                  {websiteSettingsData?.domain_request || "yourwebsite.com"}
                </h1>
                <div className={style.actions}>
                  {!isEdit && (
                    <Button
                      variant="outlined"
                      type="submit"
                      className={style.actionButton}
                      onClick={handleRefresh}
                      disabled={refreshCount >= 5}
                    >
                      <div className={style.refreshLoader}>
                        <Spinner />
                      </div>
                      Refresh
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    type="submit"
                    className={style.actionButton}
                    onClick={toggleEdit}
                  >
                    {isEdit ? "Discard" : "Edit"}
                  </Button>
                </div>
              </div>

              {!isEdit && websiteSettingsData?.domain_status === "pending" && (
                <div className={style.statuses}>
                  <div className={`${style.status} ${style.invalid}`}>
                    <div className={style.statusIcon}>
                      <Spinner
                        style={{
                          "--thickness": "7px",
                          "--color": "#c7c7c7",
                        }}
                      />
                    </div>
                    <h4 style={{ color: "#c7c7c7" }}>Checking Domain Status</h4>
                    <div className={style.statusIcon}>
                      <svg
                        shapeRendering="geometricPrecision"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="currentColor"
                        ></circle>
                        <path
                          d="M15 9L9 15"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M9 9L15 15"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <h4> Current Configuration Detected as Invalid</h4>
                  </div>
                </div>
              )}

              {isEdit ? <DomainEdit /> : <DomainAssignInstruction />}
            </div>
          )}

          {websiteSettingsData?.domain_status === "connected" && (
            <div className={style.domain}>
              <div className={style.domainName}>
                <h1>
                  {websiteSettingsData?.domain_request || "yourwebsite.com"}
                </h1>
                <div className={style.actions}>
                  <Button
                    variant="outlined"
                    type="submit"
                    className={style.actionButton}
                    onClick={toggleEdit}
                  >
                    {isEdit ? "Discard" : "Edit"}
                  </Button>
                </div>
              </div>
              {isEdit && websiteSettingsData?.domain_status === "connected" && (
                <DomainEdit />
              )}
              {!isEdit && (
                <div className={style.statuses}>
                  <div className={style.status}>
                    <div className={style.statusIcon}>
                      <svg
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                          fill="currentColor"
                          stroke="currentColor"
                        ></path>
                        <path
                          d="M8 11.8571L10.5 14.3572L15.8572 9"
                          fill="none"
                          stroke="#fff"
                        ></path>
                      </svg>
                    </div>
                    <h4>Valid Configuration</h4>
                  </div>
                  <div className={style.status}>
                    <div className={style.statusIcon}>
                      <svg
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                          fill="currentColor"
                          stroke="currentColor"
                        ></path>
                        <path
                          d="M8 11.8571L10.5 14.3572L15.8572 9"
                          fill="none"
                          stroke="#fff"
                        ></path>
                      </svg>
                    </div>
                    <h4>Connected</h4>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
