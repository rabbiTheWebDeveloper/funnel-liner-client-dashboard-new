import { Box, Button, Container, Grid } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AsyncSelect from "react-select";
import useLoading from "../../../hook/useLoading";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import SmallLoader from "../../SmallLoader/SmallLoader";

const SectionCustomize = () => {
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [footerList, setFooterList] = useState([]);
  const [checkoutList, setCheckoutList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [productsList, setProductsList] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_id: {},
      title: "",
      descriptions: "",
      fb: "",
      twitter: "",
      linkedin: "",
      instagram: "",
      youtube: "",
      phone: "",
      email: "",
      address: "",
      checkout_text_color: "",
      checkout_link_color: "",
      checkout_button_color: "",
      checkout_b_color: "",
      footer_text_color: "",
      footer_heading_color: "",
      footer_b_color: "",
      order_title: "",
      checkout_button_text: "",
    },
  });
  const handelFooterList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/footer-list?type=landing`,
        headers: headers,
      });
      setFooterList(data?.data?.data);
    } catch (err) {}
  };

  useEffect(() => {
    handelFooterList();
  }, []);

  const handelCheckoutList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/checkout-design-list`,
        headers: headers,
      });
      setCheckoutList(data?.data?.data);
    } catch (err) {}
  };

  useEffect(() => {
    handelCheckoutList();
  }, []);

  const handelProductList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/products-for-search`,
        headers: headers,
      });
      setProductsList(data?.data?.data);
    } catch (err) {}
  };

  useEffect(() => {
    handelProductList();
  }, [id]);

  let options =
    productsList?.length === 0
      ? []
      : productsList?.map(function (item) {
          return { value: item?.id, label: item?.product_name };
        });

  const [selectedProductId, setSelectedProductId] = useState();
  const handleSelectChange = selectedOption => {
    setSelectedProductId(selectedOption.value);
  };
  const [isDataFetchLoading, setIsDataFetchLoading] = useState(false);
  const handelPageInfo = async () => {
    setIsDataFetchLoading(true);
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/pages/${id}/edit`,
        headers: headers,
      });
      setPageInfo(data?.data?.data);
      const page_data = data?.data?.data;
      setSelectedProductId(page_data?.product_id);
      setValue("title", page_data?.title);
      setValue("page_content", page_data?.descriptions);
      setValue("phone", page_data?.phone);
      setValue("email", page_data?.email);
      setValue("address", page_data?.address);
      setValue("checkout_text_color", page_data?.checkout_text_color);
      setValue("checkout_link_color", page_data?.checkout_link_color);
      setValue("checkout_button_color", page_data?.checkout_button_color);
      setValue("checkout_b_color", page_data?.checkout_b_color);
      setValue("footer_text_color", page_data?.footer_text_color);
      setValue("footer_heading_color", page_data?.footer_heading_color);
      setValue("footer_b_color", page_data?.footer_b_color);
      setValue("fb", page_data?.fb);
      setValue("twitter", page_data?.twitter);
      setValue("linkedin", page_data?.linkedin);
      setValue("instagram", page_data?.instagram);
      setValue("youtube", page_data?.youtube);
      setValue("order_title", page_data?.order_title);
      setValue("checkout_button_text", page_data?.checkout_button_text);
      setIsDataFetchLoading(false);
    } catch (err) {
      setIsDataFetchLoading(false);
    }
  };

  useEffect(() => {
    handelPageInfo();
  }, [id]);
  const onSubmit = data => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("product_id", selectedProductId);
    formData.append("order_title", data.order_title);
    if (data.descriptions) {
      formData.append("descriptions", data.descriptions);
    }
    if (selectedImage) {
      formData.append("logo", selectedImage);
    }

    if (pageInfo.theme.id) {
      formData.append("theme", pageInfo.theme.id);
    }
    if (data.checkout_form_id) {
      formData.append("checkout_form_id", data.checkout_form_id);
    }
    if (data.footer_id) {
      formData.append("footer_id", data.footer_id);
    }
    if (data.fb) {
      formData.append("fb", data.fb);
    }
    if (data.twitter) {
      formData.append("twitter", data.twitter);
    }
    if (data.linkedin) {
      formData.append("linkedin", data.linkedin);
    }
    if (data.instagram) {
      formData.append("instagram", data.instagram);
    }
    if (data.youtube) {
      formData.append("youtube", data.youtube);
    }
    if (data.address) {
      formData.append("address", data.address);
    }
    if (data.phone) {
      formData.append("phone", data.phone);
    }
    if (data.email) {
      formData.append("email", data.email);
    }
    if (data.footer_text_color) {
      formData.append("footer_text_color", data.footer_text_color);
    }
    if (data.footer_heading_color) {
      formData.append("footer_heading_color", data.footer_heading_color);
    }
    if (data.footer_b_color) {
      formData.append("footer_b_color", data.footer_b_color);
    }
    if (data.checkout_text_color) {
      formData.append("checkout_text_color", data.checkout_text_color);
    }

    if (data.checkout_link_color) {
      formData.append("checkout_link_color", data.checkout_link_color);
    }
    if (data.checkout_b_color) {
      formData.append("checkout_b_color", data.checkout_b_color);
    }
    if (data.checkout_button_color) {
      formData.append("checkout_button_color", data.checkout_button_color);
    }
    if (data?.checkout_button_text) {
      formData.append("checkout_button_text", data.checkout_button_text);
    }

    if (selectedImage?.size > 1024 * 1024) {
      showToast("Image size is too big !", "error");
      return;
    }
    startLoading();
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + `/client/page/update/${id}`,
        formData,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        if (response?.data?.success) {
          showToast(response?.data?.message, "success");
          router.push("/web-pages");
        }
      })
      .catch(function (error) {
        stopLoading();
        if (error?.response?.status === 422) {
          showToast("This category already exist !", "error");
        } else if (error?.response?.status === 400) {
          showToast("Category image required!. ", "error");
        } else {
          showToast("Something went wrong!", "error");
        }
      });
  };

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleResetFooterAndCheckoutColor = async () => {
    try {
      let data = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/footer/color/reset/${id}`,
        headers: headers,
      });
      if (data.status === 200) {
        showToast(data?.data?.message);
        handelPageInfo();
      }
    } catch (err) {
      showToast(err?.msg, "error");
    }
  };


 

  function updateThumbnailURLs(data) {
  const oldBaseURL = "https://funnelliner.s3.ap-southeast-1.amazonaws.com";
  const newBaseURL = "https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com";

  return data?.map(item => ({
    ...item,
    thumnail: item.thumnail.replace(oldBaseURL, newBaseURL)
  }));
}
const updateheckoutList = updateThumbnailURLs(checkoutList);
const updatefooterList = updateThumbnailURLs(footerList);

 console.log("updateheckoutList", updateheckoutList);
 console.log("updatefooterList", updatefooterList);
  return (
    <>
      {isDataFetchLoading && <SmallLoader />}

      <div className="SectionCustomize">
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Left */}
              <Grid item xs={6}>
                {/* Header Title */}
                <div className="SectionCustomizeBox boxShadow">
                  <div className="Header">
                    <h4>Header Title</h4>
                  </div>

                  <div className="Form">
                    {/* Title */}
                    <div className="customInput">
                      <label>Title</label>
                      <input
                        {...register("title")}
                        type="text"
                        placeholder="Enter Title  name here"
                      />
                    </div>

                    {/* Meta description */}
                    <div className="customInput">
                      <label>Meta description</label>
                      <textarea
                        {...register("descriptions")}
                        name="descriptions"
                        rows="2"
                        placeholder="Enter description here"
                      ></textarea>
                    </div>

                    {/* Title */}
                    <div className="customInput">
                      <label>Product selection / Update</label>
                      {options.length > 0 && pageInfo && (
                        <AsyncSelect
                          placeholder="Select an option..."
                          options={options}
                          onChange={handleSelectChange}
                          defaultValue={options.find(
                            item => item.value === pageInfo?.product_id
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Checkout Form Design Selection */}
                <div className="SectionCustomizeBox boxShadow">
                  <div className="Header">
                    <h4>Checkout Form Design Selection</h4>
                  </div>

                  <div className="customInput">
                    <label>Checkout Form Title</label>
                    <input
                      type="text"
                      {...register("order_title", { required: true })}
                    />
                    {errors.order_title && (
                      <span style={{ color: "red" }}>
                        This Field is required
                      </span>
                    )}
                  </div>
                  <div className="customInput">
                    <label>Checkout Form Submit Button Text</label>
                    <input type="text" {...register("checkout_button_text")} />
                  </div>
                  <br />

                  <div className="SelectSectionBox my-3">
                    {updateheckoutList.length > 0 &&
                      updateheckoutList.map((item, index) => {
                        return (
                          <label className="SelectSectionItem" key={item.id}>
                            <input
                              checked
                              defaultValue={item?.id}
                              {...register("checkout_form_id")}
                              name="checkout_form_id"
                              value={item?.id}
                              key={item?.id}
                              className="radio"
                              type="radio"
                            />

                            <div className="img">
                              <img src={item?.thumnail} alt={item?.name} />
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {/* Social Media Link */}
                <div className="SectionCustomizeBox boxShadow">
                  <div className="Header">
                    <h4>Social Media Link</h4>
                  </div>

                  <div className="Form">
                    {/* Phone */}
                    <div className="customInput">
                      <label>
                        Facebook <span></span>
                      </label>
                      <input
                        type="text"
                        {...register("fb", {
                          pattern: {
                            value:
                              /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+$/,
                            message: "Invalid Facebook profile link",
                          },
                        })}
                      />
                      {errors.fb && (
                        <span style={{ color: "red" }}>
                          {errors.fb.message}
                        </span>
                      )}
                    </div>

                    <div className="customInput">
                      <label>
                        Instagram<span></span>
                      </label>
                      <input
                        type="text"
                        {...register("instagram", {
                          pattern: {
                            value: /^(https?:\/\/)?(www\.)?instagram\.com\/.*$/,
                            message: "Invalid Instagram link",
                          },
                        })}
                      />
                      {errors.instagram && (
                        <span style={{ color: "red" }}>
                          {errors.instagram.message}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="customInput">
                      <label>
                        Twitter<span></span>
                      </label>
                      <input
                        type="text"
                        {...register("twitter", {
                          pattern: {
                            value:
                              /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9.]+$/,
                            message: "Invalid twitter profile link",
                          },
                        })}
                        {...register("twitter")}
                      />
                      {errors.twitter && (
                        <span style={{ color: "red" }}>
                          {errors.twitter.message}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="customInput">
                      <label>
                        Linkedin <span></span>
                      </label>
                      <input
                        type="text"
                        {...register("linkedin", {
                          pattern: {
                            value:
                              /^(https?:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9.]+$/,
                            message: "Invalid linkedin profile link",
                          },
                        })}
                      />
                      {errors.linkedin && (
                        <span style={{ color: "red" }}>
                          {errors.linkedin.message}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="customInput">
                      <label>Youtube</label>
                      <input
                        defaultValue={pageInfo?.youtube}
                        type="text"
                        {...register("youtube", {
                          pattern: {
                            value: /^(https?:\/\/)?(www\.)?youtube\.com\/.*$/,
                            message: "Invalid youtube link",
                          },
                        })}
                      />
                      {errors.youtube && (
                        <span style={{ color: "red" }}>
                          {errors.youtube.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>

              {/* Right */}
              <Grid item xs={6}>
                {/* Personal Info */}
                <div className="SectionCustomizeBox boxShadow">
                  <div className="Header">
                    <h4>Footer Information</h4>
                  </div>
                  <div className="Form">
                    {/* Phone */}
                    <div className="customInput">
                      <label>Phone</label>
                      <input
                        {...register("phone", {
                          pattern: {
                            value: /^(\+8801|01)[3456789](\d{8})$/,
                            message: "Invalid phone number",
                          },
                        })}
                        type="text"
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <span style={{ color: "red" }}>
                          {errors.phone.message}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="customInput">
                      <label>Email</label>
                      <input
                        defaultValue={pageInfo?.email}
                        {...register("email", {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="text"
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <span style={{ color: "red" }}>
                        {errors.email.message}
                      </span>
                    )}

                    {/* Title */}
                    <div className="customInput">
                      <label>Address</label>
                      <input
                        defaultValue={pageInfo?.address}
                        {...register("address")}
                        type="text"
                        placeholder="Enter Enter your address"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Section Design */}
                <div className="SectionCustomizeBox boxShadow">
                  <div className="Header">
                    <h4>Footer Section Design</h4>
                  </div>
                  <div className="SelectSectionBox">
                    {pageInfo?.active_footer &&
                      footerList.length > 0 &&
                      updatefooterList.map((item, index) => {
                        return (
                          <label className="SelectSectionItem" key={item.id}>
                            <input
                              defaultChecked={
                                item?.id == pageInfo?.active_footer?.footer_id
                              }
                              {...register("footer_id")}
                              name="footer_id"
                              value={item?.id}
                              key={item?.id}
                              className="radio"
                              type="radio"
                            />
                            {/* pageInfo?.active_footer?.id */}
                            <div className="img">
                              <img src={item?.thumnail} alt={item?.name} />
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {/* Footer Logo Upload */}
                <div className="SectionCustomizeBox boxShadow">
                  <div className="Header">
                    <h4>Footer Logo Upload</h4>
                  </div>
                  <div className="Form">
                    <div className="customInput">
                      <label>Upload Logo</label>
                    </div>

                    <div className="imgUploader">
                      <input
                        accept="image/*"
                        type="file"
                        id="select-image"
                        style={{ display: "none" }}
                        onChange={e => setSelectedImage(e.target.files[0])}
                      />

                      <label htmlFor="select-image">
                        <Button
                          className="SelectImgButton"
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          Upload Image
                        </Button>
                      </label>
                      {imageUrl && selectedImage && (
                        <Box mt={2} textAlign="center">
                          <img
                            src={imageUrl}
                            alt={selectedImage.name}
                            height="100px"
                          />
                        </Box>
                      )}

                      {imageUrl && selectedImage ? (
                        ""
                      ) : (
                        <Box mt={2} textAlign="center">
                          {/* <h6>Image Preview:</h6> */}
                          <img
                            src={pageInfo?.logo}
                            alt={pageInfo?.title}
                            height="100px"
                          />
                        </Box>
                      )}
                    </div>
                  </div>
                </div>

                <div className="SectionCustomizeBox boxShadow">
                  <div className="Header">
                    <h4>Color</h4>
                  </div>
                  <div className="ColorSection">
                    <div className="ColorSectionItem">
                      <h5>Check out form color</h5>

                      <div className="customInput">
                        <label>Text</label>
                        <div className="showColor">
                          <h4>{pageInfo?.checkout_text_color}</h4>
                          <input
                            defaultValue={pageInfo?.checkout_text_color}
                            {...register("checkout_text_color")}
                            type="color"
                          />
                        </div>
                      </div>
                      <div className="customInput">
                        <label>Link </label>
                        <div className="showColor">
                          <h4>{pageInfo?.checkout_link_color}</h4>
                          <input
                            defaultValue={pageInfo?.checkout_link_color}
                            {...register("checkout_link_color")}
                            type="color"
                          />
                        </div>
                      </div>

                      <div className="customInput">
                        <label>Button Color </label>
                        <div className="showColor">
                          <h4>{pageInfo?.checkout_b_color}</h4>
                          <input
                            defaultValue={pageInfo?.checkout_b_color}
                            {...register("checkout_button_color")}
                            type="color"
                          />
                        </div>
                      </div>
                      <div className="customInput">
                        <label>Background Color </label>
                        <div className="showColor">
                          <h4>{pageInfo?.checkout_b_color}</h4>
                          <input
                            defaultValue={pageInfo?.checkout_b_color}
                            {...register("checkout_b_color")}
                            type="color"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ColorSectionItem">
                      <h5>Footer form color</h5>
                      <div className="customInput">
                        <label>Text</label>
                        <div className="showColor">
                          <h4>{pageInfo?.footer_text_color}</h4>
                          <input
                            {...register("footer_text_color")}
                            type="color"
                          />
                        </div>
                      </div>

                      <div className="customInput">
                        <label>Heading Color</label>
                        <div className="showColor">
                          <h4>{pageInfo?.footer_heading_color}</h4>
                          <input
                            {...register("footer_heading_color")}
                            type="color"
                          />
                        </div>
                      </div>

                      <div className="customInput">
                        <label>Button Color </label>
                        <div className="showColor">
                          <h4>{pageInfo?.footer_b_color}</h4>
                          <input
                            defaultValue={pageInfo?.footer_b_color}
                            {...register("footer_b_color")}
                            type="color"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="SectionButton">
                    <p className="text-center">
                      If you click "reset colour," the "footer form colour" and
                      "checkout form colour" will be removed.
                    </p>
                    <Button
                      onClick={handleResetFooterAndCheckoutColor}
                      className="bg"
                    >
                      Reset Color
                    </Button>
                  </div>
                </div>
              </Grid>
              {/* Save */}
              <Grid item xs={12}>
                <div className="UpdateButtonCustomize">
                  <Button disabled={isLoading} type="submit" className="bg">
                    Update
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
    </>
  );
};

export default SectionCustomize;
