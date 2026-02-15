import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Grid, Tab } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CustomeTemplateForm from "./CustomeTemplateForm";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { headers } from "../../pages/api";
import { useToast } from "../../hook/useToast";
import axios from "axios";
const SMSTemplate = () => {
  const [tabValue, setTabValue] = useState("one");
  const [smsTemplateList, setSmsTemplateList] = useState([]);
  const [status, setStatus] = useState("place");
  const [rFace, setRFace] = useState(false);
  const showToast = useToast();
  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
    switch (newTabValue) {
      case "one":
        setStatus("place");
        break;
      case "two":
        setStatus("confirmed");
        break;
      case "three":
        setStatus("cancelled");
        break;
      case "four":
        setStatus("shipped");
        break;
      case "five":
        setStatus("delivered");
        break;
      case "six":
        setStatus("returned");
        break;
      default:
        // Handle default case if needed
        break;
    }
  };;
  const onSaveMessage = async (data) => {
    const value = {
      module: "order",
      type: status,
      ...data
    }
    try {
      let response = await axios.post(API_ENDPOINTS.BASE_URL + "/client/sms-template/update/store", value, {
        headers: headers
      })
      if (response?.data?.success) {
        showToast(response?.data?.message, "success");
        setRFace(true)
      }
    } catch (err) {
      showToast(err?.response?.data?.msg, "error");
    }

  }
  const handleFetchSMSTemplate = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}/client/sms-template/show`,
        headers: headers,
      });
      if (data.status) {
        setSmsTemplateList(data?.data?.data);
      }
      setRFace(false)
    } catch (err) { }
  }, [rFace]);
  useEffect(() => {
    handleFetchSMSTemplate();
  }, [handleFetchSMSTemplate]);
  const smsTemplate = smsTemplateList.filter(s => s.type == status)
  return (
    <Box sx={{ width: "100%", typography: "body1", marginTop: "-60px" }} className="BulkSms" >
      <TabContext>
        <div className="ChooseDomainSidebar CommonTab">
          <TabContext value={tabValue}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={3}>
                <div
                  className="ChooseDomainSidebarLeft boxShadow commonCart cart-4"
                  style={{ height: "90%" }}
                >
                  <Box>
                    <TabList
                      onChange={handleTabChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label="Pending Order"
                        value="one"
                      />
                      <Tab label="Confirm Order" value="two" />
                      <Tab label="Cancel Order " value="three" />
                      <Tab label="Shipped Order" value="four" />
                      <Tab label="Delivered Order" value="five" />
                      <Tab label="Order Return" value="six" />
                    </TabList>
                  </Box>
                </div>
              </Grid>

              <Grid item xs={12} sm={8} md={9}>
                <div className="ChooseDomainSidebarRight boxShadow commonCart cart-5">
                  <TabPanel value="one">
                    <CustomeTemplateForm onSaveMessage={onSaveMessage} defultValue={smsTemplate[0]} />
                  </TabPanel>
                  <TabPanel value="two">
                    <CustomeTemplateForm onSaveMessage={onSaveMessage} defultValue={smsTemplate[0]} />
                  </TabPanel>
                  <TabPanel value="three">
                    <CustomeTemplateForm onSaveMessage={onSaveMessage} defultValue={smsTemplate[0]} />
                  </TabPanel>
                  <TabPanel value="four">
                    <CustomeTemplateForm onSaveMessage={onSaveMessage} defultValue={smsTemplate[0]} />
                  </TabPanel>
                  <TabPanel value="five">
                    <CustomeTemplateForm onSaveMessage={onSaveMessage} defultValue={smsTemplate[0]} />
                  </TabPanel>
                  <TabPanel value="six">
                    <CustomeTemplateForm onSaveMessage={onSaveMessage} defultValue={smsTemplate[0]} />
                  </TabPanel>
                </div>
              </Grid>
            </Grid>
          </TabContext>
        </div>
      </TabContext>
    </Box>
  );
};

export default SMSTemplate;
