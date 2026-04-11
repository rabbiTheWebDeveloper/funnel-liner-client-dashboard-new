import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useToast } from "../../hook/useToast";
import useLoading from "../../hook/useLoading";
import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import styles from "./MicrosoftClaritySetup.module.css";

const MicrosoftClaritySetup = () => {
  const router = useRouter();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [isFetching, setIsFetching] = useState(true);
  const showToast = useToast();

  const [msClarityId, setMsClarityId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.SETTINGS.GET_MS_CLARITY,
          { headers }
        );
        if (response.data?.success && response.data?.data) {
          setMsClarityId(response.data.data.ms_clarity_id || "");
        }
      } catch (error) {
        console.error("Failed to fetch Microsoft Clarity defaults:", error);
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
    formData.append("ms_clarity_id", msClarityId);

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.SETTINGS.MS_CLARITY_SETUP,
        formData,
        { headers }
      );
      stopLoading();
      showToast("Microsoft Clarity configuration saved successfully", "success");
    } catch (error) {
      stopLoading();
      showToast(error?.response?.data?.msg || "Something went wrong", "error");
    }
  };

  return (
    <>
      <HeaderDescription
        headerIcon={"flaticon-settings"}
        title={"Configure Microsoft Clarity Options"}
        subTitle={"Set up your analytics platform to monitor user interactions"}
        search={false}
        order={false}
      />
      <div className={styles.pageContainer}>
        <div className={styles.backHeader}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            &lt;
          </button>
          <h2 className={styles.pageTitle}>Microsoft Clarity</h2>
        </div>

        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Configure Microsoft Clarity</h3>
            <p className={styles.cardSubtitle}>
              Analyze user interactions with session recordings and heatmaps
            </p>

            <div className={styles.instructionsPanel}>
              <h4 className={styles.instructionsTitle}>Steps to enable Microsoft Clarity</h4>
              <ul className={styles.instructionsList}>
                <li>Go to the Microsoft Clarity dashboard and sign in</li>
                <li>Create a new project or select an existing one</li>
                <li>Navigate to Settings &gt; Setup</li>
                <li>Copy the Project ID and paste it below</li>
              </ul>
            </div>

            {isFetching ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>Loading data...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Microsoft Clarity ID</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter your Microsoft Clarity ID"
                    value={msClarityId}
                    onChange={(e) => setMsClarityId(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Update Clarity Info"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MicrosoftClaritySetup;
