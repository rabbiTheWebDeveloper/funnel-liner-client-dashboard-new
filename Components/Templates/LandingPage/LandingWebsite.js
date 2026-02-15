import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Stack,
  Select as MSelect,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Clipboard from "clipboard";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import Select from "react-select";
import Swal from "sweetalert2";
import { themeUrl } from "../../../constant/constant";
import useLoading from "../../../hook/useLoading";
import { useToast } from "../../../hook/useToast";
import {
  allThemeList,
  domain,
  getWebsiteSettings,
  headers,
  importLandingPage,
  importTheme,
} from "../../../pages/api";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import Spinner from "../../commonSection/Spinner/Spinner";
import SmallLoader from "../../SmallLoader/SmallLoader";
const axios = require("axios");
const domain_request = Cookies.get('domain_request')

const indentifyLink = (status, domain, pageTittle) => {
  if (status === null) {
    return `https://funnelliner.com/${domain}/p/${pageTittle}`;
  } else if (status === "pending") {
    return `https://funnelliner.com/${domain}/p/${pageTittle}`;
  } else if (status === "connected") {
    return `https://${domain_request}/p/${pageTittle}`;
  }
};

const LandingWebsite = ({ busInfo }) => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const showToast = useToast();
  const [pageTittle, setPageTittle] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [landingId, setLandingId] = useState(null);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [product_id, setProductID] = useState();
  const [videoLink, setVideoLink] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const handleChangeItem = e => {
    setProductID(e.value);
  };
  const handlePreview = () => setOpenPreview(true);
  const previewClose = () => setOpenPreview(false);
  // OpenSales Modal
  const [openSales, setOpenSales] = useState(false);
  const handleOpenSales = e => {
    setLandingId(e.target.id);
    setOpenSales(true);
    setPageTittle("");
  };
  const handleCloseSales = () => setOpenSales(false);
  const [landingPageTemplate, setLandingPageTemplate] = useState([]);
  const [websiteSettingData, setWebsiteSettingData] = useState({});
  //This id add for custom
  const idsToSkip = Array.from({ length: 200 }, (_, i) => (i + 206).toString());

  useEffect(() => {
    const params = { page: currentPage, perPage: perPage };
    startLoading();
    allThemeList("landing", params).then(result => {
      const filteredItems = result?.data?.data.filter(
        item => !idsToSkip.includes(item.name)
      );
      setTotalPage(result.data?.last_page);
      setLandingPageTemplate(filteredItems);
      stopLoading();
    });
    getWebsiteSettings().then(res => {
      setWebsiteSettingData(res?.data?.data);
    });
  }, [currentPage, perPage]);

  const handlePageTitleChange = e => {
    const pageName = e.target.value;
    const page = pageName.replace(/\s/g, "-");
    setPageTittle(page.toLowerCase());
  };

  const handleVideoLink = e => {
    const videoLink = e.target.value;
    setVideoLink(videoLink);
  };

  const handleImportTheme = event => {
    if (pageTittle === undefined) {
      showToast("Page title required", "error");
      return;
    } else if (product_id === undefined) {
      showToast("Product required", "error");
      return;
    }
    startLoading();
    importLandingPage(pageTittle, landingId, 1, product_id, videoLink).then(
      res => {
        setOpenSales(false);
        if (res.status === 200) {
          showToast("The page has been created successfully");
          importTheme("landing", landingId).then(res => {
            if (router.query.redirect_from) {
              router.push("/");
            }
            router.push("/myLandingPage");
          });
          stopLoading();
        } else {
          stopLoading();
          Swal.fire({
            title: "Sorry",
            html: "The page title is already taken,<br/> Change page title and try again",
            icon: "error",
            confirmButtonText: "ok",
          });
        }
      }
    );
  };
  const [mas, setMas] = useState("");
  //product fetching and add with theme
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/products-for-search", {
        headers: headers,
      })
      .then(function (response) {
        if (response?.status === 200) {
          setProducts(response.data.data);
        }
      })
      .catch(error => {});
  }, []);
  const handlePaginationClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFetchTemplateSearch = async () => {
    startLoading();
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/themes/landing/page/search/${search}`,
        headers: headers,
      });
      setLandingPageTemplate(data?.data?.data);
      stopLoading();
    } catch (err) {
      stopLoading();
      if (err?.response?.status === 401 || err?.message === "Network Error") {
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }
  };

  useEffect(() => {
    search?.length > 0 && handleFetchTemplateSearch();
  }, [search]);

  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  let options = products.length === 0 ? [] : products?.map(function (item) {
    return { value: item.id, label: item.product_name, };
})
  return (
    <>
      <section className="LandingWebsite">
        {/* header */}
        <HeaderDescription
          videoLink={{
            video:
              "https://www.youtube.com/embed/SaoSRnG_zMU?si=qlmL01i5slAX0WRU",
            title:
              "How to create a high converting landing page with Funnel Liner",
          }}
          order={false}
          headerIcon={"flaticon-website-design"}
          title={"Landing Page Template"}
          setSearch={setSearch}
          subTitle={"choose your theme here and customize as you want"}
          search={true}
        />
        {isLoading && <SmallLoader />}
        <Container maxWidth="sm">
          <Grid Container spacing={3}>
            {/* LandingWebsite */}
            <div className="LandingWebsiteContent">
              <Grid container spacing={3}>
                {/* item */}
                {landingPageTemplate?.map((item, index) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <div className="LandingWebsiteItem boxShadow">
                        <div className="img">
                          <img src={item?.media} alt="" />
                          <h4>{item?.theme_name + "-" + item.name}</h4>
                        </div>
                        <div className="DuelButton d_flex d_justify">
                          <div className="left">
                            <Link href={item?.url} target="_blank">
                              <Button>
                                Preview
                                {/* <a target="_blank" href={item?.url}
                                                                    rel="noopener noreferrer"> Preview</a> */}
                              </Button>
                            </Link>
                            <Modal
                              open={openPreview}
                              onClose={previewClose}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box>
                                <div className="InvoiceModal">
                                  <img src={item?.media} alt="" />
                                </div>
                              </Box>
                            </Modal>
                          </div>

                          <div className="right">
                            <Button
                              id={item.id}
                              className="ModalBtn"
                              onClick={handleOpenSales}
                            >
                              Import
                            </Button>
                            {/* modal */}
                            {landingId == item.id && (
                              <Modal
                                open={openSales}
                                onClose={handleCloseSales}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                className="viewModal"
                              >
                                <Box className="modalBox">
                                  <div className="modalContent">
                                    <div className="header">
                                      <div className="left">
                                        <i className="flaticon-view"></i>
                                        <h4>Add Page</h4>
                                        {/* <p>Add pages for your website</p> */}
                                      </div>

                                      <div
                                        className="right"
                                        onClick={handleCloseSales}
                                      >
                                        <i className="flaticon-close-1"></i>
                                      </div>
                                    </div>

                                    <div className="Form">
                                      <div className="customInput">
                                        <label>Page Title</label>
                                        <input
                                          type="text"
                                          onChange={handlePageTitleChange}
                                        />
                                      </div>

                                      <div className="customInput">
                                        <p className="PageLink">
                                          Page Link:{" "}
                                          <Link
                                            href=""
                                            className="SocialLink"
                                            alt="Copy to clipboard"
                                          >
                                            {indentifyLink(
                                              busInfo?.domain_status,
                                              domain,
                                              pageTittle
                                            )}
                                            <AiOutlineLink />{" "}
                                          </Link>
                                          <p>{mas}</p>
                                        </p>
                                        <div className="customInput">
                                          <label>
                                            Product Name <span>*</span>
                                          </label>
                                          <div className="Dropdown">
                                            {products.length > 0 ? (
                                              <Select
                                                options={options}
                                                onChange={handleChangeItem}
                                              />
                                            ) : (
                                              <div className="text">
                                                <Button>
                                                  <Link href="/add-product">
                                                    Add Products
                                                  </Link>
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="duelButton">
                                          {isLoading ? (
                                            <>
                                              <Button
                                                type="submit"
                                                className="One"
                                                disabled
                                                id={item.id}
                                              >
                                                <Spinner />
                                                Publish
                                              </Button>
                                            </>
                                          ) : (
                                            <Button
                                              onClick={handleImportTheme}
                                              id={item.id}
                                              type="submit"
                                              className="One"
                                            >
                                              Publish
                                            </Button>
                                          )}
                                          {/* <Button disabled={isLoading} onClick={handleImportTheme}
                                                                                    id={item.id} type="submit">
                                                                                    {isLoading && <Spinner />}Publish</Button> */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Box>
                              </Modal>
                            )}
                          </div>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>

              <div></div>
            </div>
          </Grid>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              className="DropDown Download "
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "14px" }}>Rows per page</span>

              <div id="per-page-select_order">
                <FormControl
                  variant="outlined"
                  style={{ width: "100px", marginLeft: "10px" }}
                >
                  {/* <InputLabel id="per-page-label">Items per page</InputLabel> */}
                  <MSelect
                    // labelId="per-page-label"
                    id="per-page-select"
                    value={perPage}
                    onChange={handlePerPageChange}
                    // label="Items per page"
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </MSelect>
                </FormControl>
              </div>
            </div>

            <Stack spacing={2}>
              <Pagination
                count={totalPage}
                page={currentPage}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            <div></div>
          </Box>
        </Container>
      </section>
    </>
  );
};

export default LandingWebsite;
