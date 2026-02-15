import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiSlider } from "react-icons/bi";
import { useToast } from "../../hook/useToast";
import { shopId, userId } from "../../pages/api";
import Uplode from "../edit-theme/Uplode";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const Banner = ({ response }) => {
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
        axios.post(API_ENDPOINTS.BASE_URL + "/client/banner-store", formData, {
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
            <section className="TopSellingProducts DashboardSetting">
                <Container maxWidth="sm">
                    <Grid Container spacing={3}>
                        <Grid item xs={12}>
                            <div className="Header d_flex d_justify">
                                {/* Left */}
                                <div className="Left d_flex">
                                    <div className="svg">
                                        <BiSlider />
                                    </div>

                                    <div className="text">
                                        <h4>Home Slider</h4>
                                        <p>Update your shop info and other settings here</p>
                                    </div>
                                </div>

                                {/* Right */}

                            </div>
                        </Grid>
                    </Grid>

                    {/* DashboardSettingTabs */}
                    <div className="DashboardSettingTabs">
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

                                    <div className="DashboardFormItem">
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={3}>
                                                <div className="left">
                                                    <h5>Company Logo</h5>
                                                    <p>
                                                        This will be displayed on your shop profile
                                                    </p>
                                                </div>
                                            </Grid>

                                            <Grid item xs={12} sm={9}>
                                                <div className="CustomeInput">
                                                    <div className="Item Upload">
                                                        <span>
                                                            Image must be a file of type: png, jpg, jpeg
                                                        </span>
                                                        <span>
                                                            Image Size: <span>(Width: 100px, Height: 100px)</span>
                                                        </span>

                                                        <Uplode reviewImage={reviewImage} setReviewImage={setReviewImage} ></Uplode>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <div className="CustomeInput">
                                                    <Button onClick={editForm}  className="theme_edit_submit_btn"  sx={{ mb: 2 }}>
                                                        Submit
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>

                                </TabPanel>

                            </TabContext>
                        </Box>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default Banner;
