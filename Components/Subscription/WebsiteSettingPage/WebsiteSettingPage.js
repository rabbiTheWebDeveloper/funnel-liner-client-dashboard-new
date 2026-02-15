import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab } from "@mui/material";
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
import FacebookPixel from "./FacebookPixel";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import HomeSlider from "../MyPage/HomeSlider/HomeSlider";
import DomainVerification from "./DomainVerification";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { useCallback } from "react";
import GoogleAnalytics from "./GoogleAnalytics";
import GoogleTagManager from "./GoogleTagManager";

const WebsiteSettingPage = ({ response }) => {
  const [active, setActive] = useState(1);
  const router = useRouter();
  const showToast = useToast();
  const [desc, setDesc] = useState("");
  const [reFatch, setReFatch] = useState(false);
  const [googleTagManager, setGoogleTagManager] = useState({});
  // Tabs
  const [value, setValue] = useState("1");
  useEffect(() => {
    setValue(router?.query?.domain ? router?.query?.domain : "1");
  }, []);
  // domain
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const [value2, setValue2] = useState("one");
  const handleChangeTab2 = (event, newValue) => {
    setValue2(newValue);
  };
  // Togol Switch
  const label = { inputProps: { "aria-label": "Switch demo" } };
  // ViewPreview
  const [openPreview, setOpenPreview] = useState(false);
  const handlePreview = () => setOpenPreview(true);
  const previewClose = () => setOpenPreview(false);

  const [selectedImage, setSelectedImage] = useState(null);

  // DropDown Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [checked, setChecked] = useState(true);
  const [invoice, setInvoice] = useState(1);
  const [customDomain, setCustomDomain] = useState("");
  const [websiteSettingsData, setWebsiteSettingData] = useState({});
  const [advancePaymnet, setAdvancePayment] = useState(false);
  const [holdOn, setHoldOn] = useState(false);
  const [shippingDate, setShippingDate] = useState(false);

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
    handleUpdateWebsiteSetting(checked, customDomain).then(result => { });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = data => {
    const formData = new FormData();
    formData.append("shop_name", data.shopName);
    formData.append("shop_address", data.shopAddress);
    if (selectedImage !== null) {
      formData.append("shop_logo", selectedImage);
    }
    // if (favIcon !== null) {
    //     formData.append("shop_favicon", favIcon);
    // }
    formData.append("shop_id", shopId);
    formData.append("shop_meta_title", data.websiteTitle);
    formData.append("shop_meta_description", data.description);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append(
      "default_delivery_location",
      data.default_delivery_location
    );

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/settings/business-info/update`,
        formData,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        Swal.fire("Setting", response.data.msg, "success");
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong !",
        });
      });
  };

  const [openSales, setOpenSales] = useState(false);
  const handleOpenSales = () => setOpenSales(true);
  const handleCloseSales = () => setOpenSales(false);

  const [imageUrl, setImageUrl] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

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
    } catch (err) { }
  }, []);

  const handleFetchGoogleTagManager = useCallback(async () => {
    try {
      if (active === "8" || active === "9") {
        let data = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.GET_GOOGLE_TAG_MANAGER}`,
          headers: headers,
        });
        if (data.status) {
          setGoogleTagManager(data?.data?.data);
        }
      }
    } catch (err) { }
  }, [active]);
  useEffect(() => {
    handleFetchShippingStatus();
  }, [handleFetchShippingStatus]);

  useEffect(() => {
    handleFetchGoogleTagManager();
  }, [handleFetchGoogleTagManager]);

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

  const handleTabLink = (value) => {
    if (value === '1') {
      return "";
    }
    if (value === '3') {
      return {
        video: "https://www.youtube.com/embed/oF2kmS_myYk?si=T8zFVec6VQzE3RQi",
        title: "Before Request Your Custom Domain Must Watch this Video!"
      };
    }
    if (value === '5') {
      return {
        video: "https://www.youtube.com/embed/qxSCcUr0Wfc?si=cs0cotPXXiPM64yP",
        title: "How to verify your domain & set up facebook pixel easily with Funnel Liner"
      };
    }
  }

  console.log("googleTagManager", googleTagManager);
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
                      <Tab label="Payment Method" value="1" onClick={() => setActive('1')} />
                      <Tab label="Invoice Format" value="2" />
                      <Tab label="Custom Domain" value="3" onClick={() => setActive('3')} />
                      <Tab label="Business Info" value="4" />
                      <Tab label="Slider and Banner" value="7" />
                      <Tab label="Domain Verification" value="6" onClick={() => setActive('5')} />
                      <Tab label="Facebook Pixel" value="5" onClick={() => setActive('5')} />
                      <Tab label="Google Tag Manager" value="9" onClick={() => setActive('9')} />
                      <Tab label="Google Analytics" value="8" onClick={() => setActive('8')} />

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
                  <div className="WebsiteSettingPayment boxShadow commonCart cart-4">
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
                  <div className="DashboardTabsItem">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="BusinessInfo">
                        <div className="BusinessInfoItem">
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                              <h4>Shop Info</h4>
                              <p>Update your shop info and other settings</p>

                              <div className="customInput">
                                <label>Shop Name</label>
                                <input
                                  type="text"
                                  {...register("shopName")}
                                  value={websiteSettingsData?.name}
                                  InputProps={{
                                    readOnly: true,
                                    disableUnderline: true,
                                  }}
                                  disabled
                                />
                              </div>

                              <div className="customInput">
                                <label>Shop Address</label>
                                <input
                                  type="text"
                                  {...register("shopAddress")}
                                  defaultValue={websiteSettingsData?.address}
                                />
                              </div>

                              <div className="customInput">
                                <label>Business Email</label>
                                <input
                                  type="text"
                                  {...register("email")}
                                  defaultValue={websiteSettingsData?.email}
                                />
                              </div>

                              <div className="customInput">
                                <label>Phone</label>
                                <input
                                  type="text"
                                  {...register("phone")}
                                  defaultValue={websiteSettingsData?.phone}
                                />
                              </div>
                              <div className="customInput">
                                <label>Default Delivery location </label>
                                <input
                                  name="default_delivery_location"
                                  type="text"
                                  {...register("default_delivery_location")}
                                  defaultValue={
                                    websiteSettingsData?.default_delivery_location
                                  }
                                  placeholder="default delivery location "
                                />
                              </div>
                            </Grid>
                          </Grid>
                        </div>

                        <div className="BusinessInfoItem SupportTicketItem">
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                              <h4>Company Logo</h4>

                              <div className="customInput">
                                <label>
                                  Attach File (Optional){" "}
                                  <span>
                                    Image must be a file of type: png, jpg, jpeg
                                  </span>
                                </label>
                                <p></p>

                                <div className="imgUploader">
                                  <input
                                    accept="image/*"
                                    type="file"
                                    id="select-image"
                                    style={{ display: "none" }}
                                    onChange={e =>
                                      setSelectedImage(e.target.files[0])
                                    }
                                  />

                                  <label htmlFor="select-image">
                                    <Button
                                      className="SelectImgButton"
                                      variant="contained"
                                      color="primary"
                                      component="span"
                                    >
                                      Upload Image
                                    </Button>
                                  </label>
                                  {imageUrl && selectedImage && (
                                    <Box mt={2} textAlign="center">
                                      <h6>Image Preview:</h6>
                                      <img
                                        src={imageUrl}
                                        alt={selectedImage.name}
                                        Height="100px"
                                      />
                                    </Box>
                                  )}
                                  {imageUrl && selectedImage ? (
                                    ""
                                  ) : (
                                    <Box mt={2} textAlign="center">
                                      <h6>Image Preview:</h6>
                                      <img
                                        src={websiteSettingsData?.shop_logo}
                                        alt={""}
                                        Height="100px"
                                      />
                                    </Box>
                                  )}
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </div>

                        {/* <div className="BusinessInfoItem SupportTicketItem">
                                                    <Grid container spacing={3}>

                                                        <Grid item xs={12} sm={12}>

                                                            <h4>Favicon </h4>


                                                            <div className="customInput">

                                                                <div className="imgUploader">

                                                                    <label>Image Size: <span>(Width: 100px, Height: 100px)</span></label>

                                                                    <input
                                                                        accept="image/*"
                                                                        type="file"
                                                                        id="favicon"
                                                                        style={{ display: "none" }}

                                                                        onChange={(e) =>
                                                                            setFavicon(e.target.files[0])
                                                                        }
                                                                    />

                                                                    <label htmlFor="select-image">
                                                                        <Button className="SelectImgButton" variant="contained" color="primary" component="span">
                                                                            Upload Favicon
                                                                        </Button>
                                                                    </label>
                                                                    {faviconPreview && favIcon && (

                                                                        <Box mt={2} textAlign="center">

                                                                            <h6>Image Preview:</h6>
                                                                            <img
                                                                                src={faviconPreview}
                                                                                alt={favIcon.name}
                                                                                Height="100px"
                                                                            />
                                                                        </Box>
                                                                    )}

                                                                    {faviconPreview && favIcon ? "":(

                                                                        <Box mt={2} textAlign="center">

                                                                            <h6>Image Preview:</h6>
                                                                            <img
                                                                                src={faviconPreview}
                                                                                alt={favIcon.name}
                                                                                Height="100px"
                                                                            />
                                                                        </Box>
                                                                    )}
                                                                </div>

                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </div> */}

                        <div className="BusinessInfoItem SupportTicketItem">
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                              <h4>Shop Info</h4>
                              <p>This will be displayed on your shop profile</p>
                              <div className="customInput">
                                <label>Shop ID</label>
                                <input
                                  type="text"
                                  InputProps={{ readOnly: true }}
                                  {...register("shopID")}
                                  defaultValue={shopId}
                                />
                              </div>
                            </Grid>
                          </Grid>
                        </div>

                        <div className="BusinessInfoItem SupportTicketItem">
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                              <h4>Meta Description</h4>
                              <p>This will be displayed on your shop profile</p>
                              <div className="customInput">
                                <label>Website Title</label>
                                <input
                                  type="text"
                                  {...register("websiteTitle")}
                                  defaultValue={
                                    websiteSettingsData?.shop_meta_title
                                  }
                                />
                              </div>

                              <div className="customInput">
                                <label>Description</label>
                                <input
                                  type="text"
                                  {...register("shop_meta_description")}
                                  onChange={newValue =>
                                    setDesc(newValue.target.value)
                                  }
                                  value={desc}
                                />
                              </div>
                            </Grid>
                          </Grid>
                        </div>

                        <div className="duelButton">
                          <Button type="submit">Update</Button>
                          <Button className="red">Reset</Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </TabPanel>

                {/* Facebook Pixel */}
                <TabPanel value="5">
                  <FacebookPixel
                    shopName={websiteSettingsData?.shop_name}
                    response={response}
                  ></FacebookPixel>
                </TabPanel>

                {/* GoogleAnalytics */}
                <TabPanel value="8">
                  <GoogleAnalytics
                    shopName={websiteSettingsData?.shop_name}
                    response={response}
                    googleTagManager={googleTagManager}
                  />
                </TabPanel>
                {/* GoogleTagManager */}
                <TabPanel value="9">
                  <GoogleTagManager
                    shopName={websiteSettingsData?.shop_name}
                    response={response}
                    googleTagManager={googleTagManager}
                  />
                </TabPanel>

                {/* doment verify  */}

                <TabPanel value="6">
                  <DomainVerification
                    data={response}
                    shopName={websiteSettingsData?.shop_name}
                  ></DomainVerification>
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
