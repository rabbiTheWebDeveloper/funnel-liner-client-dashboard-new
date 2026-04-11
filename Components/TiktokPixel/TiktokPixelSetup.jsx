import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useToast } from "../../hook/useToast";
import useLoading from "../../hook/useLoading";
import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import styles from "./TiktokPixelSetup.module.css";

const TiktokPixelSetup = () => {
  const router = useRouter();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [isFetching, setIsFetching] = useState(true);
  const showToast = useToast();

  const [pixelId, setPixelId] = useState("");
  const [pixelAccessToken, setPixelAccessToken] = useState("");
  const [pixelEventCode, setPixelEventCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.SETTINGS.GET_TIKTOK_PIXEL,
          { headers }
        );
        if (response.data?.success && response.data?.data) {
          setPixelId(response.data.data.pixel_id || "");
          setPixelAccessToken(response.data.data.pixel_access_token || "");
          setPixelEventCode(response.data.data.pixel_event_code || "");
        }
      } catch (error) {
        console.error("Failed to fetch TikTok Pixel defaults:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    const formData = new FormData();
    formData.append("pixel_id", pixelId);
    formData.append("pixel_access_token", pixelAccessToken);
    formData.append("pixel_event_code", pixelEventCode);

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.SETTINGS.TIKTOK_PIXEL_SETUP,
        formData,
        { headers }
      );
      stopLoading();
      showToast("TikTok Pixel configuration saved successfully", "success");
    } catch (error) {
      stopLoading();
      showToast(error?.response?.data?.msg || "Something went wrong", "error");
    }
  };

  return (
    <>
      <HeaderDescription
        headerIcon={"flaticon-target"}
        title={"Configure TikTok Pixel Options"}
        subTitle={"Set up your preferred pixel platform for ad tracking and optimization"}
        search={false}
        order={false}
      />
      <div className={styles.pageContainer}>
        <div className={styles.backHeader}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            &lt;
          </button>
          <h2 className={styles.pageTitle}>TikTok Pixel</h2>
        </div>

        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Configure TikTok Pixel</h3>
            <p className={styles.cardSubtitle}>
              Set up your preferred pixel platform for ad tracking
            </p>

            <div className={styles.instructionsPanel}>
              <h4 className={styles.instructionsTitle}>Steps to enable TikTok Pixel</h4>
              <ul className={styles.instructionsList}>
                <li>Go to your TikTok Ads Manager Account</li>
                <li>Navigate to Assets &gt; Events</li>
                <li>Select Web Events and manage your Pixel</li>
                <li>Copy the Pixel ID, Access Token, and Event Code and paste them below</li>
              </ul>
            </div>

            {isFetching ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>Loading data...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pixel ID</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter your Pixel ID"
                    value={pixelId}
                    onChange={(e) => setPixelId(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Pixel Access Token</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter your Pixel Access Token"
                    value={pixelAccessToken}
                    onChange={(e) => setPixelAccessToken(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Pixel Event Code</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter your Pixel Event Code"
                    value={pixelEventCode}
                    onChange={(e) => setPixelEventCode(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Update TikTok Pixel Info"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TiktokPixelSetup;
