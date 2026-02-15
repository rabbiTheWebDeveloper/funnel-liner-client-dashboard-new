import { TabList, TabPanel } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import { Box, Button, Container, Grid, Modal, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsCheckAll, BsSearch } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { TbPlugConnectedX } from "react-icons/tb";
import { Bars } from "react-loader-spinner";
import SuperFetch from "../../hook/Axios";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";

const Plugin = ({ setFetch }) => {
  const showToast = useToast();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [addonsUpdate, setAddonsUpdate] = useState(false);
  const [addonsList, setAddonsList] = useState([]);
  const handleFetchAddonsList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/addons/addons-list`,
        headers: headers,
      });
      setAddonsList(data?.data?.data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.message === "Network Error") {
        Cookies.remove("token");
        Cookies.remove("user");
        // window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    handleFetchAddonsList();
  }, [addonsUpdate]);

  const [myAddonsList, setMyAddonsList] = useState([]);

  const handleFetchMyAddonsList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/addons/myaddons`,
        headers: headers,
      });

      setMyAddonsList(data?.data?.data);
      setAddonsUpdate(false);
    } catch (err) {
      if (err?.response?.status === 401 || err?.message === "Network Error") {
        Cookies.remove("token");
        Cookies.remove("user");
        // window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    handleFetchMyAddonsList();
  }, [addonsUpdate]);

  //install addons function
  const [isLoading, setIsLoading] = useState(false);
  const [clickedAddonID, setClickedAddonID] = useState();
  const handleInstallAddons = async (addonsID) => {
    setClickedAddonID(addonsID);
    setIsLoading(true);
    try {
      let data = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/addons/install`,
        headers: headers,
        data: {
          addons_id: addonsID,
          status: "0",
        },
      });
      setIsLoading(false);
      showToast("Install success");
      setClickedAddonID();
      setAddonsUpdate(true);
    } catch (err) {
      setIsLoading(false);
      setClickedAddonID();
      if (err?.response?.status === 401 || err?.message === "Network Error") {
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }
  };

  const addonsInstallVerify = (id, addon) => {
    const myAddonButton = Array.isArray(myAddonsList)
      ? myAddonsList.find((a) => a?.addons_details?.id === id)
      : null;
    if (myAddonButton?.addons_details?.id === id) {
      return (
        <Button className="Install">
          Installed <BsCheckAll />
        </Button>
      );
    } else {
      return (
        <Button disabled={isLoading} onClick={() => handleInstallAddons(id)}>
          {setIsLoading && clickedAddonID == id ? (
            <Bars
              height="30"
              width="60"
              radius="9"
              color="#fff"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          ) : (
            "Install Now"
          )}
        </Button>
      );
    }
  };
  const addonsTextBeforeVerifyWithPay = (id, addon) => {
    const myAddonButton = Array.isArray(myAddonsList)
      ? myAddonsList.find((a) => a?.addons_details?.id === id)
      : null;
    if (myAddonButton?.addons_details?.id === id) {
      return null;
    } else {
      return (
        <h5
          style={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "16px",
            marginBottom: "0",
          }}
        >
          One Time Payment
        </h5>
      );
    }
  };
  const addonsInstallVerifyWithPay = (id, addon) => {
    const myAddonButton = Array.isArray(myAddonsList)
      ? myAddonsList.find((a) => a?.addons_details?.id === id)
      : null;
    if (myAddonButton?.addons_details?.id === id) {
      return (
        <Button className="Install">
          Installed <BsCheckAll />
        </Button>
      );
    } else {
      return (
        <Button
          onClick={(e) => {
            setModalOpen(true);
            setPaymentValue(addon?.amount);
            setAddonsId(addon?.id);
          }}
        >
          Pay Now
        </Button>
      );
    }
  };

  const addonsActive = async (id) => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/addons/status-active-inactive/${id}`,
        headers: headers,
      });
      setAddonsUpdate(true);
      setFetch(true);
    } catch (err) {
      if (err?.response?.status === 401 || err?.message === "Network Error") {
        Cookies.remove("token");
        Cookies.remove("user");
        // window.location.href = "/login";
      }
    }
  };

  const addonsUninstall = async (id) => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/addons/uninstall/${id}`,
        headers: headers,
      });
      setAddonsUpdate(true);
      setFetch(true);
    } catch (err) {
      if (err?.response?.status === 401 || err?.message === "Network Error") {
        Cookies.remove("token");
        Cookies.remove("user");
        // window.location.href = "/login";
      }
    }
  };

  const [paymentValue, setPaymentValue] = useState(0);
  const [openModal, setModalOpen] = useState(false);
  const handleCloseNote = () => setModalOpen(false);
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedAddons, setAddonsId] = useState();

  const params = {
    amount: paymentValue,
    order_type: "plugin",
    addons_id: selectedAddons,
  };

  const makePaymentSsl = () => {
    SuperFetch.get("/client/sslcommerze/pay", {
      params: params,
      headers: headers,
    }).then((res) => {
      if (res.data?.success === false) {
        showToast(res.data.message, "error");
      }
      router.push(res.data).then((r) => r);
    });
  };

  const makePaymentBkash = () => {
    SuperFetch.get("/client/bkash/pay", {
      params: params,
      headers: headers,
    }).then((res) => {
      if (res.status === 200) {
        router.push(res.data).then((r) => r);
      }
    });
  };

  const makePaymentNagad = () => {
    SuperFetch.get("/client/nagad/pay", {
      params: params,
      headers: headers,
    }).then((res) => {
      if (res.status === 200) {
        router.push(res.data).then((r) => r);
      }
    });
  };

  const handlePaymentMethod = async (e) => {
    setSelectedPayment(e);
    setModalOpen(false);
    switch (e) {
      case "ssl":
        makePaymentSsl();
        break;
      case "bkash":
        makePaymentBkash();
        break;
      case "nagad":
        makePaymentNagad();
        break;
      default:
        setModalOpen(false);
        makePaymentSsl();
    }
  };

  const [selectedGender, setSelectedGender] = useState("");

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  return (
    <>
      <section className="DashboardSetting Plugin">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-plugin"}
          title={"Addons"}
          subTitle={"Add plugins for extra advantages"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* CourierContent */}
          <div className="AddonsContent">
            <Grid container spacing={3}>
              <Grid item sm={12} md={12}>
                <div className="AddonsTabs">
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <div className="AddonsTabsHeader d_flex d_justify CommonTab">
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab
                            icon={<TbPlugConnectedX />}
                            iconPosition="start"
                            label="All Addons"
                            value="1"
                          />
                          <Tab
                            icon={<MdDashboardCustomize />}
                            iconPosition="start"
                            label="My Addons"
                            value="2"
                          />
                        </TabList>

                        <div className="Search">
                          <input type="text" placeholder="Search addons..." />
                          <div className="searchIcon">
                            <BsSearch />
                          </div>
                        </div>
                      </div>
                    </Box>

                    {/* My Addons */}
                    <TabPanel value="2">
                      <Grid container spacing={3}>
                        {Array.isArray(myAddonsList)
                          ? myAddonsList.map((Addons, index) => {
                            return (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <div
                                  className={`AddonsTabItem boxShadow commonCart ${index == 0 && "cart-1"
                                    } ${index == 1 && "cart-2"} ${index == 2 && "cart-3"
                                    } ${index == 3 && "cart-4"} ${index == 4 && "cart-5"
                                    }`}
                                >
                                  <div
                                    className={
                                      Addons?.addons_details?.payment_type ===
                                        "free"
                                        ? "PainUnpaid Free"
                                        : "PainUnpaid"
                                    }
                                  >
                                    <h5>
                                      {Addons?.addons_details?.payment_type}
                                    </h5>
                                  </div>
                                  <div className="img">
                                    <img
                                      src={Addons?.addons_image_details}
                                      alt={Addons?.addons_details?.name}
                                    />
                                  </div>
                                  <div className="text">
                                    <h4>{Addons?.addons_details?.name}</h4>

                                    <div className="DualButton">
                                      {Addons?.status === 0 ? (
                                        <>
                                          <Button
                                            onClick={() =>
                                              addonsActive(Addons?.id)
                                            }
                                          >
                                            Active
                                          </Button>
                                          <Button
                                            disabled
                                            className="Deactivated"
                                            onClick={() =>
                                              addonsUninstall(Addons.id)
                                            }
                                          >
                                            Uninstall
                                          </Button>
                                        </>
                                      ) : (
                                        <Button
                                          className="Deactivated"
                                          onClick={() =>
                                            addonsActive(Addons?.id)
                                          }
                                        >
                                          Deactivate
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                            );
                          })
                          : null}
                      </Grid>
                    </TabPanel>

                    {/* All Addons */}
                    <TabPanel value="1">
                      <Grid container spacing={3}>
                        {/* item */}

                        {addonsList.length > 0 &&
                          addonsList.map((addon, index) => {
                            return (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <div
                                  className={`AddonsTabItem boxShadow commonCart ${index == 0 && "cart-1"
                                    } ${index == 1 && "cart-2"} ${index == 2 && "cart-3"
                                    } ${index == 3 && "cart-4"} ${index == 4 && "cart-5"
                                    }`}
                                >
                                  <div
                                    className={
                                      addon?.payment_type === "free"
                                        ? "PainUnpaid Free"
                                        : "PainUnpaid"
                                    }
                                  >
                                    <h5>{addon?.payment_type}</h5>
                                  </div>
                                  <div className="img">
                                    <img
                                      src={addon?.addons_image}
                                      alt=""
                                    />
                                  </div>
                                  <div className="text">
                                    <h4>{addon?.name}</h4>
                                    {
                                      addon?.id === 17 &&
                                      <>
                                        <h4>What you will get:</h4>
                                        <ol>
                                          <li>Domain Verification</li>
                                          <li>Pixel Setup</li>
                                          <li>Conversion API Setup</li>
                                        </ol>
                                        <p>
                                          If you would like direct setup support from our team, please consider purchasing this addon. Alternatively, if you prefer to handle the setup yourself, we invite you to follow our tutorial guidelines to configure your account.</p>
                                      </>
                                    }

                                    {addon?.payment_type !== "free"
                                      ? addonsTextBeforeVerifyWithPay(
                                        addon.id,
                                        addon
                                      )
                                      : null}

                                    <h5>{addon?.amount} Tk</h5>
                                    <div className="DualButton">
                                      {addon?.payment_type === "free"
                                        ? addonsInstallVerify(addon?.id, addon)
                                        : addonsInstallVerifyWithPay(
                                          addon.id,
                                          addon
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </TabPanel>
                  </TabContext>
                </div>
              </Grid>
            </Grid>
          </div>
        </Container>

        <Modal
          open={openModal}
          onClose={handleCloseNote}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="updateModal"
        >
          <Box className="modalBox">
            <div className="modalContent">
              <div className="header">
                <div className="left">
                  <i className="flaticon-wallet"></i>
                  <h4>Select Payment Method</h4>
                </div>

                <div className="right" onClick={handleCloseNote}>
                  <i className="flaticon-close-1"></i>
                </div>
              </div>

              <form action="">
                <div className="updateModalForm">
                  <div className="SubscriptionModal">
                    <div className="PaymentType">
                      <label className="card">
                        <input
                          name="plan"
                          className="radio"
                          type="radio"
                          checked={selectedGender === "bkash"}
                          value="bkash"
                          onChange={handleGenderChange}
                        />
                        <img src="/images/payment-img/bkash.png" alt="" />
                      </label>

                      <label className="card">
                        <input
                          name="plan"
                          className="radio"
                          type="radio"
                          checked={selectedGender === "nagad"}
                          value="nagad"
                          onChange={handleGenderChange}
                        />
                        <img src="/images/payment-img/nagod.png" alt="" />
                      </label>

                      {/* <label className="card">
                        <input
                          name="plan"
                          className="radio"
                          type="radio"
                          checked={selectedGender === "ssl"}
                          value="ssl"
                          onChange={handleGenderChange}
                        />
                        <img src="/images/payment-img/visa.png" alt="" />
                      </label> */}
                    </div>

                    <div className="Review">
                      <h6>Review</h6>
                      <div className="SubscribeAmount">
                        <h4>Subscribe Amount</h4>
                        <h3>
                          <i className="flaticon-taka" />
                          {paymentValue}
                        </h3>
                      </div>
                    </div>

                    <div className="terms-condition">
                      <input type="checkbox" id="checkbox" checked />
                      <label for="checkbox">
                        By pressing “Continue” you agree to the{" "}
                        <Link
                          href="https://funnelliner.com/terms"
                          target="/blank"
                        >
                          Terms and Conditions
                        </Link>{" "}
                      </label>
                    </div>

                    <div className="duelButton">
                      <Button
                        onClick={() => handlePaymentMethod(selectedGender)}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Box>
        </Modal>
      </section>
    </>
  );
};

export default Plugin;
