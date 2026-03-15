import { Box, Container, Grid, Button } from "@mui/material";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import { Field, Form, Formik, ErrorMessage } from "formik";
import style from "./addProduct.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import axios from "axios";
import { headers } from "../../../pages/api";
import Select from "react-select";
import AddProductCategory from "./AddProductCategory";
import {
  DELIVERY_CHARGE_DATA,
  PRODUCT_TYPE_DATA,
  STATUS_DATA,
} from "../../../constant/Product";
import ProductImage from "../../edit-theme/ProductImage";
import QuillEditor from "../Description/Description";
import AddProductVariantType from "./AddProductVarintTypePopup";
import DeleteVariantAttributeWithValue from "./DeleteVariantAttributeWithValueModal";
import { useToast } from "../../../hook/useToast";
import DeleteSingleVariant from "./DeleteSingleVariantModal";
import * as Yup from "yup";
import { useRouter } from "next/router";
import AddVariantAttributeValue from "./AddVariantAttributeValuePopup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useLoading from "../../../hook/useLoading";
import Spinner from "../../commonSection/Spinner/Spinner";
import { getTotalQuantity } from "../../../utlit/product";
import ProductVideo from "../../edit-theme/ProductVideo";

const validationSchema = Yup.object({
  product_name: Yup.string().required("Product Name is required"),
  selling_price: Yup.number()
    .required("Selling Price is required")
    .moreThan(0, "Selling Price must be greater than 0"),
  product_code: Yup.string().required("Product Code is required"),
  product_quantity: Yup.string().required("Product Quantity is required"),
  category_id: Yup.string().required("Category is required"),
  delivery_charge: Yup.string().required("Delivery Charge is required"),
  discount: Yup.string()
    // .nullable()
    .test("valid-discount", "Invalid discount format", value => {
      return /^(\d+(\.\d{1,2})?%?)$/.test(value);
    })
    .test(
      "valid-discount-amount",
      "Discount cannot be higher than Regular Price",
      function (value) {
        const numericValue = parseFloat(value?.replace("%", "") || 0);
        const sellingPrice = this.parent.selling_price;
        return numericValue <= sellingPrice;
      }
    )
    .transform(value => {
      return value ? value.replace("%", "") : "";
    }),
  discount_type: Yup.string().when("discount", {
    is: value => !!value, // Only make it required when discount is present
    then: Yup.string().required("Discount Type is required"),
    otherwise: Yup.string().notRequired(),
  }),
  main_image: Yup.mixed()
    .test("valid-image-size", "Product image is too big!", value => {
      return !value || (value && value.size <= 1024 * 1024);
    })
    .required("Product Image required"),
  // buying_price: Yup.number()
  //   .min(0, "Buying Price must be non-negative")
  //   .required("Buying Price is required"),
  // transportation_cost: Yup.number()
  //   .min(0, "Transportation Cost must be non-negative")
  //   .required("Transportation Cost is required"),
  // packaging_cost: Yup.number()
  //   .min(0, "Packaging Cost must be non-negative")
  //   .required("Packaging Cost is required"),
  // ad_budget_cost: Yup.number()
  //   .min(0, "Ad Budget must be non-negative")
  //   .required("Ad Budget is required"),
});

