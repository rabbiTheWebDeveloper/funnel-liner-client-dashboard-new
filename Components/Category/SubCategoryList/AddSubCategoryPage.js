import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import { useState } from "react";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import AddSubCategory from "./AddSubCategory";

const AddSubCategoryPage = () => {
  // Tabs
  const [value, setValue] = useState("1");
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <section className="TopSellingProducts DashboardSetting SubCategory">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Sub Categories"}
          subTitle={"Add Your Product Sub Category"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs">
            <Box className="boxShadow">
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <div className="CommonTab">
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Sub Category Information" value="1" />
                    </TabList>
                  </div>
                </Box>

                {/* Sub Category Form */}
                <TabPanel value="1">
                  <AddSubCategory />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AddSubCategoryPage;
