import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { headers } from "../../../pages/api";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import AddCategory from "./AddCategory";
import { useToast } from "../../../hook/useToast";

const SubCategory = () => {
  const showToast = useToast();

  // Tabs
  const [value, setValue] = useState("1");
  const router = useRouter();
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const [category, setCategory] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const handleSubCategorySubmit = (data) => {
    data.parent_id = data?.category_id;

    let cat = {
      parent_id: data?.parent_id,
      name: data?.name,
      status: "1",
      description: "",
      category_image: "",
    };
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + "/client/categories", cat, {
        headers: headers,
      })
      .then(function (response) {
        if (response.status === 200) {
          showToast("Category created success");
        }
        router.push("/sub-product");
      })
      .catch(function (error) {});

    reset();
  };

  ///// get category
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/categories", { headers: headers })
      .then(function (response) {
        // handle success
        setCategory(response?.data?.data);
      });
  }, []);

  return (
    <>
      <section className="TopSellingProducts DashboardSetting SubCategory">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Categories / Sub Categories"}
          subTitle={"Your Product Categories"}
          search={false}
          order={false}
          videoLink={
            {
              video: "https://www.youtube.com/embed/u6C2KvB5Kzs?si=Qv2g-PI-ebPmsATK",
              title: "How to add your categories step by step in FunnelLiner"
            }}
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
                      <Tab label="Category Information" value="1" />
                    </TabList>
                  </div>
                </Box>

                {/* Business Information */}
                <TabPanel value="1">
                  <AddCategory></AddCategory>
                </TabPanel>

                {/* Business Information */}
                <TabPanel value="2">
                  <div className="DashboardTabsItem">
                    <h4>Update Categories Information</h4>
                    <p>Update your categories info</p>

                    <div className="DashboardForm">
                      {/* Shop Info */}
                      <div className="DashboardFormItem">
                        <Grid container spacing={3}>
                          <Grid item xs={3}>
                            <div className="left">
                              <h5>Category</h5>
                              <p>
                                This will be displayed on your category page
                              </p>
                            </div>
                          </Grid>

                          <Grid item xs={9}>
                            <div className="CustomeInput">
                              <form
                                onSubmit={handleSubmit(handleSubCategorySubmit)}
                              >
                                <div className="Item">
                                  <label>Parent Category Name</label>

                                  <div className="Dropdown">
                                    <select
                                      {...register("category_id", {
                                        required: true,
                                      })}
                                    >
                                      {Array.isArray(category)
                                        ? category?.map((data) => {
                                            return (
                                              <option
                                                key={data?.id}
                                                value={data?.id}
                                              >
                                                {data?.name}
                                              </option>
                                            );
                                          })
                                        : null}
                                    </select>
                                    {errors?.category_id && (
                                      <span>This Category Name required</span>
                                    )}
                                  </div>
                                </div>

                                <div className="Item Upload">
                                  <label>Sub Category Name</label>

                                  <TextField
                                    id="outlined-basic"
                                    label=""
                                    variant={
                                      errors.name ? "danger" : "outlined"
                                    }
                                    {...register("name", { required: true })}
                                    placeholder="Sub Category Name"
                                  />

                                  <div className="svg">
                                    <FiEdit />
                                  </div>
                                </div>

                                <div className="Item">
                                  <Button type="submit" className="Update">
                                    Update
                                  </Button>
                                  <Button className="Cancle">Cancel</Button>
                                </div>
                              </form>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
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

export default SubCategory;
