import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { headers } from "../../pages/api";
import axios from "axios";
import FacebookPixel from "./FacebookPixel";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { useCallback } from "react";
import GoogleAnalytics from "./GoogleAnalytics";
import GoogleTagManager from "./GoogleTagManager";
import DomainVerification from "./DomainVerification";
import { useRouter } from "next/router";


const handleTabLink = (value) => {
  if (value === '1') {
    return {
      video: "https://www.youtube.com/embed/qxSCcUr0Wfc?si=cs0cotPXXiPM64yP",
      title: "How to verify your domain & set up facebook pixel easily with Funnel Liner"
    };
  }
}

const MarketingTools = ({ response }) => {
  const router = useRouter();
  const didInitFromQueryRef = useRef(false);
  const [active, setActive] = useState("1");
  const [googleTagManager, setGoogleTagManager] = useState({});
  const [value, setValue] = useState("1");
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const tabFromQuery = typeof router.query?.tab === "string" ? router.query.tab : null;
    const allowedTabs = new Set(["1", "3", "4"]);

    if (tabFromQuery && allowedTabs.has(tabFromQuery)) {
      setValue(tabFromQuery);
      setActive(tabFromQuery);
    }

    didInitFromQueryRef.current = true;
  }, [router.isReady]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!didInitFromQueryRef.current) return;

    const currentTab = typeof router.query?.tab === "string" ? router.query.tab : null;
    if (currentTab === value) return;

    const nextQuery = { ...router.query, tab: value };
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
      scroll: false,
    });
  }, [router, value]);

  const handleFetchGoogleTagManager = useCallback(async () => {
    try {
      if (active === "3" || active === "4") {
        let data = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WEBSITE_SETTINGS.GET_GOOGLE_TAG_MANAGER}`,
          headers: headers,
        });
        if (data.status) {
          setGoogleTagManager(data?.data?.data);
        }
      }
    } catch (err) { }
  }, [active]);
  useEffect(() => {
    handleFetchGoogleTagManager();
  }, [handleFetchGoogleTagManager]);

  return (
    <>
      <section className="DashboardSetting WebsiteSetting">
        {/* header */}
        <HeaderDescription
          order={false}
          headerIcon={"flaticon-stock-market"}
          title={"Marketing Tools Settings"}
          subTitle={"Update your Marketing Tools settings here"}
          search={false}
          videoLink={handleTabLink(active)}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="boxShadow">
            <Box>
              <TabContext value={value}>
                <div className="CommonTab">
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Domain Verification" value="1" onClick={() => setActive("1")} />
                      {/* <Tab label="Facebook Pixel" value="2" onClick={() => setActive('1')} /> */}
                      <Tab label="Google Tag Manager" value="3" onClick={() => setActive("3")} />
                      <Tab label="Google Analytics" value="4" onClick={() => setActive("4")} /> 

                    </TabList>
                  </Box>
                </div>

                {/* doment verify  */}

                <TabPanel value="1">
                  <DomainVerification
                    data={response}
                    shopName={response?.shop_name}
                  />
                </TabPanel>
                {/* Facebook Pixel */}
                {/* <TabPanel value="2">
                  <FacebookPixel
                    shopName={response?.shop_name}
                    response={response}
                  ></FacebookPixel>
                </TabPanel> */}

                {/* GoogleAnalytics */}
                <TabPanel value="4">
                  <GoogleAnalytics

                    googleTagManager={googleTagManager}
                  />
                </TabPanel>
                {/* GoogleTagManager */}
                <TabPanel value="3">
                  <GoogleTagManager

                    googleTagManager={googleTagManager}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
};

export default MarketingTools;