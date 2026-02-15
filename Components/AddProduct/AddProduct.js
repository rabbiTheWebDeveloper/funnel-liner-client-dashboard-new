import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Grid, Tab, TextField } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { MdProductionQuantityLimits } from "react-icons/md";
import Select from "react-select";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";

const AddProduct = () => {
  const showToast = useToast();
  const [value, setValue] = useState("1");
  const [category, setCategory] = useState([]);
  const [tabSelect, setTabSelect] = useState("1");
  const [mainImg, setMainImg] = useState();
  const [delivery, setDelivery] = useState("default");
  const [insideDhaka, setInsideDhaka] = useState();
  const [outDhaka, setOutDhaka] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [previewMainImg, setPreviewMainImg] = useState({ file: null });
  const [categoryID, setCategoryID] = useState(null);
  const [values, setData] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const selectRef = useRef();
  const router = useRouter();
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  //file preview
  const handleMainImage = e => {
    setMainImg(e.target.files[0]);
    const file = e.target.files[0];
    setPreviewMainImg({ file: URL.createObjectURL(file) });
  };

  let options =
    category.length === 0
      ? []
      : category?.map(function (item) {
          return { value: item.id, label: item.name };
        });
  options.unshift({ value: "add", label: "+ Add New Category" });

  const handleChangeItem = e => {
    if (e.value === "add") {
      router.push("/add-category");
    }
    setCategoryID(e.value);
  };
  //  add product form
  const onSubmit = data => {
    if (selectedImage?.size > 1024 * 1024) {
      showToast("Product image is too big !", "error");
      return;
    } else if (categoryID == null) {
      showToast("Category required", "error");
      return;
    } else if (selectedImage === null) {
      showToast("Product Image required", "error");
      return;
    }
    data.size = "XL";
    data.color = "white";
    data.short_description = "IT was good and I like it";
    data.meta_tag = "buy";
    data.meta_description = "IT was good and I like it";
    data.status = "1";
    data.discount = "0";
    data.price = data.price.replace(/,/g, "");
    if (delivery === "default") {
      showToast("Select delivery Charge", "error");
      return;
    } else if (delivery === "Paid Delivery Charge") {
      if (insideDhaka === undefined) {
        showToast("Delivery charge required inside Dhaka", "error");
        return;
      } else if (outDhaka === undefined) {
        showToast("Delivery charge required outside Dhaka", "error");
        return;
      }
      data.delivery_charge = "paid";
      data.inside_dhaka = insideDhaka;
      data.outside_dhaka = outDhaka;
    } else if (delivery === "Free Delivery Charge") {
      data.delivery_charge = "free";
    }
    const formData = new FormData();
    formData.append("main_image", selectedImage);
    if (category.length > 0) {
      formData.append("category_id", categoryID);
    } else {
      formData.append("category_name", data.category_name);
    }
    formData.append("product_name", data.product_name);
    formData.append("price", data.price);
    formData.append("discount", "0");
    formData.append("size", data.size);
    formData.append("color", data.color);
    formData.append("product_code", data.product_code);
    formData.append("product_qty", data.product_qty);
    formData.append("short_description", data.short_description);
    formData.append("meta_tag", data.meta_tag);
    formData.append("meta_description", data.meta_description);
    formData.append("status", data.status);
    if (delivery === "Free Delivery Charge") {
      formData.append("delivery_charge", "free");
    }
    if (delivery === "Paid Delivery Charge") {
      formData.append("delivery_charge", "paid");
      formData.append("inside_dhaka", data.inside_dhaka);
      formData.append("outside_dhaka", data.outside_dhaka);
    }
    setIsLoading(true);
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + "/client/products", formData, {
        headers: headers,
      })
      .then(function (response) {
        setIsLoading(false);

        if (response.status === 200) {
          showToast("Product Add successfully!", "success");
          router.push("/product");
          reset();
        }
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          setIsLoading(false);

          showToast(error.response.data.error, "error");
        } else {
          setIsLoading(false);
          showToast("Something went wrong!", "error");
        }
      });
  };

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/categories", {
        headers: headers,
      })
      .then(function (response) {
        // handle success
        setCategory(response.data.data);
      })
      .catch(function (error) {
        if (error?.response?.data?.api_status === "401") {
          window.location.href = "/login";
          Cookies.remove("token");
          localStorage.clear("token");
          Cookies.remove("user");
          localStorage.clear("user");
          window.location.href = "/login";
        }
      });
  }, []);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <>
      <section className="TopSellingProducts DashboardSetting">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-plus"}
          title={"Add New Products"}
          subTitle={"Add new products in your shop"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <div className="CommonTab">
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Product Information" value="1" />
                    </TabList>
                  </Box>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Business Information */}
                  <TabPanel value="1">
                    <div className="DashboardTabsItem">
                      <h4>Add Products</h4>
                      <p>Add your product info</p>

                      <div className="DashboardForm">
                        {/* Shop Info */}
                        <div className="DashboardFormItem">
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={5} md={3}>
                              <div className="left">
                                <h5>Product Info</h5>
                                <p>
                                  This will be displayed on your product page
                                </p>
                              </div>
                            </Grid>

                            <Grid item xs={12} sm={7} md={9}>
                              <div className="CustomeInput">
                                <div className="Item">
                                  <label>
                                    Product Name <span>*</span>
                                  </label>
                                  <TextField
                                    id="outlined-basic"
                                    label=""
                                    variant="outlined"
                                    placeholder="Enter product name here"
                                    {...register("product_name", {
                                      required: true,
                                    })}
                                  />
                                  {errors.product_name && (
                                    <span style={{ color: "red" }}>
                                      This Product Name required
                                    </span>
                                  )}
                                  <div className="svg">
                                    <FiEdit />
                                  </div>
                                </div>

                                <div className="Item">
                                  <label>
                                    Selling Price <span>*</span>
                                  </label>
                                  <TextField
                                    type="number"
                                    min="0"
                                    id="outlined-basic"
                                    label="Selling Price"
                                    variant="outlined"
                                    placeholder="Example: 599"
                                    {...register("price", {
                                      required: true,
                                      pattern: /^[0-9]+$/,
                                    })}
                                  />
                                  {errors.price && (
                                    <span style={{ color: "red" }}>
                                      Invalid Price
                                    </span>
                                  )}

                                  <div className="svg">
                                    <FiEdit />
                                  </div>
                                </div>
                                <div className="Item">
                                  <label>
                                    Product Code <span>*</span>
                                  </label>
                                  <TextField
                                    id="outlined-basic"
                                    label="Product Code"
                                    variant="outlined"
                                    placeholder="Example: A103ProductName"
                                    {...register("product_code", {
                                      required: true,
                                    })}
                                  />
                                  {errors.product_code && (
                                    <span style={{ color: "red" }}>
                                      Product Code required
                                    </span>
                                  )}

                                  <div className="svg">
                                    <FiEdit />
                                  </div>
                                </div>

                                <div className="Item">
                                  <label>
                                    Available Quantity <span>*</span>
                                  </label>
                                  <TextField
                                    type="text"
                                    placeholder="Enter available quantity here"
                                    {...register("product_qty", {
                                      required: true,
                                      pattern: /^[0-9]+$/,
                                    })}
                                  />
                                  {errors.product_qty && (
                                    <span style={{ color: "red" }}>
                                      Invalid Quantity
                                    </span>
                                  )}

                                  <div className="svg">
                                    <FiEdit />
                                  </div>
                                </div>
                                <div className="Item">
                                  <label>
                                    Category Name <span>*</span>
                                  </label>

                                  <Select
                                    options={options}
                                    styles={customStyles}
                                    onChange={handleChangeItem}
                                    menuPosition="fixed"
                                  />
                                  {/* {
                                    category.length > 0 && <Select options={options}  styles={customStyles} onChange={handleChangeItem} />
                                  } */}

                                  {/* {
                                    category.length === 0 && <>
                                      <TextField
                                        type="text"
                                        id="outlined-basic"
                                        label="Available Quantity"
                                        variant="outlined"
                                        placeholder="Category name"
                                        {...register("category_name", {
                                          required: true,
                                        })}
                                      />
                                      {errors.product_qty && (
                                        <span>Category Name required</span>
                                      )}

                                      <div className="svg">
                                        <FiEdit />
                                      </div>
                                    </>
                                  } */}
                                </div>

                                <div className="Item Upload">
                                  <label>
                                    Product Image ( main image of product ){" "}
                                    <span>*</span>
                                  </label>
                                  <p>
                                    Image must be a file of type:{" "}
                                    <span>png, jpg, jpeg</span>
                                  </p>
                                  <p>
                                    Image Size:{" "}
                                    <span>(Width: 500px, height: 500px)</span>
                                  </p>

                                  <input
                                    accept="image/*"
                                    type="file"
                                    id="select-image"
                                    style={{ display: "none" }}
                                    onChange={e =>
                                      setSelectedImage(e.target.files[0])
                                    }
                                  />

                                  <label htmlFor="select-image">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      component="span"
                                    >
                                      Upload Image
                                    </Button>
                                  </label>
                                  {imageUrl && selectedImage && (
                                    <Box mt={2} textAlign="center">
                                      <h6>Image Preview:</h6>
                                      <img
                                        src={imageUrl}
                                        alt={selectedImage.name}
                                        height="100px"
                                      />
                                    </Box>
                                  )}
                                </div>

                                {/* DelivaryCharge */}
                                <div className="DelivaryCharge">
                                  <div className="Item">
                                    <label>
                                      {" "}
                                      Delivery Charge <span>*</span>
                                    </label>

                                    <select
                                      name=""
                                      onChange={e => {
                                        setDelivery(e.target.value);
                                      }}
                                    >
                                      <option value="default">
                                        Select Delivery Charge
                                      </option>
                                      <option value="Free Delivery Charge">
                                        Free Delivery Charge
                                      </option>
                                      <option value="Paid Delivery Charge">
                                        Paid Delivery Charge
                                      </option>
                                    </select>
                                  </div>

                                  {delivery === "Paid Delivery Charge" && (
                                    <div className="Item">
                                      <div className="DelivaryItem d_flex d_justify">
                                        <TextField
                                          onChange={e =>
                                            setInsideDhaka(e.target.value)
                                          }
                                          id="outlined-basic"
                                          label="Delivery Charge in Dhaka"
                                          variant="outlined"
                                        />

                                        <TextField
                                          onChange={e =>
                                            setOutDhaka(e.target.value)
                                          }
                                          id="outlined-basic"
                                          label="Delivery Charge out of Dhaka"
                                          variant="outlined"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="Item">
                                  <Button
                                    disabled={isLoading}
                                    className={isLoading !== true && "Update"}
                                    type="submit"
                                  >
                                    ADD Product
                                  </Button>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </form>
              </TabContext>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AddProduct;
