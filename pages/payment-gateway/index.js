import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { headers } from "../api";
import useSWR from "swr";
import { fetcher } from "../../Components/DashboardV2/App/reports/_reports";
import { useToast } from "../../hook/useToast";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "24px",
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  marginBottom: "24px",
};

const tabStyle = {
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  color: "#64748b",
  backgroundColor: "transparent",
  border: "1px solid transparent",
};

const activeTabStyle = {
  ...tabStyle,
  color: "#7c3aed",
  backgroundColor: "#faf5ff",
  borderColor: "#7c3aed",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "24px",
};

const checkboxStyle = {
  width: "18px",
  height: "18px",
  cursor: "pointer",
};

const buttonStyle = {
  padding: "12px 32px",
  backgroundColor: "#7c3aed",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const sectionStyle = {
  marginBottom: "32px",
  padding: "24px",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "8px",
};
const PaymentGateway = () => {
  const [activeTab, setActiveTab] = useState("bkash");
  const { data, error } = useSWR(
    `/client/payment_gateway/credentials/${activeTab}`,
    fetcher
  );
  const [formData, setFormData] = useState({
    provider: "bkash",
    status: "active",
    config: {
      username: "",
      password: "",
      app_key: "",
      app_secret: "",
      store_id: "your_demo_store_id",
      store_password: "your_demo_store_password",
      sandbox: true,
    },
    full_payment: 1,
    delivery_charge_only: 0,
    percentage: 1.5,
    fixed_amount: 10,
  });
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  console.log("data payment getway", data);
  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleConfigChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        provider: activeTab,
        config: JSON.stringify(formData.config),
      };
      const { data } = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/client/payment_gateway/save`,
        payload,
        {
          headers: headers,
          timeout: 10000, // ⏱ optional: set a timeout (10s)
        }
      );
      showToast("Payment Credentials  Successfully", "success");
    } catch (error) {
      console.error("❌ Error:", error);
      showToast(error, "error");
    } finally {
      // ✅ always runs (success or fail)
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      provider: "bkash",
      status: "active",
      config: {
        store_id: "your_demo_store_id",
        store_password: "your_demo_store_password",
        sandbox: true,
      },
      full_payment: 1,
      delivery_charge_only: 0,
      percentage: 1.5,
      fixed_amount: 10,
    });
  };
  useEffect(() => {
    if (data) {
      // parse config safely
      let parsedConfig = {};
      try {
        parsedConfig = JSON?.parse(data?.config || "{}");
      } catch (err) {
        console.error("Invalid JSON in config:", err);
      }

      // update state with API data
      setFormData({
        provider: data.provider || "bkash",
        status: data.status || "active",
        config: {
          username: parsedConfig.username || "",
          password: parsedConfig.password || "",
          app_key: parsedConfig.app_key || "",
          app_secret: parsedConfig.app_secret || "",
          store_id: parsedConfig.store_id || "",
          store_password: parsedConfig.store_password || "",
          sandbox:
            parsedConfig.sandbox === "true" || parsedConfig.sandbox === true,
        },
        full_payment: data.full_payment ? 1 : 0,
        delivery_charge_only: data.delivery_charge_only ? 1 : 0,
        percentage: data.percentage ?? 1.5,
        fixed_amount: data.fixed_amount ?? 10,
      });
    }
  }, [data]);

  const handleChangePaymentSetting = (field, value, type) => {
    if (type === "full") {
      setFormData({
        ...formData,
        full_payment: value,
        delivery_charge_only: value ? 0 : formData.delivery_charge_only,
        percentage: 0,
        fixed_amount: 0, // uncheck other
      });
    } else if (type === "delivery") {
      setFormData({
        ...formData,
        delivery_charge_only: value,
        full_payment: value ? 0 : formData.full_payment,
        percentage: 0,
        fixed_amount: 0, // uncheck other
      });
    } else if (type === "percentage") {
      setFormData({
        ...formData,
        percentage: value,
        fixed_amount: 0,
        full_payment: 0,
        delivery_charge_only: 0,
      });
    } else if (type === "fixed_amount") {
      setFormData({
        ...formData,
        fixed_amount: value,
        percentage: 0,
        full_payment: 0,
        delivery_charge_only: 0,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  return (
    <>
      <HeaderDescription
        headerIcon={"flaticon-payment-method"}
        title={"Payment Gateway Settings"}
        subTitle={"Configure your payment gateway providers and settings"}
        search={false}
        order={false}
        backbutton={true}
      />

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            Payment Gateway Settings
          </h1>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "32px",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "16px",
            }}
          >
            {["bkash", "sslcommerz"].map(p => (
              <div
                key={p}
                style={activeTab === p ? activeTabStyle : tabStyle}
                onClick={() => {
                  setActiveTab(p);
                  handleChange("provider", p);
                }}
              >
                {p.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Config Section */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
                🔐 {activeTab.toUpperCase()} API Configuration
              </h3>
              {activeTab === "bkash" ? (
                <div style={gridStyle}>
                  <div>
                    <label style={labelStyle}>username</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={formData.config.username}
                      onChange={e =>
                        handleConfigChange("username", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Store Password</label>
                    <input
                      type="password"
                      style={inputStyle}
                      value={formData.config.password}
                      onChange={e =>
                        handleConfigChange("password", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>app_key</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={formData.config.app_key}
                      onChange={e =>
                        handleConfigChange("app_key", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>app_secret</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={formData.config.app_secret}
                      onChange={e =>
                        handleConfigChange("app_secret", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : null}
              {activeTab === "sslcommerz" ? (
                <div style={gridStyle}>
                  <div>
                    <label style={labelStyle}>Store ID</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={formData.config.store_id}
                      onChange={e =>
                        handleConfigChange("store_id", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Store Password</label>
                    <input
                      type="password"
                      style={inputStyle}
                      value={formData.config.store_password}
                      onChange={e =>
                        handleConfigChange("store_password", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={formData.config.sandbox}
                    onChange={e =>
                      handleConfigChange("sandbox", e.target.checked)
                    }
                  />{" "}
                  Enable Sandbox Mode
                </label>
              </div>
            </div>

            {/* Payment Settings */}
            <div style={sectionStyle}>
              <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
                💰 Payment Settings
              </h3>

              <div>
                <label>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={formData.full_payment === 1}
                    onChange={e =>
                      handleChangePaymentSetting(
                        "full_payment",
                        e.target.checked ? 1 : 0,
                        "full"
                      )
                    }
                  />{" "}
                  Enable Full Payment
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={formData.delivery_charge_only === 1}
                    onChange={e =>
                      handleChangePaymentSetting(
                        "delivery_charge_only",
                        e.target.checked ? 1 : 0,
                        "delivery"
                      )
                    }
                  />{" "}
                  Delivery Charge Only
                </label>
              </div>

              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Transaction Percentage (%)</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={formData.percentage}
                    onChange={e =>
                      handleChangePaymentSetting(
                        "percentage",
                        parseFloat(e.target.value),
                        "percentage"
                      )
                    }
                  />
                </div>
                <div>
                  <label style={labelStyle}>Fixed Amount (৳)</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={formData.fixed_amount}
                    onChange={e =>
                      handleChangePaymentSetting(
                        "fixed_amount",
                        parseFloat(e.target.value),
                        "fixed_amount"
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div style={sectionStyle}>
              <label style={labelStyle}>Provider Status</label>
              <select
                style={inputStyle}
                value={formData.status}
                onChange={e => handleChange("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div
              style={{
                marginTop: "24px",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "24px",
              }}
            >
              <button type="submit" style={buttonStyle}>
                Save Changes
              </button>
              <button
                type="button"
                style={{
                  ...buttonStyle,
                  backgroundColor: "#6b7280",
                  marginLeft: "12px",
                }}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentGateway;