const AddProduct = ({ busInfo }) => {
  const router = useRouter();
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [categories, setCategories] = useState([
    {
      value: "add",
      label: "+ Add New Category",
    },
  ]);
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [openAddCategoryPopup, setOpenAddCategoryPopup] = useState(false);
  const [openAddVariantAttributePopup, setOpenAddVariantAttributePopup] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [deliverChargeType, setDeliveryChargeType] = useState([]);
  const [selectProductImage, setSelectProductImage] = useState();
  const [productPreviewImage, setProductPreviewImage] = useState();
  const [productGalleryImage, setProductGalleryImage] = useState([]);
  const [productShortDescription, setProductShortDescription] = useState("");
  const [productLongDescription, setProductLongDescription] = useState("");
  const [isOpenVariationOption, setIsOpenVariationOption] = useState(false);
  const [isShowVariantValuesOption, setIsShowVariantValuesOption] =
    useState(false);
  const [variantAttribute, setVariantAttribute] = useState([]);
  const [variantValues, setVariantValues] = useState([]);
  const [tempVariantValues, setTempVariantValues] = useState([]);
  const [selectVariantTypes, setSelectVariantTypes] = useState([]);
  const [productGalleryVideos, setProductGalleryVideos] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [
    isOpenDeleteProductVariantTypeModal,
    setIsOpenDeleteProductVariantTypeModal,
  ] = useState(false);
  const [
    selectedIndexForDeleteVariantType,
    setSelectedIndexForDeleteVariantType,
  ] = useState();
  const [variantTable, setVariantTable] = useState([]);
  const [isShowSingleVariantDeletePopup, setIsShowSingleVariantDeletePopup] =
    useState(false);
  const [selectedDeleteVariant, setSelectedDeleteVariant] = useState(null);
  const [
    openAddVariantAttributeValuePopup,
    setOpenAddVariantAttributeValuePopup,
  ] = useState(false);

  const fetchVariantAttributes = useCallback(async () => {
    const variantAttributesRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_VARIANT_ATTRIBUTES}`,
      {
        headers: headers,
      }
    );
    if (variantAttributesRes?.data?.success) {
      const makeVariantAttributesArr = [];
      variantAttributesRes?.data?.data.forEach(item => {
        makeVariantAttributesArr.push({
          value: item?.id,
          label: item?.key,
        });
      });
      makeVariantAttributesArr.unshift({
        value: "add",
        label: "+ Add New Attribute",
      });
      setVariantAttributes(makeVariantAttributesArr);
    } else {
      showToast("Something went wrong", "error");
    }

    setFetch(false);
  }, [fetch]);

  const handelFetch = () => {
    setFetch(true);
  };

  const fetchVariantValuesOnAttribute = useCallback(async attributeId => {
    const variantValuesRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_VARIANT_VALUES}/${attributeId}`,
      {
        headers: headers,
      }
    );

    if (variantValuesRes?.data?.success) {
      setIsShowVariantValuesOption(true);
      const makeVariantValuesArr = [];
      variantValuesRes?.data?.data.forEach(item => {
        makeVariantValuesArr.push({
          value: item?.id,
          label: item?.value,
          attribute_id: item?.attribute_id,
        });
      });
      makeVariantValuesArr.unshift({
        value: "add",
        label: "+ Add New Value",
        attribute_id: "",
      });
      setVariantValues(makeVariantValuesArr);
    } else {
      showToast("Something went wrong", "error");
    }
  }, []);

  const fetchCategoriesData = useCallback(async () => {
    await axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}`,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        if (response?.data?.data?.length) {
          const newCategoriesArr = [];
          response?.data?.data?.forEach(item => {
            newCategoriesArr.push({ value: item?.id, label: item?.name });
          });
          newCategoriesArr.unshift({
            value: "add",
            label: "+ Add New Category",
          });
          setCategories(newCategoriesArr);
        }
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

  const createVariant = async updatedVariantTypes => {
    const formData = new FormData();
    updatedVariantTypes?.forEach((variant, key) => {
      formData.append("choice[]", variant?.variantType);
      formData.append("choice_no[]", variant?.variantTypeId);

      if (variant?.variantValues?.length) {
        variant?.variantValues?.forEach(variantValue => {
          formData.append(
            `choice_options_${variantValue?.attribute_id}[]`,
            variantValue?.label
          );
        });
      }
    });

    const createVariantRes = await axios.post(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.CREATE_VARIANT}`,
      formData,
      {
        headers: headers,
      }
    );

    if (createVariantRes?.data?.success) {
      showToast("Variation Created Successfully", "success");
      setVariantTable(createVariantRes?.data?.data);
    } else {
      showToast("Variation Created Failure", "error");
    }
  };

  const addNewVariant = async () => {
    const makeVariantsArr = {
      variantType: variantAttribute[0]?.label,
      variantTypeId: variantAttribute[0]?.value,
      variantValues: tempVariantValues,
    };
    const updatedVariantTypes = [...selectVariantTypes, makeVariantsArr];
    setSelectVariantTypes(updatedVariantTypes);
    setIsOpenVariationOption(false);
    setVariantAttribute([]);
    setIsShowVariantValuesOption(false);
    setTempVariantValues([]);
    createVariant(updatedVariantTypes);
  };

  const handleIsDeleteVariantType = () => {
    const newSelectVariantAfterDelete = [
      ...selectVariantTypes?.slice(0, selectedIndexForDeleteVariantType),
      ...selectVariantTypes.slice(selectedIndexForDeleteVariantType + 1),
    ];
    setSelectVariantTypes(newSelectVariantAfterDelete);
    setIsOpenDeleteProductVariantTypeModal(false);
    createVariant(newSelectVariantAfterDelete);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  useEffect(() => {
    if (selectProductImage) {
      setProductPreviewImage(URL.createObjectURL(selectProductImage));
    }
  }, [selectProductImage]);

  useEffect(() => {
    fetchVariantAttributes();
  }, [fetchVariantAttributes]);

  const handleDeleteSingleVariant = () => {
    const newVariants = [
      ...variantTable?.slice(0, selectedDeleteVariant),
      ...variantTable.slice(selectedDeleteVariant + 1),
    ];
    setVariantTable(newVariants);
    setIsShowSingleVariantDeletePopup(false);
  };

  return (
    <section className="DashboardSetting">
      <HeaderDescription
        headerIcon={"flaticon-product"}
        title={"Add New Products"}
        subTitle={"Add new products in your shop"}
        search={false}
        order={false}
        videoLink={{
          video:
            "https://www.youtube.com/embed/u6C2KvB5Kzs?si=Qv2g-PI-ebPmsATK",
          title:
            "How to add your products & categories step by step in FunnelLiner",
        }}
        backbutton={true}
      />
      <Container maxWidth="lg">
        <div className="DashboardSettingTabs">
          <Box className={`boxShadow ${style.addProductPage}`}>
            <Formik
              initialValues={{
                product_name: "",
                selling_price: 0,
                category_id: "",
                discount_type: "fixed",
                delivery_charge: "",
                discount: 0,
                product_code: "",
                packaging_cost: "",
                transportation_cost: "",
                ad_budget_cost: "",
                buying_price: "",
                product_quantity: variantTable
                  ? getTotalQuantity(variantTable)
                  : "",
                inside_dhaka: "",
                video_url: [],
                outside_dhaka: "",
                subarea_charge: "",
                main_image: null,
                buying_price: "",
                transportation_cost: "",
                packaging_cost: "",
                delivery_cost_inside: "",
                delivery_cost_outside: "",
                ad_budget: "",
                status: "",
                product_type: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async data => {
                try {
                  const varitionPrice = variantTable.map(item => {
                    return item.price;
                  });
                  if (selectProductImage?.size > 4 * 1024 * 1024) {
                    showToast("Product image is too big !", "error");
                    return;
                  } else if (!selectedCategory.length) {
                    showToast("Category required", "error");
                    return;
                  } else if (selectProductImage === null) {
                    showToast("Product Image required", "error");
                    return;
                  } else if (
                    varitionPrice.some(
                      str => data?.selling_price < parseInt(str, 10)
                    )
                  ) {
                    showToast(
                      "Variation Price cannot be higher than Regular Price",
                      "error"
                    );
                    return;
                  }

                  data.size = "XL";
                  data.color = "white";
                  data.meta_tag = "buy";
                  data.meta_description = "IT was good and I like it";
                  const formData = new FormData();
                  formData.append("main_image", selectProductImage);

                  if (productGalleryImage.length) {
                    for (let i = 0; i < productGalleryImage.length; i++) {
                      formData.append(
                        "gallery_image[]",
                        productGalleryImage[i]
                      );
                    }
                  }
                  if (productGalleryVideos.length) {
                    for (let i = 0; i < productGalleryVideos.length; i++) {
                      formData.append("video_url[]", productGalleryVideos[i]);
                    }
                  }
                  if (selectedCategory.length) {
                    formData.append("category_id", selectedCategory[0]?.value);
                  }
                  formData.append("product_name", data.product_name);
                  formData.append("packaging_cost", data.packaging_cost || 0);
                  formData.append(
                    "transportation_cost",
                    data.transportation_cost || 0
                  );
                  formData.append("ad_budget_cost", data.ad_budget_cost || 0);
                  formData.append("buying_price", data.buying_price || 0);
                  formData.append("price", data.selling_price);
                  formData.append("discount", data?.discount);
                  formData.append("discount_type", data?.discount_type);
                  formData.append("size", data.size);
                  formData.append("color", data.color);
                  formData.append("product_code", data.product_code);
                  formData.append("product_qty", data.product_quantity);
                  formData.append("short_description", productShortDescription);
                  formData.append("long_description", productLongDescription);
                  formData.append("meta_tag", data.meta_tag);
                  formData.append("meta_description", data.meta_description);
                  formData.append("status", data.status);
                  formData.append("product_type", data.product_type);
                  if (deliverChargeType[0]?.value === "Free Delivery Charge") {
                    formData.append("delivery_charge", "free");
                  }
                  if (deliverChargeType[0]?.value === "Paid Delivery Charge") {
                    formData.append("delivery_charge", "paid");
                    formData.append("inside_dhaka", data.inside_dhaka);
                    formData.append("outside_dhaka", data.outside_dhaka);
                    formData.append(
                      "sub_area_charge",
                      data.subarea_charge || 0
                    );
                  }

                  if (variantTable?.length) {
                    const updatedData = variantTable.map(item => {
                      if (item.price === 0) {
                        const itemDiscountType =
                          item.discount_type || data.discount_type;
                        const itemDiscount =
                          item.discount !== undefined && item.discount !== null
                            ? item.discount
                            : data.discount;

                        let calculatedPrice = data.selling_price;

                        if (itemDiscount) {
                          calculatedPrice =
                            itemDiscountType === "fixed"
                              ? data.selling_price - itemDiscount
                              : data.selling_price -
                                data.selling_price * (itemDiscount / 100);
                        }

                        return {
                          ...item,
                          price: calculatedPrice,
                          discount: itemDiscount,
                          discount_type: itemDiscountType,
                        };
                      } else {
                        return item;
                      }
                    });
                    // console.log("updatedData",updatedData)
                    const variantTableJson = JSON.stringify(updatedData);
                    formData.append("variants", variantTableJson);
                    variantTable?.forEach((variantValue, index) => {
                      formData.append(`media_${index}`, variantValue?.media);
                    });
                  }

                  selectVariantTypes?.forEach(variant => {
                    formData.append("choice[]", variant?.variantType);
                    formData.append("choice_no[]", variant?.variantTypeId);
                    if (variant?.variantValues?.length) {
                      variant?.variantValues?.forEach(variantValue => {
                        formData.append(
                          `choice_options_${variantValue?.attribute_id}[]`,
                          variantValue?.label
                        );
                      });
                    }
                  });
                  startLoading();
                  const createProductRes = await axios.post(
                    `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.CREATE_PRODUCTS}`,
                    formData,
                    { headers: headers }
                  );

                  if (createProductRes?.data?.success) {
                    showToast("Product Create Successfully", "success");
                    router.push("/product");
                  } else {
                    showToast("Product Created Failure", "error");
                  }
                } catch (e) {
                  const err = e?.response;
                  if (err?.data?.errors) {
                    Object.keys(err.data.errors).forEach(key => {
                      const errorMessage = err.data.errors[key]?.[0] || err.data.errors[key];
                      showToast(errorMessage, "error");
                    });
                  } else if (err?.data?.message) {
                    showToast(err.data.message, "error");
                  } else if (err?.status === 413) {
                    showToast("File too large! Please reduce image/video size.", "error");
                  } else {
                    showToast("Something went wrong! Please try again.", "error");
                  }
                } finally {
                  stopLoading();
                }
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className={style.AddProduct}>
                    <div className={`${style.sectionCard} ${style.headerSection}`}>
                      <div className={style.header}>
                        <h4>Add Products</h4>
                        <p>This will be displayed on your product page</p>
                      </div>
                    </div>
                    <div className={style.sectionCard}>
                      <h5 className={style.sectionTitle}>Basic information</h5>
                      <p className={style.sectionSubtitle}>Name, pricing, category and delivery</p>
                      <div className={style.FormValidation}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <div className={style.formGroup}>
                            <label>
                              Product Name <span>*</span>
                            </label>
                            <Field
                              type="text"
                              placeholder="Enter product name here"
                              name="product_name"
                            />
                            <ErrorMessage
                              name="product_name"
                              component="div"
                              className="error"
                            />
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <div className={`${style.formGroup} ${style.regularPrice}`}>
                            <label>
                              Regular Price <span>*</span>
                            </label>
                            <Field
                              type="number"
                              min="0"
                              placeholder="Example: 599"
                              name="selling_price"
                              style={{
                                WebkitAppearance: "none",
                                margin: 0,
                                MozAppearance: "textfield",
                              }}
                              onWheel={e => e.target.blur()}
                            />
                            <ErrorMessage
                              name="selling_price"
                              component="div"
                              className="error"
                            />
                            <div className={style.absulatePrice}>
                              <h6 style={{ color: "#4d4d4d" }}>
                                Price: <i className="flaticon-taka" />
                                {values.discount > 0
                                  ? values.discount_type === "fixed"
                                    ? values.selling_price - values.discount
                                    : values.selling_price -
                                      values?.selling_price *
                                        (values.discount / 100)
                                  : ""}
                                {values.discount > 0 && (
                                  <del style={{ color: "#999" }}>
                                    <i className="flaticon-taka" />{" "}
                                    {values.selling_price > 0
                                      ? values.selling_price
                                      : ""}
                                  </del>
                                )}
                              </h6>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={3}
                          className={style.ToggleButtonGroupDiv}
                        >
                          <label>
                            Discount Type
                            {/* <span>*</span> */}
                          </label>
                          <ToggleButtonGroup
                            name="discount_type"
                            color="primary"
                            value={values.discount_type}
                            exclusive
                            // onChange={handleChange}
                            onChange={(event, newAlignment) => {
                              setFieldValue("discount_type", newAlignment);

                              if (newAlignment === "fixed") {
                                setFieldValue("discount", "0.00");
                              }
                              if (newAlignment === "percentage") {
                                setFieldValue("discount", null);
                              }
                            }}
                            aria-label="Platform"
                            className={style.ToggleButtonGroup}
                          >
                            <ToggleButton value="percentage">
                              Parcentage
                            </ToggleButton>
                            <ToggleButton value="fixed">
                              Fixed Amount
                            </ToggleButton>
                          </ToggleButtonGroup>

                          <ErrorMessage
                            name="discount_type"
                            component="div"
                            className="error"
                          />
                        </Grid>

                        {/* {console.log(values)} */}
                        <Grid item xs={12} sm={2}>
                          <div className={`${style.formGroup} ${style.My__parsentens}`}>
                            <label>Discount</label>
                            <Field
                              name="discount"
                              type="number"
                              min="0"
                              placeholder="Example: 599"
                              onWheel={e => e.target.blur()}
                            />
                            <span>
                              {values.discount_type === "percentage" ? "%" : ""}
                            </span>
                          </div>
                          <div>
                            <ErrorMessage
                              name="discount"
                              component="div"
                              className="error"
                            />
                          </div>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <div className={style.formGroup}>
                            <label>
                              Product Code <span>*</span>
                            </label>
                            <Field
                              name="product_code"
                              type="text"
                              placeholder="Example: A103"
                            />
                            <ErrorMessage
                              name="product_code"
                              component="div"
                              className="error"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className={style.formGroup}>
                            <label>
                              Available Quantity <span>*</span>
                            </label>
                            <Field
                              type="number"
                              min="0"
                              disabled={variantTable.length > 0 ? true : false}
                              value={
                                variantTable.length > 0
                                  ? getTotalQuantity(variantTable)
                                  : values?.product_quantity
                              }
                              placeholder="Enter available quantity here"
                              name="product_quantity"
                              onChange={e => {
                                setFieldValue(
                                  "product_quantity",
                                  e.target.value
                                );
                              }}
                              onWheel={e => e.target.blur()}
                            />
                            <ErrorMessage
                              name="product_quantity"
                              component="div"
                              className="error"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className={`${style.formGroup} ${style.SelectDropdown}`}>
                            <label>
                              Category Name <span>*</span>
                            </label>
                            <Select
                              options={categories}
                              onChange={selectedOption => {
                                setFieldValue(
                                  "category_id",
                                  selectedOption.value
                                );
                                if (selectedOption.value === "add") {
                                  setOpenAddCategoryPopup(true);
                                } else {
                                  setSelectedCategory([
                                    {
                                      value: selectedOption.value,
                                      label: selectedOption.label,
                                    },
                                  ]);
                                }
                              }}
                              menuPosition="fixed"
                              // value={ values?.category_id }
                            />

                            <ErrorMessage
                              name="category_id"
                              component="div"
                              className="error"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className={style.formGroup}>
                            <label>
                              Delivery Charge <span>*</span>
                            </label>
                            <Select
                              options={DELIVERY_CHARGE_DATA}
                              onChange={selectedOption => {
                                setFieldValue(
                                  "delivery_charge",
                                  selectedOption.value
                                );
                                setDeliveryChargeType([
                                  {
                                    value: selectedOption.value,
                                    label: selectedOption.label,
                                  },
                                ]);
                              }}
                              menuPosition="fixed"
                              // value={values.delivery_charge}
                            />
                            {deliverChargeType[0]?.value ===
                            "Paid Delivery Charge" ? (
                              <div className={style.duelInput}>
                                <div className={style.customInput}>
                                  <label>
                                    {" "}
                                    Delivery charge in{" "}
                                    {busInfo?.default_delivery_location
                                      ? busInfo?.default_delivery_location
                                      : "Dhaka"}{" "}
                                  </label>
                                  <Field
                                    type="number"
                                    min="0"
                                    onWheel={e => e.target.blur()}
                                    placeholder="Delivery charge in Dhaka"
                                    name="inside_dhaka"
                                  />
                                </div>

                                <div className={style.customInput}>
                                  <label>
                                    Delivery charge out of{" "}
                                    {busInfo?.default_delivery_location
                                      ? busInfo?.default_delivery_location
                                      : "Dhaka"}
                                  </label>
                                  <Field
                                    type="number"
                                    min="0"
                                    onWheel={e => e.target.blur()}
                                    name="outside_dhaka"
                                    placeholder="Delivery charge out of Dhaka"
                                  />
                                </div>
                                <div
                                  className=""
                                  style={{ marginTop: "10px", width: "100%" }}
                                >
                                  <label>Sub Area Charge (Optional)</label>
                                  <Field
                                    type="number"
                                    min="0"
                                    onWheel={e => e.target.blur()}
                                    name="subarea_charge"
                                    placeholder="Sub area (Optional)"
                                  />
                                </div>
                              </div>
                            ) : null}
                            <ErrorMessage
                              name="delivery_charge"
                              component="div"
                              className="error"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className={style.formGroup}>
                            <label>
                              Main Image (Recommended Size 600×600px){" "}
                              <span>*</span>
                            </label>
                            <div className={style.imgUploader}>
                              <input
                                accept="image/*"
                                type="file"
                                id="select-image"
                                style={{ display: "none" }}
                                onChange={e => {
                                  setFieldValue(
                                    "main_image",
                                    e.currentTarget.files[0]
                                  );
                                  setSelectProductImage(e.target.files[0]);
                                }}
                              />

                              <label htmlFor="select-image">
                                <Button
                                  className={style.SelectImgButton}
                                  variant="contained"
                                  color="primary"
                                  component="span"
                                >
                                  Upload Image
                                </Button>
                              </label>
                              {productPreviewImage && selectProductImage ? (
                                <Box mt={2} textAlign="center">
                                  <img
                                    src={productPreviewImage}
                                    alt={selectProductImage.name}
                                    height="100px"
                                  />
                                </Box>
                              ) : null}
                            </div>

                            <ErrorMessage
                              name="main_image"
                              component="div"
                              className="error"
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className={style.formGroup}>
                            <div className="EditTheme CustomeInput">
                              <label>
                                Gallery Images (Max 5, 600×600px)
                              </label>
                              <ProductImage
                                productImage={productGalleryImage}
                                setProductImage={setProductGalleryImage}
                                other_images={[]}
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className={style.formGroup}>
                            <div className="EditTheme CustomeInput">
                              <label>
                                Gallery Video (Max 5, YouTube links)
                              </label>
                              <ProductVideo
                                productVideoLinks={productGalleryVideos}
                                setProductGalleryVideos={setProductGalleryVideos}
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div className="product_sort_description">
                            <label>Product Short Description</label>
                            <div>
                              <QuillEditor
                                value={productShortDescription}
                                onChange={value =>
                                  setProductShortDescription(value)
                                }
                                placeholder="Please Describe  Your Product Short Description "
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div className="product_sort_description">
                            <label>Product Long Description</label>
                            <div>
                              <QuillEditor
                                value={productLongDescription}
                                onChange={value =>
                                  setProductLongDescription(value)
                                }
                                placeholder="Please Describe  Your Product Long Description "
                              />
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                    </div>
                    <div className={`${style.sectionCard} ${style.ProductsVariant}`}>
                      <h5 className={style.sectionTitle}>Product variants</h5>
                      <p className={style.sectionSubtitle}>Add size, color, weight or other options</p>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <div className={style.ProductsVariantContent}>
                            <h4>Products Variants</h4>

                            {isOpenVariationOption ? (
                              <React.Fragment>
                                <div className="customInput">
                                  <label>Variant Type</label>
                                  <div className={style.inputPlusDelete}>
                                    <Select
                                      className={style.fullWidth}
                                      options={variantAttributes}
                                      onChange={selectedOption => {
                                        if (selectedOption?.value === "add") {
                                          setOpenAddVariantAttributePopup(true);
                                        } else {
                                          setVariantAttribute([
                                            {
                                              value: selectedOption.value,
                                              label: selectedOption.label,
                                            },
                                          ]);
                                          fetchVariantValuesOnAttribute(
                                            selectedOption.value
                                          );
                                        }
                                      }}
                                      menuPosition="fixed"
                                      value={variantAttribute}
                                    />
                                    <Button
                                      className={style.delete}
                                      onClick={() => {
                                        setIsOpenVariationOption(false);
                                        setIsShowVariantValuesOption(false);
                                        setVariantAttribute([]);
                                      }}
                                    >
                                      <i className="flaticon-delete"></i>
                                    </Button>
                                  </div>
                                </div>
                                {isShowVariantValuesOption ||
                                variantAttributes ? (
                                  <React.Fragment>
                                    <div className="customInput">
                                      <label>Option name</label>
                                      <div className={style.inputPlusDelete}>
                                        <Select
                                          className={style.fullWidth}
                                          options={variantValues}
                                          isMulti
                                          onChange={selectedOption => {
                                            const catchAddOption =
                                              selectedOption.filter(
                                                item => item?.value === "add"
                                              );
                                            if (catchAddOption.length) {
                                              setOpenAddVariantAttributeValuePopup(
                                                true
                                              );
                                            } else {
                                              const filterVariantValues =
                                                selectedOption.filter(
                                                  item => item?.value !== "add"
                                                );
                                              setTempVariantValues(
                                                filterVariantValues
                                              );
                                            }
                                          }}
                                          menuPosition="fixed"
                                          value={tempVariantValues}
                                        />
                                      </div>
                                    </div>
                                    <div className={style.Submit}>
                                      <Button onClick={addNewVariant}>
                                        <i className="flaticon-install"> </i>
                                        Save Variant Type
                                      </Button>
                                    </div>
                                  </React.Fragment>
                                ) : null}
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <div className={style.empty}>
                                  <img
                                    src="/images/product-varient.png"
                                    alt=""
                                  />
                                </div>
                                <div className={style.AddNewProduct}>
                                  <Button
                                    onClick={() =>
                                      setIsOpenVariationOption(true)
                                    }
                                  >
                                    <i className="flaticon-plus"></i>
                                    Add Product Variants Like Size , Color,
                                    Weight
                                  </Button>
                                </div>
                              </React.Fragment>
                            )}
                          </div>
                          {selectVariantTypes?.length ? (
                            <React.Fragment>
                              {selectVariantTypes?.map((item, index) => (
                                <div
                                  key={index}
                                  className={style.ProductsVariantsLists}
                                >
                                  <div
                                    className={style.ProductsVariantsListsItem}
                                  >
                                    {/* left */}
                                    <div
                                      className={
                                        style.ProductsVariantsListsItemLeft
                                      }
                                    >
                                      <h5>
                                        {index + 1} . {item?.variantType}
                                      </h5>
                                      {item?.variantValues?.length
                                        ? item?.variantValues?.map(
                                            singleItem => (
                                              <span>{singleItem?.label}</span>
                                            )
                                          )
                                        : null}
                                    </div>
                                    {/* right */}
                                    <div
                                      className={
                                        style.ProductsVariantsListsItemRight
                                      }
                                    >
                                      <Button
                                        className={style.delete}
                                        onClick={() => {
                                          setIsOpenDeleteProductVariantTypeModal(
                                            true
                                          );
                                          setSelectedIndexForDeleteVariantType(
                                            index
                                          );
                                        }}
                                      >
                                        <i className="flaticon-delete"></i>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {/* <div className={style.Submit}>
                                <Button onClick={createVariant}>
                                  <i className="flaticon-install"> </i>
                                  Save Variants
                                </Button>
                              </div> */}
                            </React.Fragment>
                          ) : null}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <div className={style.ProductVarientTable}>
                            <table>
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>Variant</th>
                                  <th>Price</th>
                                  <th>Discount Type</th>
                                  <th>Discount Price</th>
                                  <th>Product Code</th>
                                  <th>Qty</th>
                                  <th>Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {variantTable?.length
                                  ? variantTable?.map((variant, index) => (
                                      <tr key={variant.id}>
                                        <td>
                                          {variant?.media === null ? (
                                            <div className={style.img}>
                                              <img
                                                src="images/blank-img.png"
                                                alt=""
                                              />
                                              <div className={style.overlay}>
                                                <input
                                                  type="file"
                                                  key={variant.id}
                                                  onChange={e => {
                                                    const newVariants = [
                                                      ...variantTable,
                                                    ];
                                                    newVariants[index].media =
                                                      e.target.files[0];
                                                    setVariantTable(
                                                      newVariants
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          ) : (
                                            <img
                                              src={URL.createObjectURL(
                                                variant?.media
                                              )}
                                              alt=""
                                            />
                                          )}
                                        </td>

                                        <td className={style.varient}>
                                          <input
                                            type="text"
                                            placeholder="20/Blue"
                                            value={variant?.variant}
                                            onChange={e => {
                                              const newVariants = [
                                                ...variantTable,
                                              ];
                                              newVariants[index].variant =
                                                e.target.value;
                                              setVariantTable(newVariants);
                                            }}
                                          />
                                        </td>
                                        <td className={style.price}>
                                          <i className="flaticon-taka"></i>
                                          <input
                                            type="text"
                                            className={style.tk}
                                            placeholder="Price"
                                            value={
                                              variant?.price === 0
                                                ? (() => {
                                                    const rowDiscountType =
                                                      variant?.discount_type ||
                                                      values.discount_type;
                                                    const rowDiscount =
                                                      variant?.discount !==
                                                        undefined &&
                                                      variant?.discount !== null
                                                        ? variant.discount
                                                        : values.discount;

                                                    if (!rowDiscount) {
                                                      return values.selling_price;
                                                    }

                                                    return rowDiscountType ===
                                                      "fixed"
                                                      ? values.selling_price -
                                                          rowDiscount
                                                      : values.selling_price -
                                                          values?.selling_price *
                                                            (rowDiscount /
                                                              100);
                                                  })()
                                                : variant?.price
                                            }
                                            onChange={e => {
                                              const newVariants = [
                                                ...variantTable,
                                              ];
                                              newVariants[index].price =
                                                e.target.value;

                                              setVariantTable(newVariants);
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <select
                                            value={
                                              variant?.discount_type ||
                                              values.discount_type
                                            }
                                            onChange={e => {
                                              const newVariants = [
                                                ...variantTable,
                                              ];
                                              newVariants[index].discount_type =
                                                e.target.value;
                                              setVariantTable(newVariants);
                                            }}
                                          >
                                            <option value="percentage">
                                              Percentage
                                            </option>
                                            <option value="fixed">Fixed</option>
                                          </select>
                                        </td>
                                        <td className={style.price}>
                                          <input
                                            type="number"
                                            className={style.tk}
                                            placeholder="Discount"
                                            value={
                                              variant?.discount ??
                                              values.discount
                                            }
                                            onChange={e => {
                                              const newVariants = [
                                                ...variantTable,
                                              ];
                                              newVariants[index].discount =
                                                e.target.value;
                                              setVariantTable(newVariants);
                                            }}
                                          />
                                        </td>
                                        <td className={style.varient}>
                                          <input
                                            type="text"
                                            placeholder="Product Code"
                                            value={variant?.product_code}
                                            onChange={e => {
                                              const newVariants = [
                                                ...variantTable,
                                              ];
                                              newVariants[index].product_code =
                                                e.target.value;
                                              setVariantTable(newVariants);
                                            }}
                                          />
                                        </td>
                                        <td className={style.code}>
                                          <input
                                            type="text"
                                            placeholder="Quantity"
                                            value={variant?.quantity}
                                            onChange={e => {
                                              const newVariants = [
                                                ...variantTable,
                                              ];
                                              newVariants[index].quantity =
                                                e.target.value;
                                              setVariantTable(newVariants);
                                              setFieldValue(
                                                "product_quantity",
                                                getTotalQuantity(variantTable)
                                              );
                                            }}
                                          />
                                        </td>
                                        <td className={style.lastChild}>
                                          <div className={style.DhakaInCharge}>
                                            <input
                                              className={style.Dhaka}
                                              type="text"
                                              // placeholder="ঢাকার ভেতর ..."
                                              value={variant?.description}
                                              onChange={e => {
                                                const newVariants = [
                                                  ...variantTable,
                                                ];
                                                newVariants[index].description =
                                                  e.target.value;
                                                setVariantTable(newVariants);
                                              }}
                                            />
                                            {/* <Button
                                            onClick={() => {
                                              setSelectedDeleteVariant(index);
                                              setIsShowSingleVariantDeletePopup(
                                                true
                                              );
                                            }}
                                          >
                                            <i className="flaticon-delete"></i>
                                          </Button> */}
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  : null}
                              </tbody>
                            </table>
                          </div>
                        </Grid>
                      </Grid>
                    </div>

                    <div className={`${style.sectionCard} ${style.ProductsVariant}`}>
                      <h5 className={style.sectionTitle}>Status & type</h5>
                      <p className={style.sectionSubtitle}>Set product visibility and type</p>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <div className={style.ProductsVariantContent}>
                            <div className={style.FormValidation}>
                              <Grid container spacing={2}>
                                {/* <Grid item xs={12} sm={6}>
                                  <div className="">
                                    <label>Buying Price</label>
                                    <Field
                                      type="number"
                                      placeholder="Enter buying price"
                                      name="buying_price"
                                    />
                                    <ErrorMessage
                                      name="buying_price"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <div className="">
                                    <label>Transportation Cost</label>
                                    <Field
                                      type="number"
                                      placeholder="Enter transportation cost"
                                      name="transportation_cost"
                                    />
                                    <ErrorMessage
                                      name="transportation_cost"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <div className="">
                                    <label>Packaging Cost</label>
                                    <Field
                                      type="number"
                                      placeholder="Enter packaging cost"
                                      name="packaging_cost"
                                    />
                                    <ErrorMessage
                                      name="packaging_cost"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <div className="">
                                    <label>Ad Budget</label>
                                    <Field
                                      type="number"
                                      placeholder="Enter ad budget"
                                      name="ad_budget_cost"
                                    />
                                    <ErrorMessage
                                      name="ad_budget_cost"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid> */}
                                <Grid item xs={12} sm={4}>
                                  <div>
                                    <label>
                                      Status <span>*</span>
                                    </label>
                                    <select
                                      name="status"
                                      value={values.status}
                                      onChange={e =>
                                        setFieldValue("status", e.target.value)
                                      }
                                      className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                      {/* <option value="">Select Status</option> */}
                                      {STATUS_DATA.map((item, index) => (
                                        <option
                                          key={item.value}
                                          value={item.value}
                                        >
                                          {item.label}
                                        </option>
                                      ))}
                                    </select>

                                    <ErrorMessage
                                      name="status"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <div>
                                    <label>
                                      Product Type <span>(Option)</span>
                                    </label>
                                    <select
                                      name="product_type"
                                      value={values.product_type}
                                      onChange={e =>
                                        setFieldValue(
                                          "product_type",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                      {/* <option value="">Select Status</option> */}
                                      {PRODUCT_TYPE_DATA.map((item, index) => (
                                        <option
                                          key={item.value}
                                          value={item.value}
                                        >
                                          {item.label}
                                        </option>
                                      ))}
                                    </select>

                                    <ErrorMessage
                                      name="status"
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid>
                              </Grid>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                  <div className={style.Submit}>
                    {isLoading ? (
                      <Button type="submit">
                        <Spinner />
                        Adding Product
                      </Button>
                    ) : (
                      <Button type="submit">
                        <i className="flaticon-install"> </i>
                        Add Product
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </div>
      </Container>
      {openAddCategoryPopup && (
        <AddProductCategory
          openModal={openAddCategoryPopup}
          closeModal={() => setOpenAddCategoryPopup(false)}
          setSelectedCategory={setSelectedCategory}
          fetchCategoriesData={fetchCategoriesData}
        />
      )}
      {openAddVariantAttributePopup ? (
        <AddProductVariantType
          openModal={openAddVariantAttributePopup}
          closeModal={() => setOpenAddVariantAttributePopup(false)}
          setVariantAttribute={setVariantAttribute}
          fetchVariantAttributes={fetchVariantAttributes}
          handelFetch={handelFetch}
        />
      ) : null}
      {openAddVariantAttributeValuePopup ? (
        <AddVariantAttributeValue
          openModal={openAddVariantAttributeValuePopup}
          closeModal={() => setOpenAddVariantAttributeValuePopup(false)}
          // setSelectedCategory={setVariantAttribute}
          variantAttributeId={variantAttribute[0]?.value}
          fetchVariantValuesOnAttribute={fetchVariantValuesOnAttribute}
        />
      ) : null}
      {isOpenDeleteProductVariantTypeModal ? (
        <DeleteVariantAttributeWithValue
          openModal={isOpenDeleteProductVariantTypeModal}
          closeModal={() => setIsOpenDeleteProductVariantTypeModal(false)}
          handleIsDeleteVariantType={handleIsDeleteVariantType}
        />
      ) : null}

      {isShowSingleVariantDeletePopup ? (
        <DeleteSingleVariant
          openModal={isShowSingleVariantDeletePopup}
          closeModal={() => setIsShowSingleVariantDeletePopup(false)}
          handleIsDeleteSingleVariant={handleDeleteSingleVariant}
        />
      ) : null}
    </section>
  );
};

export default AddProduct;
