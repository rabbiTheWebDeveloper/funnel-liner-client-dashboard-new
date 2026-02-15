import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import { Container } from "@mui/system";

import axios from "axios";
import { detect } from "detect-browser";
import Cookies from "js-cookie";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { headers, shopId } from "../../../pages/api";
import { setActiveTab } from "../../../redux/features/dropDownSlice/dropdownSlice";
import ShortNotification from "./ShortNotification";
import { Modal } from "@mui/material";
import { useRef } from "react";
import style from "./style.module.css";

const publicIp = require("react-public-ip");

const Menubar = ({ busInfo, myAddonsList, pendingOrderCount }) => {
  const dispatch = useDispatch();
  const { id } = busInfo || {};
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Perform localStorage action
    let token = localStorage.getItem("token");

    setToken(token);
  }, []);

  const browser = detect();
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("Skip_status");
    router.push("/login");
    const ipAddress = publicIp.v4() || "";
    const browserName =
      browser.name === "chrome" ? "Google Chrome" : browser.name;
    let logoutHeaders = {
      ...headers,
      ipaddress: ipAddress,
      browsername: browserName,
    };
    window.location.href = "/login";
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/logout", {
        headers: logoutHeaders,
      })
      .then(response => {
        if (response.status === 200) {
          Cookies.remove("token");
          Cookies.remove("Skip_status");
          Cookies.remove("domain_request");

          Cookies.remove();
          window.location.href = "/login";
          router.push("/login");
        }
      });
    Cookies.remove("token");
  };

  // set read

  //dispatch call when dropdown change
  const handleDropdownChange = (value, popupState) => {
    popupState.close();
    dispatch(setActiveTab(value));
    handelNotify();
    // notificationRead()
  };

  const [notifyFac, setNotifyfac] = useState(false);

  const handelNotify = () => {
    setNotifyfac(true);
  };

  const [data, setData] = useState([]);
  const notification = () => {
    const orderBody = {
      notify_id: id,
      type: "order",
    };
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + `/client/notifications-show`,
        orderBody,
        {
          headers: headers,
        }
      )
      .then(function (res) {
        setData(res.data.data);
      })
      .catch(error => {});
    // setNotifyfac(false)
  };
  useEffect(() => {
    notification();
    // setNotifyfac(false)
  }, [id, notifyFac]);

  const unread = () => {
    const newdata =
      data.length > 0 && Array.isArray(data)
        ? data.filter(data => data.read === null)
        : [];
    return newdata.length;
  };
  // Sidebar All work
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState({
    product: false,
    stock: false,
    template: false,
    myPage: false,
    account: false,
    courier: false,
    wp: false,
  });
  const [isInsideLongSidebar, setIsInsideLongSidebar] = useState(false);
  const componentRef = useRef(null);

  const handleClickOutside = event => {
    if (
      !isInsideLongSidebar &&
      componentRef.current &&
      !componentRef.current.contains(event.target)
    ) {
      setOpenSidebar(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isInsideLongSidebar]);

  const handleClickSubmenu = submenuName => {
    setOpenSubmenu(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === submenuName ? !prevState[key] : false;
        return acc;
      }, {}),
    }));
    setOpenSidebar(true);
  };
  const handleToggle = () => {
    setOpenSidebar(prevState => !prevState);
  };

  const handleLongSidebarClick = () => {
    setIsInsideLongSidebar(true);
    setTimeout(() => {
      setIsInsideLongSidebar(false);
    }, 0);
  };

  const notificationRead = id => {
    const orderBody = {
      notify_id: id,
      type: "order",
    };
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + `/client/notifications-read`,
        orderBody,
        {
          headers: headers,
        }
      )
      .then(function (res) {
        handelNotify();
        // setData(res.data.data)
      })
      .catch(error => {});

    // setNotifyfac(false)
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div
        onClick={handleLongSidebarClick}
        ref={componentRef}
        className={openSidebar ? "LongSidebar Sidebar" : "Sidebar"}
      >
        {/* logo */}
        <div className="Logo">
          <Link href="/">
            {busInfo?.shop_logo ? (
              <img className="ShortLogo" src={busInfo?.shop_logo} alt="" />
            ) : (
              <i className="flaticon-user"></i>
            )}
          </Link>
          <h4 className="side_bar_shop_name">
            {busInfo?.name === undefined && (
              <Skeleton variant="rounded" width={130} height={30} />
            )}
            {openSidebar && busInfo?.name !== undefined && busInfo?.name}
            {openSidebar !== true &&
              busInfo?.name !== undefined &&
              busInfo?.name?.slice(0, 6) + "..."}
          </h4>

          <p>
            {busInfo?.shop_id ? (
              `ID ${busInfo?.shop_id}`
            ) : (
              <Skeleton variant="rounded" width={130} height={30} />
            )}
          </p>
        </div>

        {/* SideMenu */}
        <div className="SidebarMenu">
          <ul>
            {/* Dashboard */}
            <li className={router.pathname === "/" ? "active" : ""}>
              <Tooltip title="Dashboard" placement="right">
                <Link href="/">
                  {" "}
                  <i className="flaticon-home-2"></i> <span> Dashboard </span>{" "}
                </Link>
              </Tooltip>
            </li>

            {/* Order */}
            <li className={router.pathname === "/order" ? "active" : ""}>
              <Tooltip title="Order" placement="right">
                <Link href="/order">
                  {" "}
                  <i className="flaticon-sent"></i> <span> Order </span>{" "}
                </Link>
              </Tooltip>
            </li>

            {/* Products */}
            <li
              className={
                (openSubmenu.product && router.pathname === "/product") ||
                (openSubmenu.product && router.pathname === "/category-list") ||
                (openSubmenu.product && router.pathname === "/sub-category-list") ||
                (openSubmenu.product && router.pathname === "/ad-campaign")
                  ? "active"
                  : ""
              }
            >
              <Tooltip title="Products" placement="right">
                <h6 onClick={() => handleClickSubmenu("product")}>
                  {" "}
                  <i className="flaticon-product"></i> <span> Products </span>{" "}
                </h6>
              </Tooltip>

              {openSubmenu.product && (
                <ul className="Submenu">
                  <li>
                    <Link
                      href="/product"
                      className={router.pathname === "/product" ? "active" : ""}
                    >
                      Product
                    </Link>
                    <Link
                      href="/category-list"
                      className={
                        router.pathname === "/category-list" ? "active" : ""
                      }
                    >
                      Category
                    </Link>
                    <Link
                      href="/sub-category-list"
                      className={
                        router.pathname === "/sub-category-list" ? "active" : ""
                      }
                    >
                      Sub Category
                    </Link>
                    <Link
                      href="/ad-campaign"
                      className={
                        router.pathname === "/ad-campaign" ? "active" : ""
                      }
                    >
                      Ad Campaign
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Templates */}
            <li
              className={
                router.pathname === "/landing-page" ||
                router.pathname === "/multi-page"
                  ? "active"
                  : ""
              }
            >
              <Tooltip title="Templates" placement="right">
                <h6 onClick={() => handleClickSubmenu("template")}>
                  {" "}
                  <i className="flaticon-website-design"></i>{" "}
                  <span> Templates </span>{" "}
                </h6>
              </Tooltip>

              {openSubmenu.template && (
                <ul className="Submenu">
                  <li>
                    <Link
                      href="/landing-page"
                      className={
                        router.pathname === "/landing-page" ? "active" : ""
                      }
                    >
                      Landing Page
                    </Link>
                    <Link
                      href="/multi-page"
                      className={
                        router.pathname === "/multi-page" ? "active" : ""
                      }
                    >
                      Multi Page
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* My Page */}
            <li
              className={
                router.pathname === "/myLandingPage" ||
                router.pathname === "/myMultiWebsite" ||
                router.pathname === "/web-pages" ||
                router.pathname === "/home-slider" ||
                router.pathname === "/about-us" ||
                router.pathname === "/manage-shop" ||
                router.pathname === "/terms-and-condition" ||
                router.pathname === "/privacy-policy"
                  ? "active"
                  : ""
              }
            >
              <Tooltip title="My Page" placement="right">
                <h6 onClick={() => handleClickSubmenu("myPage")}>
                  {" "}
                  <i className="flaticon-page"></i> <span> My Page </span>{" "}
                </h6>
              </Tooltip>

              {openSubmenu.myPage && (
                <ul className="Submenu">
                  <li>
                    <Link
                      href="/manage-shop"
                      className={
                        router.pathname === "/manage-shop" ? "active" : ""
                      }
                    >
                      Manage Shop
                    </Link>
                    <Link
                      href="/myLandingPage"
                      className={
                        router.pathname === "/myLandingPage" ? "active" : ""
                      }
                    >
                      Landing Page
                    </Link>
                    <Link
                      href="/myMultiWebsite"
                      className={
                        router.pathname === "/myMultiWebsite" ? "active" : ""
                      }
                    >
                      Multi Page
                    </Link>
                    <Link
                      href="/web-pages"
                      className={
                        router.pathname === "/web-pages" ? "active" : ""
                      }
                    >
                      Pages
                    </Link>
                    <Link
                      href="/home-slider"
                      className={
                        router.pathname === "/multi-page" ? "active" : ""
                      }
                    >
                      All Slider
                    </Link>
                    <Link
                      href="/about-us"
                      className={
                        router.pathname === "/about-us" ? "active" : ""
                      }
                    >
                      About us
                    </Link>
                    <Link
                      href="/terms-and-condition"
                      className={
                        router.pathname === "/terms-and-condition"
                          ? "active"
                          : ""
                      }
                    >
                      Terms & Condition
                    </Link>
                    <Link
                      href="/privacy-policy"
                      className={
                        router.pathname === "/privacy-policy" ? "active" : ""
                      }
                    >
                      Privacy & policy
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Accounting Modules */}
            {Array.isArray(myAddonsList)
              ? myAddonsList?.map((addon, index) => {
                  return (
                    addon?.addons_id === 16 &&
                    addon?.status === 1 && (
                      <li
                        key={addon.id}
                        className={
                          router.pathname === "/account-dashboard" ||
                          router.pathname === "/account-report"
                            ? "active"
                            : ""
                        }
                      >
                        <Tooltip title="Accounting Modules" placement="right">
                          <h6 onClick={() => handleClickSubmenu("account")}>
                            {" "}
                            <i className="flaticon-cash-on-delivery"></i>{" "}
                            <span> Accounting Modules </span>{" "}
                          </h6>
                        </Tooltip>

                        {openSubmenu.account && (
                          <ul className="Submenu">
                            <li>
                              <Link
                                href="/account-dashboard"
                                className={
                                  router.pathname === "/account-dashboard"
                                    ? "active"
                                    : ""
                                }
                              >
                                Dashboard
                              </Link>
                              <Link
                                href="/account-report"
                                className={
                                  router.pathname === "/account-report"
                                    ? "active"
                                    : ""
                                }
                              >
                                Report
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                    )
                  );
                })
              : null}

            {/* Stock */}
              <li
              className={
                router.pathname === "/inventory" ||
                router.pathname === "/stockin" ||
                router.pathname === "/product-return" 
                  ? "active"
                  : ""
              }
            >
              <Tooltip title="Stock" placement="right">
                <h6 onClick={() => handleClickSubmenu("stock")}>
                  {" "}
                  <i className="flaticon-in-stock-1"></i> <span> Stock </span>{" "}
                </h6>
              </Tooltip>

              {openSubmenu.stock && (
                <ul className="Submenu">
                  <li>
                    <Link
                      href="/inventory"
                      className={
                        router.pathname === "/inventory" ? "active" : ""
                      }
                    >
                      Inventory
                    </Link>
                    <Link
                      href="/stockin"
                      className={router.pathname === "/stockin" ? "active" : ""}
                    >
                      Stock In
                    </Link>
                    <Link
                      href="/product-return"
                      className={
                        router.pathname === "/product-return" ? "active" : ""
                      }
                    >
                      Product Return
                    </Link>
                 
                  </li>
                </ul>
              )}
            </li>

            {/* Marketing Tools */}
            <li
              className={router.pathname === "/marketing-tools" ? "active" : ""}
            >
              <Tooltip title="Marketing Tools" placement="right">
                <Link href="/marketing-tools">
                  {" "}
                  <i className="flaticon-stock-market"></i>{" "}
                  <span>Marketing Tools</span>{" "}
                </Link>
              </Tooltip>
            </li>

            {/* Bulk SMS */}
            <li className={router.pathname === "/bulk-sms" ? "active" : ""}>
              <Tooltip title="Bulk SMS" placement="right">
                <Link href="/bulk-sms">
                  {" "}
                  <i className="flaticon-mail"></i> <span> Bulk SMS </span>{" "}
                </Link>
              </Tooltip>
            </li>

            {/* Customers */}
            <li
              className={router.pathname === "/customer-list" ? "active" : ""}
            >
              <Tooltip title="Customers" placement="right">
                <Link href="/customer-list">
                  {" "}
                  <i className="flaticon-people"></i> <span> Customers </span>{" "}
                </Link>
              </Tooltip>
            </li>

            {/* Courier */}
            <li
              className={
                router.pathname === "/courier" ||
                router.pathname === "/courier/dashboard"
                  ? "active"
                  : ""
              }
            >
              <Tooltip title="Courier" placement="right">
                <h6 onClick={() => handleClickSubmenu("courier")}>
                  <i className="flaticon-express-delivery"></i>{" "}
                  <span> Courier </span>{" "}
                </h6>
              </Tooltip>
              {openSubmenu.courier && (
                <ul className="Submenu">
                  <li>
                    <Link
                      href="/courier"
                      className={
                        router.pathname === "/inventory" ? "active" : ""
                      }
                    >
                      Courier
                    </Link>
                    {/* <Link
                      href="/courier/dashboard"
                      className={
                        router.pathname === "/product-return" ? "active" : ""
                      }
                    >
                      Payment Dashboard
                    </Link> */}
                  </li>
                </ul>
              )}
            </li>
            {/* woocommerce  */}
            <li
              className={
                router.pathname === "/wp"
                  ? "active"
                  : ""
              }
            >
              <Tooltip title="Woocommerce" placement="right">
                <h6 onClick={() => handleClickSubmenu("wp")}>
                  <i className="flaticon-wordpress"></i>{" "}
                  <span> Woocommerce </span>{" "}
                </h6>
              </Tooltip>
              {openSubmenu.wp && (
                <ul className="Submenu">
                  <li>
                    <Link
                      href="/wp"
                      className={router.pathname === "/wp" ? "active" : ""}
                    >
                      Woocommerce
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* Website Setting */}
            <li
              className={router.pathname === "/website-setting" ? "active" : ""}
            >
              <Tooltip title="Website Setting" placement="right">
                <Link href="/website-setting">
                  {" "}
                  <i className="flaticon-coding"></i>{" "}
                  <span> Website Setting </span>{" "}
                </Link>
              </Tooltip>
            </li>

            {/* Addons */}
            <li className={router.pathname === "/plug-in" ? "active" : ""}>
              <Tooltip title="Addons" placement="right">
                <Link href="/plug-in">
                  {" "}
                  <i className="flaticon-plugin"></i> <span> Addons </span>{" "}
                </Link>
              </Tooltip>
            </li>

            {/* Support Ticket */}
            {/* <li
              className={router.pathname === "/support-ticket" ? "active" : ""}
            >
              <Tooltip title="Support Ticket" placement="right">
                <Link href="/support-ticket">
                  {" "}
                  <i className="flaticon-customer-support"></i>{" "}
                  <span> Support Ticket </span>{" "}
                </Link>
              </Tooltip>
            </li> */}

            {/* Bkash Merchant */}
            {Array.isArray(myAddonsList)
              ? myAddonsList?.map((addon, index) => {
                  return (
                    addon?.addons_details?.id === 17 &&
                    addon?.addons_details?.status === 1 && (
                      <li
                        key={index}
                        className={
                          router.pathname === "/bkash-marcent" ? "active" : ""
                        }
                      >
                        <Tooltip title="Bkash Merchant" placement="right">
                          <Link href="/bkash-marcent">
                            {" "}
                            <i className="flaticon-people"></i>{" "}
                            <span> Bkash Merchant </span>{" "}
                          </Link>
                        </Tooltip>
                      </li>
                    )
                  );
                })
              : null}

            {/* Subscription */}
            {/* <li className={router.pathname === "/subscription" ? "active" : ""}>

              <Tooltip title="Subscription" placement="right">
                <Link href='/subscription'> <i className="flaticon-subscribe"></i> <span> Subscription </span> </Link>
              </Tooltip>

            </li> */}

            {/* Billing */}
            <li className={router.pathname === "/billing" ? "active" : ""}>
              <Tooltip title="Billing" placement="right">
                <Link href="/billing">
                  {" "}
                  <i className="flaticon-wallet"></i> <span> Billing </span>{" "}
                </Link>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>

      <section className={style.Menubar}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={style.MenubarContent}>
                {/* Left */}
                <div className={style.left}>
                  <div className={style.SideMenu}>
                    <h4>
                      <img
                        ref={componentRef}
                        onClick={handleToggle}
                        src="/images/sidebar.png"
                        alt=""
                      />
                      Dashboard
                    </h4>
                  </div>
                </div>

                {/* Right */}
                <div className={style.right}>
                  <div className={style.changeLogs}>
                    <div className={style.changeLogsBadge}>New</div>
                    <Tooltip
                      title="Changelog of Funnel Liner"
                      placement="bottom"
                    >
                      <Link href="/change-logs">
                        <Button>
                          <div className={style.changeIcon}>
                            <svg viewBox="0 0 24 24">
                              <path
                                d="M7,0h-3C1.79,0,0,1.79,0,4v3c0,2.21,1.79,4,4,4h3c2.21,0,4-1.79,4-4v-3C11,1.79,9.21,0,7,0Zm13,13h-3c-2.21,0-4,1.79-4,4v3c0,2.21,1.79,4,4,4h3c2.21,0,4-1.79,4-4v-3c0-2.21-1.79-4-4-4ZM13,5c0-1.06,.44-2.05,1.25-2.78l2.07-1.95c.4-.38,1.03-.36,1.41,.04,.38,.4,.36,1.04-.04,1.41l-2.08,1.95c-.11,.1-.2,.21-.28,.32h3.67c2.21,0,4,1.79,4,4v2c0,.55-.45,1-1,1s-1-.45-1-1v-2c0-1.1-.9-2-2-2h-3.67c.08,.11,.17,.21,.27,.31l2.09,1.96c.4,.38,.42,1.01,.04,1.41-.2,.21-.46,.31-.73,.31-.25,0-.49-.09-.69-.27l-2.08-1.95c-.79-.73-1.24-1.72-1.24-2.77Zm-2,14c0,1.06-.44,2.04-1.25,2.78l-2.07,1.95c-.19,.18-.44,.27-.69,.27-.27,0-.53-.11-.73-.31-.38-.4-.36-1.04,.04-1.41l2.08-1.95c.11-.1,.2-.21,.28-.32h-3.67c-2.21,0-4-1.79-4-4v-2c0-.55,.45-1,1-1s1,.45,1,1v2c0,1.1,.9,2,2,2h3.67c-.08-.11-.17-.21-.27-.31l-2.09-1.96c-.4-.38-.42-1.01-.04-1.41,.38-.4,1.01-.42,1.41-.04l2.08,1.95c.79,.73,1.24,1.72,1.24,2.77Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        </Button>
                      </Link>
                    </Tooltip>
                  </div>

                  {router.pathname === "/" ? (
                    <div className={style.VideoIcon}>
                      <Tooltip
                        title="A quick overview of Funnel Liner's all in one dashboard tutorial"
                        placement="bottom-start"
                      >
                        <Button onClick={handleOpen}>
                          <i className="flaticon-video-camera"></i>
                        </Button>
                      </Tooltip>
                    </div>
                  ) : null}

                  <div className={style.Notification}>
                    <PopupState variant="popover" popupId="Profile">
                      {popupState => (
                        <>
                          <Button {...bindTrigger(popupState)}>
                            <i
                              onClick={() => notificationRead(id)}
                              className="flaticon-notification"
                            ></i>
                            <h6 onClick={() => notificationRead(id)}>
                              {unread()}
                            </h6>
                          </Button>
                          <Menu
                            {...bindMenu(popupState)}
                            className={style.NotificationContent}
                          >
                            <ShortNotification
                              setNotifyfac={setNotifyfac}
                              popupState={popupState}
                              handleDropdownChange={handleDropdownChange}
                              data={data}
                              unread={unread}
                              id={id}
                              handelNotify={handelNotify}
                            ></ShortNotification>
                          </Menu>
                        </>
                      )}
                    </PopupState>
                  </div>

                  <div className={style.SupportTicket}>
                    <Link href="/support-ticket">
                      <i className="flaticon-customer-support"></i>
                    </Link>
                  </div>

                  <div className={style.Profile}>
                    <PopupState variant="popover" popupId="Profile">
                      {popupState => (
                        <>
                          <Button
                            {...bindTrigger(popupState)}
                            className={style.profileButton}
                          >
                            <div className={style.img} id="resources-button">
                              {busInfo?.shop_logo ? (
                                <img
                                  className="ShortLogo"
                                  src={busInfo?.shop_logo}
                                  alt=""
                                />
                              ) : (
                                <i className="flaticon-user"></i>
                              )}
                            </div>
                          </Button>
                          <Menu
                            {...bindMenu(popupState)}
                            className="ProfileMenu"
                          >
                            <MenuItem
                              onClick={() =>
                                handleDropdownChange("1", popupState)
                              }
                            >
                              <Link href="/dashboard-setting">
                                <i className="flaticon-home-2"></i> Dashboard
                                Settings
                              </Link>
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDropdownChange("2", popupState)
                              }
                            >
                              <Link href="/dashboard-setting">
                                {" "}
                                <i className="flaticon-user-1"></i> Profile
                              </Link>
                            </MenuItem>

                            <MenuItem
                              onClick={() =>
                                handleDropdownChange("3", popupState)
                              }
                            >
                              <Link href="/dashboard-setting">
                                <i className="flaticon-padlock-1"></i> Change
                                Password
                              </Link>
                            </MenuItem>
                            <MenuItem onClick={logout}>
                              <Link className="d_flex" href="/login">
                                <i className="flaticon-logout-2"></i> Logout
                              </Link>
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </PopupState>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      <div className="MobileFooterMenu">
        <ul>
          <li className={router.pathname === "/" ? "active" : ""}>
            <Link href="/">
              {" "}
              <i className="flaticon-home-2"></i>{" "}
            </Link>
          </li>

          <li className={router.pathname === "/order" ? "active" : ""}>
            <Link href="/order">
              {" "}
              <i className="flaticon-express-delivery"></i>
            </Link>
          </li>

          <li className={router.pathname === "/product" ? "active" : ""}>
            <Link href="/product">
              {" "}
              <i className="flaticon-sent"></i>{" "}
            </Link>
          </li>

          <li className={router.pathname === "/myLandingPage" ? "active" : ""}>
            <Link href="/myLandingPage">
              <i className="flaticon-website-design flaticon"></i>
            </Link>
          </li>

          {/* <li className={router.pathname === "/support-ticket" ? "active" : ""}>
            <Link href='/support-ticket'> <i className="flaticon-customer-support"></i> </Link>
          </li>

          <li className={router.pathname === "/website-setting" ? "active" : ""}>
            <Link href='/website-setting'> <i className="flaticon-settings-4"></i>  </Link>
          </li> */}
        </ul>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="viewModal"
      >
        <Box className="modalBox">
          <div className="modalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-video-camera"></i>
                <h4>Watch Video Tutorial</h4>
              </div>

              <div className="right" onClick={handleClose}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>
            <div className={style.youTubeVideo}>
              <iframe
                src="https://www.youtube.com/embed/nAbLjOij8tw?si=j-mFXhum4kMNEAjN"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                autoplay
              ></iframe>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Menubar;