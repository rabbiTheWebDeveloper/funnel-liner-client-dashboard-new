import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../../hook/useToast";
import { shopId, userId } from "../../../pages/api";
// Css
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import UploderNew from "../../edit-theme/UploderNew";
import style from "./style.module.css";
import Banner from "../Banner/Banner";
import useLoading from "../../../hook/useLoading";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import Link from "next/link";
import EditFooter from "../../EditFooter/EditFooter";
import ColorCustomize from "../../ColorCustomize/ColorCustomize";
import FooterAndColor from "../FooterAndColor/FooterAndColor";

const HomeSlider = ({ response, IsHeaderDescription }) => {
  const [isLoading, startLoading, stopLoading] = useLoading();

  const showToast = useToast();
  const [imageData, setImageData] = useState([]);
  const [slider_list, setSlider_list] = useState([]);
  // { file: null, previewURL: '' }
  const [links, setLinks] = useState([]);

  // Tabs
  const [value, setValue] = useState("1");
  const {
    reset,
    formState: { errors },
  } = useForm();

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    // router.push(`/dashboard-setting?pass=${newValue}`)
  };
  const token = Cookies.get("token");

  const fetch_slider = () => {
    axios
      .get(API_ENDPOINTS.BASE_URL + "/client/sliders/index", {
        headers: {
          Authorization: `Bearer ${token}`,
          "shop-id": shopId,
          id: userId,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        setSlider_list(response?.data.data);
      })
      .catch(function (error) {
        return false;
      });
  };
  useEffect(() => {
    fetch_slider();
  }, []);
  const editForm = data => {
    const formData = new FormData();
    if (links && links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        formData.append("link[]", links[i]);
      }
    }
    if (imageData && imageData.length > 0) {
      for (let i = 0; i < imageData.length; i++) {
        formData.append("image[]", imageData[i].file);
      }
    }
    startLoading();
    axios
      .post(API_ENDPOINTS.BASE_URL + "/client/sliders/store", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "shop-id": shopId,
          id: userId,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        stopLoading();
        fetch_slider();
        showToast(response?.data?.msg);
        // setIsLoading(false)
        // setUpdate(true)
      })
      .catch(function (error) {
        stopLoading();
        // setIsLoading(false)
        showToast(
          error?.response?.data?.msg
            ? error?.response?.data?.msg
            : "Something went wrong",
          "error"
        );
      });
    reset();
    setImageData([]);
  };
  function addImageUploader() {
    setImageData(prevImageData => [
      ...prevImageData,
      { file: null, previewURL: "" },
    ]);
  }

  const handleDeleteSlider = slider_id => {
    axios
      .get(API_ENDPOINTS.BASE_URL + "/client/sliders/delete/" + slider_id, {
        headers: {
          Authorization: `Bearer ${token}`,
          "shop-id": shopId,
          id: userId,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        if (response.status) {
          setSlider_list(sliders =>
            sliders.filter(slider => slider.id !== slider_id)
          );
          showToast(response?.data?.msg);
        } else {
          showToast("Something went wrong");
        }
      })
      .catch(function (error) {
        showToast(
          error?.response?.data?.msg
            ? error?.response?.data?.msg
            : "Something went wrong",
          "error"
        );
      });
  };

  return (
    <>
      <section className={style.HomeSlider}>
        {IsHeaderDescription !== false && (
          <HeaderDescription
            headerIcon={"flaticon-page"}
            title={"All Slider"}
            subTitle={"Update your shop info and other settings here"}
            search={false}
            order={false}
          />
        )}

        <Container maxWidth="sm">
          <div className="boxShadow">
            <div className="CommonTab">
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Home Slider" value="1" />
                    </TabList>
                  </Box>

                  {/* Business Information */}
                  <TabPanel value="1">
                    <div className={style.HomeSliderContent}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={12}>
                          {/* item */}
                          <div className={style.customInput}>
                            <label>Photos &amp; Link</label>
                            <br />
                            <label>
                              Image <span className="mustBe">Must be:</span>{" "}
                              (png, jpg, jpeg) ;
                              <span className="mustBe">Recommended size :</span>{" "}
                              (1298px*482px)
                            </label>

                            <div className={style.homeSliderDivMain}>
                              {slider_list?.map((item, index) => (
                                <div
                                  key={item?.id}
                                  className={style.homeSliderDiv}
                                >
                                  <i
                                    onClick={() => handleDeleteSlider(item?.id)}
                                    className="flaticon-close-1"
                                  >
                                    {" "}
                                  </i>
                                  <Link href={item?.link || "#"}>
                                    <img
                                      className={style.homeSlider}
                                      style={{
                                        margin: "0 5px",
                                        borderRadius: "10px",
                                      }}
                                      src={item?.image}
                                    />
                                  </Link>
                                </div>
                              ))}
                            </div>

                            <UploderNew
                              links={links}
                              imageData={imageData}
                              setImageData={setImageData}
                              setLinks={setLinks}
                            ></UploderNew>
                          </div>

                          {/* Add */}
                          <div className={style.Add}>
                            <Button onClick={addImageUploader}>
                              {" "}
                              <i className="flaticon-plus"></i> Add{" "}
                            </Button>
                          </div>

                          {/* Submit */}
                          <div className={style.Submit}>
                            <Button
                              disabled={isLoading}
                              onClick={editForm}
                              className="theme_edit_submit_btn"
                              sx={{ mb: 2 }}
                            >
                              <i className="flaticon-install"></i>Update Slider
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </div>
          <Banner response={response}></Banner>
          {/* <FooterAndColor /> */}
        </Container>
      </section>

      <section className="TopSellingProducts DashboardSetting"></section>
    </>
  );
};

export default HomeSlider;
