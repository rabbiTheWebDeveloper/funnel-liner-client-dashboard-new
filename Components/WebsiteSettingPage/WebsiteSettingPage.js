import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab, Tooltip } from "@mui/material";
import Modal from "@mui/material/Modal";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getWebsiteSettings, headers, shopId } from "../../pages/api";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useToast } from "../../hook/useToast";
import CustomDomain from "./CustomDomain";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import HomeSlider from "../MyPage/HomeSlider/HomeSlider";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { useCallback } from "react";
import CommonShippingCost from "./CommonShippingCost";
import BusinessInfo from "./BusinessInfo";
import OrderOtpPermesion from "./Trigger/OrderOtpPermesion";
import PaymentMethod from "./PaymentMethod";
import OrderImagePermesion from "./Trigger/OrderImagePermesion";
import InCompletePermesion from "./Trigger/InCompletePermesion";

const handleTabLink = value => {
  if (value === "1") {
    return "";
  }
  if (value === "3") {
    return {
      video: "https://www.youtube.com/embed/oF2kmS_myYk?si=T8zFVec6VQzE3RQi",
      title: "Before Request Your Custom Domain Must Watch this Video!",
    };
  }
  if (value === "5") {
    return {
      video: "https://www.youtube.com/embed/qxSCcUr0Wfc?si=cs0cotPXXiPM64yP",
      title:
        "How to verify your domain & set up facebook pixel easily with Funnel Liner",
    };
  }
};

