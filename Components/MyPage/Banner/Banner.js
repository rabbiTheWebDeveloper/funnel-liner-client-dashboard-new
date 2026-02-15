import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../../hook/useToast";
import { shopId, userId } from "../../../pages/api";
// Css
import UploderNew from "../../edit-theme/UploderNew";
import style from './style.module.css';
import useLoading from "../../../hook/useLoading";
import Link from "next/link";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const Banner = ({ response }) => {
    const [isLoading, startLoading, stopLoading] = useLoading();


    const showToast = useToast()
    const [bannerList, setBannerList] = useState([]);
    const [imageData, setImageData] = useState([{ file: null, previewURL: '' }]);
    const [links, setLinks] = useState([]);



    // Tabs
    const [value, setValue] = useState("1");
    const { reset, formState: { errors } } = useForm();
    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
        // router.push(`/dashboard-setting?pass=${newValue}`)
    };
    const token = Cookies.get("token");

    // addons show and hode 

    const fetch_banners = () => {
        axios.get(API_ENDPOINTS.BASE_URL + "/client/banners/index", {
            headers: {
                Authorization: `Bearer ${token}`,
                "shop-id": shopId,
                "id": userId,
                'Content-Type': 'multipart/form-data'
            },
        })
            .then(function (response) {
                setBannerList(response?.data.data)
            })
            .catch(function (error) {
                return false
            });
    }
    useEffect(() => {
        fetch_banners()
    }, [])

    const editForm = (data) => {
        const formData = new FormData();

        if (links && links.length > 0) {
            for (let i = 0; i < links.length; i++) {
                if(links[i] === ''){
                    formData.append("link[]", '#');
                }
                formData.append("link[]", links[i]);
            }
        }
        if (imageData && imageData.length > 0) {
            for (let i = 0; i < imageData.length; i++) {
                formData.append('image[]', imageData[i].file
                );
            }
        }
        startLoading()
        axios.post(API_ENDPOINTS.BASE_URL + "/client/banners/store", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "shop-id": shopId,
                "id": userId,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                if (response.status === 200) {
                    showToast(response?.data?.msg)
                    fetch_banners()
                    stopLoading()
                }
            })
            .catch(function (error) {
                showToast(error?.response?.data?.msg, "error")
                stopLoading()
            });

        reset()
        setImageData([])
    }
    function addImageUploader() {
        setImageData(prevImageData => [...prevImageData, { file: null, previewURL: '' }]);
    }

    const handleDeleteBanner = (banner_id) => {
        axios.get(API_ENDPOINTS.BASE_URL + "/client/banners/delete/" + banner_id, {
            headers: {
                Authorization: `Bearer ${token}`,
                "shop-id": shopId,
                "id": userId,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                setBannerList((banners) => banners.filter((banner) => banner.id !== banner_id))
                showToast(response?.data?.msg)
            })
            .catch(function (error) {
                // setIsLoading(false)
                // showToast(error?.response?.data?.msg ? error?.response?.data?.msg : "Something went wrong", "error")
            });
    }

    return (
        <>

            <section className={style.HomeSlider}>
                {/* <Container maxWidth="sm"> */}
                <div className="boxShadow">
                    <div className="CommonTab">
                        <Box sx={{ width: "100%", typography: "body1" }}>
                            <TabContext value={value}>

                                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                    <TabList
                                        onChange={handleChangeTab}
                                        aria-label="Bussiness"
                                    >
                                        <Tab label="Banner" value="1" />

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
                                                        Image <span className="mustBe">Must be:</span> (png, jpg, jpeg) ;
                                                        <span className="mustBe">Recommended size :</span> (415px*275px)
                                                    </label>

                                                    <div className={style.homeSliderDivMain}>

                                                        {
                                                            bannerList?.map((item, index) => <div key={item?.id} className={style.homeSliderDiv}>
                                                                <i onClick={() => handleDeleteBanner(item?.id)} className="flaticon-close-1" ></i>
                                                                <Link href={item?.link || "#"}>
                                                                    <img className={style.homeSlider} style={{ margin: "0 5px", borderRadius: "2%" }} src={item?.image} />
                                                                </Link>
                                                            </div>)
                                                        }

                                                    </div>

                                                        <UploderNew bannerList={bannerList} links={links} imageData={imageData} setImageData={setImageData} setLinks={setLinks} />
                                                    </div>


                                                {/* Add */}
                                                <div className={style.Add}>
                                                    <Button onClick={addImageUploader}> <i className="flaticon-plus"></i> Add  </Button>
                                                </div>

                                                {/* Submit */}
                                                <div className={style.Submit}>
                                                    <Button disabled={isLoading} onClick={editForm} className="theme_edit_submit_btn" sx={{ mb: 2 }}>
                                                        <i className="flaticon-install"></i> Update Banner
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

                {/* </Container> */}

            </section >

            <section className="TopSellingProducts DashboardSetting">


            </section>
        </>
    );
};

export default Banner;
