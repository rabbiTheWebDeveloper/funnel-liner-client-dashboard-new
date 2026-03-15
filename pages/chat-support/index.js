import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import { headers } from "../api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

/** Build request headers for FormData: omit Content-Type so fetch sets multipart boundary */
const getFormDataHeaders = () => {
  const { "Content-Type": _ct, ...rest } = headers;
  return rest;
};

const ChatPage = ({ busInfo }) => {
  const router = useRouter();
  const [selected, setSelected] = useState("fb_page_id");
  const [formData, setFormData] = useState({
    fb_page_id: "",
    whatsapp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchChatSupportInfo = async () => {
      try {
        const res = await fetch(
          API_ENDPOINTS.BASE_URL + "/client/get_whatsapp_fb_page_id_data",
          {
            method: "GET",
            headers: headers,
          }
        );

        if (!res.ok) throw new Error("Failed to load chat support info");

        const data = await res.json();
        setFormData({
          fb_page_id: data?.data?.fb_page_id || "",
          whatsapp: data?.data?.whatsapp || "",
        });

        if (data.whatsapp) {
          setSelected("whatsapp");
        } else if (data.fb_page_id) {
          setSelected("fb_page_id");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchChatSupportInfo();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formDataToSend = new FormData();
      const key = selected === "fb_page_id" ? "fb_page_id" : "whatsapp";
      const value = selected === "fb_page_id" ? formData.fb_page_id : formData.whatsapp;
      formDataToSend.append(key, value);

      const response = await fetch(
        API_ENDPOINTS.BASE_URL + "/client/save_whatsapp_fb_page_id",
        {
          method: "POST",
          headers: getFormDataHeaders(),
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Failed to update chat support info");

      setMessage({
        text: "Chat support information updated successfully!",
        type: "success",
      });

      setFormData({ fb_page_id: "", whatsapp: "" });
    } catch (error) {
      setMessage({
        text: error.message || "An error occurred while updating",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderDescription
        headerIcon={"flaticon-wallet-1"}
        title={"Configure Chat Support Options"}
        subTitle={"Set up your preferred chat platform for customer support"}
        search={false}
        order={false}
        backbutton={true}
      />

      <div className="chat-support-container">
        <div className="header">
          <button
            type="button"
            className="back-button"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="title">Chat Support</h2>
        </div>

        {/* Card */}
        <div className="card">
          <h3 className="card-title">Configure Chat Support</h3>
          <p className="card-subtitle">
            Set up your preferred chat platform for customer support
          </p>

          {/* Tabs */}
          <div className="tabs-container">
            <button
              onClick={() => setSelected("fb_page_id")}
              className={`tab ${selected === "fb_page_id" ? "tab-active" : ""}`}
            >
              <i className={"flaticon-facebook-1"} /> Facebook
            </button>

            <button
              onClick={() => setSelected("whatsapp")}
              className={`tab ${selected === "whatsapp" ? "tab-active" : ""}`}
            >
              <i className={"flaticon-whatsapp"} /> WhatsApp
            </button>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`alert ${
                message.type === "error" ? "alert-error" : "alert-success"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {selected === "fb_page_id" && (
              <div className="platform-section">
                <div className="info-box">
                  <h4 className="info-title">Steps to enable Facebook Chat</h4>
                  <ol className="steps-list">
                    <li>Go to your Facebook Page</li>
                    <li>
                      Click on <strong>About</strong> in the left menu
                    </li>
                    <li>
                      Scroll to <strong>Page transparency</strong>
                    </li>
                    <li>
                      Copy the <strong>Page ID</strong> and paste it below
                    </li>
                  </ol>
                </div>

                <div className="input-group">
                  <label className="input-label">Facebook Page ID</label>
                  <input
                    type="text"
                    name="fb_page_id"
                    value={formData.fb_page_id}
                    onChange={handleInputChange}
                    placeholder="Enter your Facebook Page ID"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}

            {selected === "whatsapp" && (
              <div className="platform-section">
                <div className="input-group">
                  <label className="input-label">
                    WhatsApp Business Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+8801XXXXXXXXX"
                    className="input-field"
                    pattern="\+[0-9]{11,15}"
                    required
                  />
                  <small className="input-hint">Format: +8801XXXXXXXXX</small>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Updating..." : "Update Chat Support Info"}
            </button>
          </form>
        </div>

        <style jsx>{`
          .chat-support-container {
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            width: 100%;
            max-width: 600px;
          }

          .back-button {
            background: #6c2bd9;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-right: 10px;
            transition: all 0.3s;
          }

          .back-button:hover {
            background: #5b21b6;
          }

          .title {
            margin: 0;
            font-weight: 700;
            font-size: 24px;
            color: #1a202c;
          }

          .card {
            background: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
          }

          .card-title {
            font-weight: 700;
            font-size: 22px;
            margin-bottom: 8px;
            color: #2d3748;
          }

          .card-subtitle {
            color: #718096;
            margin-bottom: 25px;
          }

          .tabs-container {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
            flex-wrap: wrap;
          }

          .tab {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            background: #f7fafc;
            padding: 10px 15px;
            font-weight: 600;
            font-size: 14px;
            color: #4a5568;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .tab-active {
            background: #6c2bd9;
            color: white;
            border-color: #6c2bd9;
          }

          .alert {
            border-radius: 8px;
            padding: 12px;
            font-size: 14px;
            margin-bottom: 15px;
          }

          .alert-success {
            background: #e6fffa;
            color: #22543d;
            border: 1px solid #9ae6b4;
          }

          .alert-error {
            background: #fed7d7;
            color: #742a2a;
            border: 1px solid #feb2b2;
          }

          .info-box {
            background: #f6f3ff;
            border-left: 4px solid #6c2bd9;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
          }

          .info-title {
            font-weight: 600;
            margin-bottom: 10px;
          }

          .steps-list {
            margin: 0;
            padding-left: 20px;
            font-size: 14px;
          }

          .input-group {
            margin-bottom: 20px;
          }

          .input-label {
            font-weight: 600;
            margin-bottom: 6px;
            display: block;
          }

          .input-field {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1.5px solid #e2e8f0;
            font-size: 15px;
          }

          .input-field:focus {
            border-color: #6c2bd9;
            outline: none;
            box-shadow: 0 0 0 3px rgba(108, 43, 217, 0.1);
          }

          .submit-button {
            width: 100%;
            background: #6c2bd9;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 14px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .submit-button:hover {
            background: #5b21b6;
            transform: translateY(-1px);
          }

          @media (max-width: 768px) {
            .chat-support-container {
              padding: 10px;
            }

            .card {
              padding: 20px;
            }

            .header {
              justify-content: center;
            }

            .title {
              font-size: 20px;
            }

            .tab {
              font-size: 13px;
              padding: 10px;
              flex: 1 1 100%;
            }

            .submit-button {
              font-size: 15px;
              padding: 12px;
            }
          }

          @media (max-width: 480px) {
            .card {
              padding: 16px;
              border-radius: 12px;
            }

            .title {
              font-size: 18px;
            }

            .card-title {
              font-size: 18px;
            }

            .input-field {
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ChatPage;