const WebsiteSettingPage = ({ response, myAddonsList }) => {
  const [active, setActive] = useState(1);
  const router = useRouter();
  const showToast = useToast();
  const [desc, setDesc] = useState("");
  const [reFatch, setReFatch] = useState(false);
  const [googleTagManager, setGoogleTagManager] = useState({});
  const [checked, setChecked] = useState(true);
  const [invoice, setInvoice] = useState(1);
  const [customDomain, setCustomDomain] = useState("");
  const [websiteSettingsData, setWebsiteSettingData] = useState({});
  const [advancePaymnet, setAdvancePayment] = useState(false);
  const [holdOn, setHoldOn] = useState(false);
  const [shippingDate, setShippingDate] = useState(false);
  const [shippingCost, setShippingCost] = useState(false);
  const [shippingCostData, setShippingCostData] = useState({});
  const [value, setValue] = useState("1");
  const [value2, setValue2] = useState("one");
  const [openPreview, setOpenPreview] = useState(false);
  const handlePreview = () => setOpenPreview(true);
  const previewClose = () => setOpenPreview(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSales, setOpenSales] = useState(false);
  const handleOpenSales = () => setOpenSales(true);
  const handleCloseSales = () => setOpenSales(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [favIcon, setFavicon] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const label = { inputProps: { "aria-label": "Switch demo" } };
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeTab2 = (event, newValue) => {
    setValue2(newValue);
  };
  const handleInvoice = e => {
    setInvoice(e.target.value);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/settings/website/update`,
        {
          invoice_id: e.target.value,
          custom_domain: "customDomain",
          cash_on_delivery: checked === true ? "1" : "0",
        },
        {
          headers: headers,
        }
      )
      .then(function (response) {
        Swal.fire("Setting", `Active invoice ${e.target.value}`);
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.msg,
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });
  };
  const handleCustomDomain = e => {
    setCustomDomain(e.target.value);
  };
  const handleUpdateDomain = () => {
    handleUpdateWebsiteSetting(checked, customDomain).then(result => {});
  };

  //advance payment update by trigger
  const handleSwitchAdvancePayment = event => {
    setAdvancePayment(event.target.checked);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/settings/advance-payment/status/update`,
        { status: event.target.checked ? "1" : "0" },

        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast(
          event.target.checked
            ? "Advance payment  enable"
            : "Advance payment Disable ",
          "success"
        );
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong",
        });
      });
  };
  const handleSwitchHoldOn = event => {
    setHoldOn(event.target.checked);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/settings/hold-on/status/update`,
        { status: event.target.checked ? "1" : "0" },

        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast(
          event.target.checked ? "Hold On  enable" : "Hold On Disable ",
          "success"
        );
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong",
        });
      });
  };
  // shipping date order update by trigger
  const handleSwitchShippingDate = async event => {
    setShippingDate(event.target.checked);
    axios
      .post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.UPDATE_SHIPPING_DATE_STATUS}`,
        { status: event.target.checked ? "1" : "0" },

        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast(
          event.target.checked
            ? "Shipping Date  On  enable"
            : "Shipping Date  On Disable ",
          "success"
        );
        setReFatch(true);
      })
      .catch(function (error) {
        showToast("Something went wrong", "error");
      });
  };
  const handleSwitchCommonShippingCost = async event => {
    setShippingCost(event.target.checked);
    axios
      .post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.UPDATE_COMMON_SHIPPING_COST_STATUS}`,
        { status: event.target.checked ? "1" : "0" },

        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast(
          event.target.checked
            ? "Common Shipping Cost  On  enable"
            : "Common  Shipping Cost  On Disable ",
          "success"
        );
        setReFatch(true);
      })
      .catch(function (error) {
        showToast("Something went wrong", "error");
      });
  };
  const handleFetchShippingStatus = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.ORDER_SHIPPING_DATE_CONFIG}`,
        headers: headers,
      });
      if (data.status) {
        setShippingDate(data?.data?.data?.shipped_date_status);
      }
    } catch (err) {}
  }, []);
  const handleFetchCommonShippingCostStatus = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.GET_COMMON_SHIPPING_COST}`,
        headers: headers,
      });
      if (data.status) {
        setShippingCost(data?.data?.data?.status);
        setShippingCostData(data?.data?.data);
        // console.log(data.data.data);
      }
    } catch (err) {}
  }, [reFatch]);

  useEffect(() => {
    axios
      .get(
        process.env.NEXT_PUBLIC_API_URL +
          "/client/settings/advance-payment/status",
        { headers: headers }
      )
      .then(function (response) {
        if (response.status === 200) {
          setAdvancePayment(response.data.data.advanced_payment);
        }
      })
      .catch(err => {
        return err;
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        process.env.NEXT_PUBLIC_API_URL + "/client/settings/hold-on/status",
        { headers: headers }
      )
      .then(function (response) {
        if (response.status === 200) {
          setHoldOn(response.data.data.hold_on);
        }
      })
      .catch(err => {
        return err;
      });
  }, []);

  useEffect(() => {
    setValue(router?.query?.domain ? router?.query?.domain : "1");
  }, []);

  useEffect(() => {
    getWebsiteSettings()
      .then(result => {
        setWebsiteSettingData(result?.data?.data);
        setInvoice(result?.data?.data?.invoice_id);
      })
      .catch(function (error) {
        if (error.response.data.api_status === "401") {
          window.location.href = "/login";
          Cookies.remove("token");
          localStorage.clear("token");
          Cookies.remove("user");
          localStorage.clear("user");
          window.location.href = "/login";
        }
      });
  }, []);

  useEffect(() => {
    handleFetchShippingStatus();
  }, [handleFetchShippingStatus]);
  useEffect(() => {
    handleFetchCommonShippingCostStatus();
  }, [handleFetchCommonShippingCostStatus]);

  const isAccessOrderOTP =
    Array.isArray(myAddonsList) &&
    myAddonsList.some(addon => addon?.addons_id === 13 && addon?.status === 1);
  return (
    <>
      <section className="DashboardSetting WebsiteSetting">
        {/* header */}
        <HeaderDescription
          order={false}
          headerIcon={"flaticon-coding"}
          title={"Website Settings"}
          subTitle={"Update your shop info and other settings here"}
          search={false}
          videoLink={handleTabLink(active)}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="boxShadow">
            <Box>
              <TabContext value={value}>
                <div className="CommonTab">
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label="Payment Method"
                        value="1"
                        onClick={() => setActive("1")}
                      />
                      <Tab label="Invoice Format" value="2" />
                      <Tab
                        label="Custom Domain"
                        value="3"
                        onClick={() => setActive("3")}
                      />
                      <Tab label="Business Info" value="4" />
                      <Tab label="Shipping Settings" value="5" />
                      <Tab label="Slider and Banner" value="7" />
                    </TabList>
                  </Box>
                </div>

                {/* Payment Method */}
                <TabPanel value="1">
                  <div className="WebsiteSettingPayment boxShadow commonCart cart-1">
                    <div className="left d_flex">
                      <div className="icon">
                        <i className="flaticon-payment-method"></i>
                      </div>
                      <h4>Enable Cash On Delivery</h4>
                    </div>

                    <div className="right">
                      <div>
                        <Switch checked />
                      </div>
                    </div>
                  </div>
                  <div className="WebsiteSettingPayment boxShadow commonCart cart-2">
                    <div className="left d_flex">
                      <div className="icon">
                        <i className="flaticon-wallet"></i>
                      </div>
                      <h4>Enable Advance Payment</h4>
                    </div>

                    <div className="right">
                      <div>
                        <Switch
                          checked={advancePaymnet}
                          onChange={handleSwitchAdvancePayment}
                          color="primary"
                          name="mySwitch"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="WebsiteSettingPayment boxShadow commonCart cart-3">
                    <div className="left d_flex">
                      <div className="icon">
                        <i className="flaticon-stop-sign"></i>
                      </div>
                      <h4>Enable Hold On Service </h4>
                    </div>

                    <div className="right">
                      <div>
                        <Switch
                          checked={holdOn}
                          onChange={handleSwitchHoldOn}
                          color="primary"
                          name="mySwitch"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="WebsiteSettingPayment boxShadow commonCart cart-4">
                    <div className="left d_flex">
                      <div className="icon">
                        <i className="flaticon-express-delivery"></i>
                      </div>
                      <h4>Enable Shipping Date </h4>
                    </div>

                    <div className="right">
                      <div>
                        <Switch
                          checked={shippingDate}
                          onChange={handleSwitchShippingDate}
                          color="primary"
                          name="mySwitch"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="WebsiteSettingPayment boxShadow commonCart cart-5">
                    <div className="left d_flex">
                      <div className="icon">
                        <i className="flaticon-express-delivery"></i>
                      </div>
                      <h4>Enable Common Shipping Cost </h4>
                    </div>

                    <div className="right">
                      <div>
                        <Switch
                          checked={shippingCost}
                          onChange={handleSwitchCommonShippingCost}
                          color="primary"
                          name="mySwitch"
                        />
                      </div>
                    </div>
                  </div>
                  <PaymentMethod />
                  {isAccessOrderOTP && (
                    <OrderOtpPermesion
                      response={response}
                      showToast={showToast}
                    />
                  )}
                  <OrderImagePermesion
                    response={response}
                    showToast={showToast}
                  />
                      <InCompletePermesion
                    response={response}
                    showToast={showToast}
                  />
                </TabPanel>

                {/* Invoice Format */}
                <TabPanel value="2">
                  <div className="InvoiceFormate">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <div className="InvoiceFormateItem boxShadow commonCart cart-3">
                          <div className="img">
                            <img src="/images/modal_invoice.png" alt="" />
                          </div>

                          <div className="duelButton">
                            <Button onClick={handlePreview}>Preview</Button>

                            <Modal
                              open={openPreview}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                              className="updateModal"
                            >
                              <Box className="modalBox">
                                <div className="modalContent">
                                  <div className="header">
                                    <div className="left">
                                      <i className="flaticon-edit"></i>
                                      <h4>Invoice</h4>
                                    </div>

                                    <div
                                      className="right"
                                      onClick={previewClose}
                                    >
                                      <i className="flaticon-close-1"></i>
                                    </div>
                                  </div>

                                  <div className="websiteSettingImg">
                                    <img
                                      src="/images/modal_invoice.png"
                                      alt=""
                                    />
                                  </div>
                                </div>
                              </Box>
                            </Modal>

                            <Button
                              onClick={handleInvoice}
                              value="1"
                              className="red"
                            >
                              Use Invoice
                            </Button>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </TabPanel>

                {/* Custom Domain */}
                <TabPanel value="3">
                  <CustomDomain
                    data={response}
                    shopName={websiteSettingsData?.shop_name}
                  ></CustomDomain>
                </TabPanel>

                <TabPanel value="4">
                  <BusinessInfo websiteSettingsData={websiteSettingsData} />
                </TabPanel>
                <TabPanel value="5">
                  <CommonShippingCost
                    IsHeaderDescription={false}
                    websiteSettingsData={websiteSettingsData}
                    shopId={shopId}
                    shippingCostData={shippingCostData}
                  />
                </TabPanel>
                <TabPanel value="7">
                  <HomeSlider IsHeaderDescription={false} />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
};

export default WebsiteSettingPage;
