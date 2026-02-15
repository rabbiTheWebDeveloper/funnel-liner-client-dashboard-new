import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Skeleton, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import { themeUrl } from "../../constant/constant";
import useConfirmationDialog from "../../hook/useConfirmationDialog";
import { domain, headers } from "../../pages/api";
import Skeletor from "../commonSection/Skeleton/Skeleton";
import useLoading from "../../hook/useLoading";
import TableSkeletor from "../commonSection/TableSkeletor/TableSkeletor";
import SmallLoader from "../SmallLoader/SmallLoader";
import { useToast } from "../../hook/useToast";
import LandingPageDuplicateModal from "./DuplicateModal";

const WebPages = ({ busInfo }) => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const showToast = useToast();
  const [status, setStatus] = useState(false);
  const domain_request = Cookies.get("domain_request");
  const handleConfirmationDialog = useConfirmationDialog(
    "Delete Product?",
    "Are you sure you want to delete?",
    "Yes, delete"
  );
  const [openStock, setOpenStock] = useState(false);
  const handleOpenStock = () => setOpenStock(true);
  const handleStockClose = () => setOpenStock(false);
  const [value, setValue] = useState("1");
  const [openDuplicatePopup, setOpenDuplicatePopup] = useState(false);
  const [duplicateId, setDuplicateId] = useState(null);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  // handleClick Move To Completed
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // handleConfirmed
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const handleConfirmed = event => {
    setAnchorEl2(event.currentTarget);
  };
  const handleCloseConfirmed = () => {
    setAnchorEl2(null);
  };
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const fetchPages = useCallback(() => {
    startLoading();
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/pages", { headers: headers })
      .then(function (response) {
        // handle success
        setProducts(response.data.data);
        stopLoading();
      })
      .catch(function (error) {
        stopLoading();
        return error;
      });

    setStatus(false);
  }, [])

  useEffect(() => {
    fetchPages()
  }, [fetchPages]);
  //   status create
  const data = Cookies.get();
  const mainData = data?.user;
  let parseData;
  if (mainData != null) {
    parseData = JSON.parse(mainData);
  }
  const merchantId = parseData?.id;
  const merchantShopId = parseData?.shop_id;
  const updateDate = {
    user_id: merchantId,
    shop_id: merchantShopId,
  };
  const token = Cookies.get("token");
  const addPageSubmit = data => {
    data.status = "0";
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL +
          `/client/pages?id=${merchantId}&status=0&title=${product.title}&theme=${id}&slug=hello2`,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        Swal.fire("Own Info Add!", response.data.msg, "success");
        setStatus(true);
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });
    reset();
  };

  const duplicatePage = id => {
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + `/client/pages/${id}/duplicate`,
        {},
        {
          headers: headers,
        }
      )
      .then(function (response) {
        Swal.fire(response.data.message, response.data.message, "success");
        setStatus(true);
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          footer: '<a href="">Why do I have this issue?</a>',
        });
      });
  };

  const deleteProduct = async id => {
    const isConfirm = await handleConfirmationDialog();
    if (isConfirm) {
      startLoading();
      axios
        .delete(process.env.NEXT_PUBLIC_API_URL + "/client/pages/" + id, {
          headers: headers,
        })
        .then(function (result) {
          stopLoading();
          // handle success
          if (result.status === 200) {
            showToast(result?.data?.message);
            setProducts(pd => {
              const filter = products.filter(prod => {
                return prod.id !== id;
              });
              return [...filter];
            });
          } else {
          }
        })
        .catch(err => {
          stopLoading();
        });
    }
  };

  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-page"}
          title={"Pages"}
          subTitle={"Pages List"}
          search={false}
          order={false}
        />
        {isLoading && <SmallLoader />}
        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <div className="WebPages d_flex d_justify CommonTab">
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="All Pages" value="1" />
                    </TabList>
                    {/* <Button className='AddNewOrder'> <Link href='/add-new-pages'>Create New
                                            Page</Link> </Button> */}
                  </div>
                </Box>
                {/* All Pages */}
                <TabPanel value="1">
                  <div className="Pending">
                    <div className="Table">
                      <table>
                        <thead>
                          <tr>
                            <th>S/L</th>
                            <th>Page ID</th>
                            <th>Page Title</th>
                            <th>Page Link</th>
                            <th>Creation Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading && <TableSkeletor tableRowLength={7} />}

                          {products?.length > 0 && Array.isArray(products)
                            ? products.map((product, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product?.id}</td>
                                    <td>{product?.title}</td>
                                    <td>
                                      <Link
                                        className="viewActionBtn"
                                        target="_blank"
                                        href={
                                          domain_request !== "null"
                                            ? `https://${domain_request}` +
                                              "/p/" +
                                              product.slug
                                            : `${themeUrl}/${domain}` +
                                              "/p/" +
                                              product.slug
                                        }
                                      >
                                        {domain_request !== "null"
                                          ? `https://${domain_request}` +
                                            "/p/" +
                                            product.slug
                                          : `${themeUrl}/${domain}` +
                                            "/p/" +
                                            product.slug}
                                      </Link>
                                    </td>
                                    <td>
                                      {moment(product.created_at).fromNow()}
                                    </td>
                                    <td className="">
                                      {product.status === 1
                                        ? "Published"
                                        : "Unpublished"}
                                      {/* <Button className={product.status === 1 ? "UpdateStock" : "Unpublished"}>{product.status === 1 ? "Published" : "Unpublished"}</Button> */}
                                    </td>

                                    <td>
                                      <div className="action">
                                        <Link
                                          target="_blank"
                                          href={
                                            `https://editor.funnelliner.com/design.php?sid=` +
                                            product?.shop_id +
                                            "&id=" +
                                            product?.id +
                                            "&uid=" +
                                            product?.user_id +
                                            "&au=" +
                                            `${token}`
                                          }
                                          className="updateActionBtn"
                                        >
                                          Customize
                                        </Link>
                                        <Button
                                          onClick={() =>{
                                            setDuplicateId(product?.id)
                                            setOpenDuplicatePopup(true)
                                          }}
                                          className="updateActionBtn"
                                        >
                                          <i className="flaticon-copy"></i>
                                        </Button>

                                        <Link
                                          className="viewActionBtn"
                                          target="_blank"
                                          href={
                                            domain_request !== "null"
                                              ? `https://${domain_request}` +
                                                "/p/" +
                                                product.slug
                                              : `${themeUrl}/${domain}` +
                                                "/p/" +
                                                product.slug
                                          }
                                        >
                                          <i className="flaticon-view"></i>
                                        </Link>

                                        <Link
                                          className="updateActionBtn"
                                          href={
                                            `/section-customize/` + product.id
                                          }
                                        >
                                          <i className="flaticon-edit"></i>
                                        </Link>

                                        <Button
                                          className="deleteActionBtn"
                                          onClick={() =>
                                            deleteProduct(product.id)
                                          }
                                        >
                                          <i className="flaticon-delete"></i>
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            : null}

                          {isLoading === false && products?.length === 0 && (
                            <tr>
                              <td colSpan={7}>
                                <div className="NullPage">
                                  <img src="/images/empty.png" alt="" />
                                  <h4>
                                    If you create a page, your link will be
                                    immediately added.
                                  </h4>
                                  <Link href="/landing-page" className="bg">
                                    Create Page
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </Container>
      </section>
      {openDuplicatePopup ? (
        <LandingPageDuplicateModal
          openModal={openDuplicatePopup}
          closeModal={() => setOpenDuplicatePopup(false)}
          busInfo={busInfo}
          id={duplicateId}
          fetchPages={fetchPages}
        />
      ) : null}
    </>
  );
};

export default WebPages;
