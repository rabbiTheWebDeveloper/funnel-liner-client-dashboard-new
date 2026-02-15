import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getMerchantList } from "../../pages/api";
import CancelOrderCustomers from "./CancelOrderCustomers";
import ConfirmedOrderCustomers from "./ConfirmedOrderCustomers";
import FollowUpOrderCustomers from "./FollowUpOrderCustomers";
import OrderReturnCustomers from "./OrderReturnCustomers";
import PendingOrderCustomers from "./PendingOrderCustomers";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";

const CustomerList = () => {

    // Tabs
    const [value, setValue] = useState("1");

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };



    const [merchants, setMerchants] = useState([]);
    useEffect(() => {
        getMerchantList().then((res) => {
            setMerchants(res.data);
        })
            .catch(function (error) {
                if (error.response.data.api_status === "401") {
                    window.location.href = "/login"
                    Cookies.remove("token");
                    localStorage.clear("token");
                    Cookies.remove("user");
                    localStorage.clear("user");

                    window.location.href = "/login"
                }
            });
    }, []);

    return (
        <>
            <section className=' DashboardSetting Order'>

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-checklists'} title={'Customer List'} subTitle={'List Of Customers'} search={true}  order={false} />

                <Container maxWidth='sm'>

                    {/* DashboardSettingTabs */}
                    <div className='DashboardSettingTabs WebsiteSettingPage CommonTab'>
                        <Box sx={{ width: "100%", typography: "body1" }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                    <TabList
                                        onChange={handleChangeTab}
                                        aria-label='lab API tabs example'
                                    >
                                        <Tab label='Confirm Order' value='1' />
                                        <Tab label='Pending Order' value='2' />
                                        <Tab label='Cancel Order' value='3' />
                                        <Tab label='Follow Up Order' value='4' />
                                        <Tab label='Order Return' value='5' />
                                        
                                    </TabList>
                                </Box>

                                {/* Confirmed Order Customers */}
                                <TabPanel value='1'>
                                    <ConfirmedOrderCustomers></ConfirmedOrderCustomers>

                                </TabPanel>

                                {/* Lead Order Customers */}
                                <TabPanel value='2'>
                                    <PendingOrderCustomers></PendingOrderCustomers>

                                </TabPanel>

                                {/* Cancel Order Customers */}

                                <TabPanel value='3'>
                                    <CancelOrderCustomers></CancelOrderCustomers>
                                </TabPanel>

                                {/* Follow Up Order Customers */}
                                <TabPanel value='4'>

                                    <FollowUpOrderCustomers></FollowUpOrderCustomers>
                                </TabPanel>

                                {/* Order Return Customers */}
                                <TabPanel value='5'>
                                    <OrderReturnCustomers></OrderReturnCustomers>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default CustomerList;