import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import { allThemeList, importTheme } from "../../../pages/api";
import { useToast } from "../../../hook/useToast";
import SmallLoader from "../../SmallLoader/SmallLoader";
import { shopId, userId } from "../../../pages/api";

const MultiWebsite = () => {
  const showToast = useToast();
  const router = useRouter();
  // ViewPreviewModel
  const [openPreview, setOpenPreview] = useState(false);
  const handlePreview = () => setOpenPreview(true);
  const previewClose = () => setOpenPreview(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [multiPageTemplate, setMultiPageTemplate] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [webThemeSettings, setWebThemeSettings] = useState(null);
  const [isThemeSettingsLoading, setIsThemeSettingsLoading] = useState(false);
  useEffect(() => {
    const params = { page: currentPage, perPage: perPage };
    allThemeList("multiple", params).then(result => {
      const theme = result?.data?.data.filter(item => {
        return item;
      });
      console.log(theme);
      console.log(result?.data);
      setMultiPageTemplate(result?.data?.data);
      setTotalPage(result.data?.last_page);
    });
  }, [currentPage, perPage]);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      const token = Cookies.get("token");
      if (!token) return;
      setIsThemeSettingsLoading(true);
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.BASE_URL}/client/theme/web-theme-settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "shop-id": shopId,
              id: userId,
            },
          }
        );
        setWebThemeSettings(response?.data?.data ?? response?.data ?? null);
      } catch (error) {
        showToast(
          error?.response?.data?.msg
            ? error?.response?.data?.msg
            : "Failed to load theme settings",
          "error"
        );
      } finally {
        setIsThemeSettingsLoading(false);
      }
    };

    fetchThemeSettings();
  }, []);

  const handleActiveTheme = e => {
    Swal.fire({
      iconHtml: '<img src="/images/import_icon.png">',
      customClass: {
        icon: "no-border",
        border: "0",
      },
      text: "Are you sure you want this theme to go live now?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#894BCA",
      cancelButtonColor: "#d33",
      confirmButtonText: "Okey",
    }).then(result => {
      if (result.isConfirmed) {
        const themeId = e.target.id;
        importTheme("multiple", Number(themeId)).then(res => {
          if (res.status === 200) {
            showToast("Theme activate successfully");
            setSelectedThemeId(themeId);
            if (router.query.redirect_from === "panel3") {
              router.push("/?current_steap=panel4");
            }
          } else {
            showToast("Something went wrong", "error");
          }
        });
      }
    });
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };
  return (
    <>
      <section className="LandingWebsite">
        {multiPageTemplate.length === 0 && <SmallLoader />}
        {/* header */}
        <HeaderDescription
          videoLink={
            "https://www.youtube.com/embed/ExoVAA15ad0?si=_-r8cd9WDyf5xff0"
          }
          order={false}
          headerIcon={"flaticon-website-design"}
          title={"Multiple Page Template"}
          subTitle={"choose your theme here and customize as you want"}
          search={false}
        />
        <Container maxWidth="sm">
          <Grid Container spacing={3}>
            {/* LandingWebsite */}
            <div className="LandingWebsiteContent">
              <Grid container spacing={3}>
                {multiPageTemplate?.map((item, index) => {
                  return (
                    <Grid item key={index} xs={12} sm={6} md={3}>
                      <div
                        className="LandingWebsiteItem boxShadow"
                        style={{
                          paddingLeft: 16,
                          paddingRight: 24,
                          paddingTop: 16,
                          paddingBottom: 16,
                          borderRadius: 10,
                          border:
                            selectedThemeId === item.id
                              ? "2px solid #00a651"
                              : "1px solid #e0e0e0",
                          boxShadow:
                            selectedThemeId === item.id
                              ? "0 10px 24px rgba(0, 166, 81, 0.2)"
                              : "0 6px 16px rgba(0, 0, 0, 0.08)",
                          background:
                            selectedThemeId === item.id ? "#f4fff7" : "#fff",
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            selectedThemeId === item.id
                              ? "0 12px 26px rgba(0, 166, 81, 0.25)"
                              : "0 10px 22px rgba(0, 0, 0, 0.12)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            selectedThemeId === item.id
                              ? "0 10px 24px rgba(0, 166, 81, 0.2)"
                              : "0 6px 16px rgba(0, 0, 0, 0.08)";
                        }}
                      >
                        <div
                          className="img"
                          style={{ marginBottom: 8, border: "none" }}
                        >
                          <img
                            src={item?.media}
                            alt=""
                            style={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "none",
                            }}
                          />
                          <h4 style={{ fontSize: 13.5, margin: "6px 0 0" }}>
                            {item?.name}
                          </h4>
                        </div>

                        <div
                          className="DuelButton d_flex d_justify"
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            gap: "8px",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <div
                            className="left"
                            style={{ flex: 1, minWidth: 0 }}
                          >
                            <a
                              target="_blank"
                              href={item?.url}
                              rel="noopener noreferrer"
                              style={{ width: "100%", display: "block" }}
                            >
                              <Button fullWidth size="small">
                                Preview
                              </Button>
                            </a>

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

                          <div
                            className="right"
                            style={{ flex: 1, minWidth: 0 }}
                          >
                            <Button
                              fullWidth
                              size="small"
                              onClick={handleActiveTheme}
                              id={item.id}
                            >
                              Import
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </Grid>
          {multiPageTemplate.length >= 10 && (
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
                    <Select
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
                    </Select>
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
          )}
        </Container>
      </section>
    </>
  );
};

export default MultiWebsite;
