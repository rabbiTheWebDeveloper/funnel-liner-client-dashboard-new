import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../hook/useToast";
import { shopId, userId } from "../../pages/api";
import Uplode from "../edit-theme/Uplode";
;

// Css
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import style from './style.module.css';
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const HomeSlider = ({ response }) => {
    const router = useRouter()
    const showToast = useToast()
    const [reviewImage, setReviewImage] = useState([])

    const [user, setUser] = useState(null);
    const [ownInfo, setOwnInfo] = useState({});
    // Filter
    const [age, setAge] = useState("");

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    // Tabs
    const [value, setValue] = useState("1");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
        // router.push(`/dashboard-setting?pass=${newValue}`)
    };
    const token = Cookies.get("token");
    const editForm = (data) => {
        const formData = new FormData();
        if (reviewImage.length > 0) {
            for (let i = 0; i < reviewImage.length; i++) {
                formData.append('image[]', reviewImage[i]);
            }
        }
        // setIsLoading(true)
        axios.post(API_ENDPOINTS.BASE_URL + "/client/sliders", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "shop-id": shopId,
                "id": userId,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                showToast("Banner Image update success")
                // setIsLoading(false)
                // setUpdate(true)
            })
            .catch(function (error) {
                // setIsLoading(false)
                showToast(error?.response?.data?.msg ? error?.response?.data?.msg : "Something went wrong", "error")
            });

    }



    return (
        <>

            <section className={style.HomeSlider}>

                <HeaderDescription headerIcon={'flaticon-template'} title={'Home Slider'} subTitle={'Update your shop info and other settings here'} search={false}  order={false} />


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
                                                        <label>Photos & Link</label>

                                                        <div className="d_flex d_justify">
                                                            <Uplode reviewImage={reviewImage} setReviewImage={setReviewImage} ></Uplode>
                                                            <input type="text" placeholder="Photo link" />
                                                            <div className={style.close}>
                                                                <i class="flaticon-close-1"></i>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* item */}
                                                    <div className={style.customInput}>
                                                        <label>Photos & Link</label>

                                                        <div className="d_flex d_justify">
                                                            <Uplode reviewImage={reviewImage} setReviewImage={setReviewImage} ></Uplode>
                                                            <input type="text" placeholder="Photo link" />
                                                            <div className={style.close}>
                                                                <i class="flaticon-close-1"></i>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* item */}
                                                    <div className={style.customInput}>
                                                        <label>Photos & Link</label>

                                                        <div className="d_flex d_justify">
                                                            <Uplode reviewImage={reviewImage} setReviewImage={setReviewImage} ></Uplode>
                                                            <input type="text" placeholder="Photo link" />
                                                            <div className={style.close}>
                                                                <i class="flaticon-close-1"></i>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* Add */}
                                                    <div className={style.Add}>
                                                        <Button> <i className="flaticon-plus"></i> Add  </Button>
                                                    </div>

                                                    {/* Submit */}
                                                    <div className={style.Submit}>
                                                        <Button onClick={editForm} className="theme_edit_submit_btn" sx={{ mb: 2 }}>
                                                            <i className="flaticon-install"></i> Submit
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

                </Container>

            </section>

            <section className="TopSellingProducts DashboardSetting">


            </section>
        </>
    );
};

export default HomeSlider;
