import {
  Box,
  Container,
  Grid,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import { Field, Form, Formik, ErrorMessage } from "formik";
import style from "./addProduct.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import axios from "axios";
import { headers } from "../../../pages/api";
import Select from "react-select";
import AsyncSelect from "react-select";
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
import useLoading from "../../../hook/useLoading";
import Spinner from "../../commonSection/Spinner/Spinner";
import Cookies from "js-cookie";
import { getTotalQuantity } from "../../../utlit/product";
import ProductVideo from "../../edit-theme/ProductVideo";

const validationSchema = Yup.object({
  product_name: Yup.string().required("Product Name is required"),
  selling_price: Yup.string().required("Selling Price is required"),
  product_code: Yup.string().required("Product Code is required"),
  product_quantity: Yup.string().required("Product Quantity is required"),
  discount: Yup.string()
    .test("valid-discount", "Invalid discount format", value => {
      return /^(\d+(\.\d{1,2})?%?)$/.test(value);
    })
    .test(
      "valid-discount-amount",
      "Discount cannot be higher than Regular Price ",
      function (value) {
        const numericValue = parseFloat(value?.replace("%", "") || 0);
        const sellingPrice = this.parent.selling_price;
        return numericValue <= sellingPrice;
      }
    )
    .transform(value => {
      return value ? value.replace("%", "") : "";
    }),
  // main_image: Yup.mixed()
  //   .test("valid-image-size", "Product image is too big!", (value) => {
  //     return !value || (value && value.size <= 1024 * 1024);
  //   })
  //   .required("Product Image required"),
});

const EditProduct = ({ busInfo }) => {
  const router = useRouter();
  const showToast = useToast();
  const productId = router.query.id?.toString().trim();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [productDetails, setProductDetails] = useState();
  const [categories, setCategories] = useState([]);
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [openAddCategoryPopup, setOpenAddCategoryPopup] = useState(false);
  const [openAddVariantAttributePopup, setOpenAddVariantAttributePopup] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [deliverChargeType, setDeliveryChargeType] = useState([]);
  const [selectProductImage, setSelectProductImage] = useState(null);
  const [productPreviewImage, setProductPreviewImage] = useState();
  const [productGalleryImage, setProductGalleryImage] = useState([]);
  const [productShortDescription, setProductShortDescription] = useState(
    productDetails?.short_description || ""
  );
  const [productLongDescription, setProductLongDescription] = useState(
    productDetails?.long_description || ""
  );
  const [isOpenVariationOption, setIsOpenVariationOption] = useState(false);
  const [productGalleryVideos, setProductGalleryVideos] = useState([
  ]);
  const [isShowVariantValuesOption, setIsShowVariantValuesOption] =
    useState(false);
  const [variantAttribute, setVariantAttribute] = useState([]);
  const [variantValues, setVariantValues] = useState([]);
  const [tempVariantValues, setTempVariantValues] = useState([]);
  const [selectVariantTypes, setSelectVariantTypes] = useState([]);
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

  useEffect(() => {
  if (productDetails?.video_url) {
    try {
      const videos = JSON.parse(productDetails.video_url);
      setProductGalleryVideos(videos);
    } catch (error) {
      console.error("Invalid video_url format", error);
    }
  }
}, [productDetails]);
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

  const fetchProductDetails = useCallback(async () => {
    if (!productId) return;
    if (productId && Number(productId) > 0) {
      const productDetailsRes = await axios.get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_PRODUCT_DETAILS}${productId}`,
        {
          headers: headers,
        }
      );
      if (productDetailsRes?.data?.success) {
        setProductDetails(productDetailsRes?.data?.data);

        const variations = productDetailsRes?.data?.data?.variations;
        if (Array.isArray(variations)) {
          const modifiedData = variations.map(item => ({
            ...item,
            product_code: item.code,
            code: undefined,
          }));
          setVariantTable(modifiedData);
        }
        setProductShortDescription(
          productDetailsRes?.data?.data?.short_description
        );
        setProductLongDescription(
          productDetailsRes?.data?.data?.long_description
        );

        const attributes = productDetailsRes?.data?.data?.attributes;
        const makeVariantAttributesArr = [];
        if (Array.isArray(attributes)) {
          attributes.forEach(item => {
            makeVariantAttributesArr.push({
              variantType: item?.key,
              variantTypeId: item?.id,
              variantValues: item?.values,
            });
          });
        }

        setSelectVariantTypes(makeVariantAttributesArr);
      }
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

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
  }, []);

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
          value: item?.value,
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

  const createVariant = async updatedVariantTypes => {
    try {
      const formData = new FormData();

      updatedVariantTypes?.forEach(variant => {
        formData.append("choice[]", variant?.variantType);
        formData.append("choice_no[]", variant?.variantTypeId);

        if (variant?.variantValues?.length) {
          variant?.variantValues?.forEach(variantValue => {
            formData.append(
              `choice_options_${variantValue?.attribute_id}[]`,
              variantValue?.value
            );
          });
        }
      });

      const createVariantRes = await axios.post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.CREATE_VARIANT}`,
        formData,
        { headers }
      );

      if (createVariantRes?.data?.success) {
        showToast("Variation Created Successfully", "success");
        setVariantTable(createVariantRes?.data?.data);
        console.log(createVariantRes);
      } else {
        showToast("Variation Created Failure", "error");
      }
    } catch (error) {
      console.error("Error creating variant:", error.response.status);
      if (error.response.status === 422) {
        setVariantTable([]);
      }
      // showToast("Something went wrong while creating variant", "error");
    }
  };

  const addNewVariant = () => {
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
  useEffect(() => {
    const defaultCategory = categories.find(
      item => item.value === productDetails?.category_id
    );
    setSelectedCategory([defaultCategory] || []);
  }, [productDetails]);

  useEffect(() => {
    const value =
      productDetails?.delivery_charge === "free"
        ? "Free Delivery Charge"
        : "Paid Delivery Charge";
    const defaultCategory = DELIVERY_CHARGE_DATA.find(
      item => item.value === value
    );

    setDeliveryChargeType([defaultCategory] || []);
  }, [productDetails]);

  console.log("variantTable ", variantTable);
  if (productId && Number(productId) > 0) {
    return (
      <section className="DashboardSetting">
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Add New Products"}
          subTitle={"Add new products in your shop"}
          search={false}
          order={false}
          backbutton={true}
        />
        <Container maxWidth="sm">
          <div className="DashboardSettingTabs">
            <Box className="boxShadow">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  product_name: productDetails?.product_name
                    ? productDetails?.product_name
                    : "",
                  selling_price: productDetails?.price
                    ? productDetails?.price
                    : 0,
                  packaging_cost: productDetails?.packaging_cost,
                  transportation_cost: productDetails?.transportation_cost,
                  ad_budget_cost: productDetails?.ad_budget_cost,
                  buying_price: productDetails?.buying_price,
                  discount: productDetails?.discount
                    ? productDetails?.discount
                    : 0,
                  discount_type: productDetails?.discount_type
                    ? productDetails?.discount_type
                    : "",
                  product_code: productDetails?.product_code
                    ? productDetails?.product_code
                    : "",
                  product_quantity:
                    variantTable.length > 0
                      ? getTotalQuantity(variantTable)
                      : productDetails?.product_qty
                      ? productDetails?.product_qty
                      : 0,
                  inside_dhaka: productDetails?.inside_dhaka
                    ? productDetails?.inside_dhaka
                    : 0,
                  outside_dhaka: productDetails?.outside_dhaka
                    ? productDetails?.outside_dhaka
                    : 0,
                  subarea_charge: productDetails?.sub_area_charge
                    ? productDetails?.sub_area_charge
                    : 0,
                  status: productDetails?.status ? productDetails?.status : 0,
                  product_type: productDetails?.product_type
                    ? productDetails?.product_type
                    : "",
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
                    }
                    // else if (selectProductImage === null) {
                    //   showToast("Product Image required", "error");
                    //   return;
                    // }
                    else if (
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
                    formData.append("_method", "patch");

                    formData.append("packaging_cost", data.packaging_cost ||0);
                    formData.append(
                      "transportation_cost",
                      data.transportation_cost || 0
                    );
                    formData.append("ad_budget_cost", data.ad_budget_cost || 0);
                    formData.append("buying_price", data.buying_price || 0);
                    // if (selectProductImage === undefined) {
                    //   formData.append("main_image", productDetails?.main_image);
                    // } else {
                    //   formData.append("main_image", selectProductImage);
                    // }
                    if (selectProductImage) {
                      formData.append(
                        "main_image",
                        selectProductImage
                          ? selectProductImage
                          : productDetails?.main_image
                      );
                    }
                    if (productGalleryVideos?.length) {
                      for (let i = 0; i < productGalleryVideos.length; i++) {
                        formData.append("video_url[]", productGalleryVideos[i]);
                      }
                    }
                    if (productGalleryImage?.length) {
                      for (let i = 0; i < productGalleryImage.length; i++) {
                        formData.append(
                          "gallery_image[]",
                          productGalleryImage[i]
                        );
                      }
                    }
                    if (selectedCategory.length) {
                      formData.append(
                        "category_id",
                        selectedCategory[0]?.value
                      );
                    }
                    formData.append("product_name", data.product_name);
                    formData.append("price", data.selling_price);
                    formData.append("discount", data?.discount);
                    formData.append("discount_type", data?.discount_type);
                    formData.append("size", data.size);
                    formData.append("color", data.color);
                    formData.append("product_code", data.product_code);
                    formData.append("product_qty", data.product_quantity);
                    formData.append(
                      "short_description",
                      productShortDescription
                        ? productShortDescription
                        : productDetails?.short_description
                    );
                    formData.append(
                      "long_description",
                      productLongDescription
                        ? productLongDescription
                        : productDetails?.long_description
                    );
                    formData.append("meta_tag", data.meta_tag);
                    formData.append("meta_description", data.meta_description);
                    formData.append("status", data.status);
                    formData.append("product_type", data.product_type);
                    if (
                      deliverChargeType[0]?.value === "Free Delivery Charge"
                    ) {
                      formData.append("delivery_charge", "free");
                    }
                    if (
                      deliverChargeType[0]?.value === "Paid Delivery Charge"
                    ) {
                      formData.append("delivery_charge", "paid");
                      formData.append("inside_dhaka", data.inside_dhaka);
                      formData.append("outside_dhaka", data.outside_dhaka);
                      formData.append(
                        "sub_area_charge",
                        data.subarea_charge || 0
                      );
                    }
                    // console.log(variantTable)
                    if (variantTable?.length > 0) {
                      formData.append("variants", JSON.stringify(variantTable));

                      variantTable.forEach((variantValue, index) => {
                        formData.append(
                          `media_${index}`,
                          variantValue?.media || null
                        );
                      });
                    } else {
                      formData.append("variants", JSON.stringify([]));
                    }

                    selectVariantTypes?.forEach(variant => {
                      formData.append("choice[]", variant?.variantType);
                      formData.append("choice_no[]", variant?.variantTypeId);
                      if (variant?.variantValues?.length) {
                        variant?.variantValues?.forEach(variantValue => {
                          formData.append(
                            `choice_options_${variantValue?.attribute_id}[]`,
                            variantValue?.value
                          );
                        });
                      }
                    });
                    startLoading();

                    let createProductRes;
                    if (productId && Number(productId) > 0) {
                      createProductRes = await axios.post(
                        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_PRODUCT_DETAILS}${productId}`,
                        formData,
                        { headers: headers }
                      );
                    }

                    if (createProductRes?.data?.success) {
                      showToast("Product Updated Successfully", "success");
                      router.push("/product");
                    }
                    // else {
                    //   showToast("Product Update Failure", "error");
                    // }
                  } catch (e) {
                    console.log(e);
                    if (e.response) {
                      Object.keys(e?.response?.data?.errors).forEach(key => {
                        const errorMessage = e?.response?.data?.errors[key][0];
                        showToast(errorMessage, "error");
                      });
                    } else {
                      showToast(
                        <>
                          <h5>Error: Request Entity Too Large</h5>
                        </>,
                        "error"
                      );
                    }
                  } finally {
                    stopLoading();
                  }
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className={style.AddProduct}>
                      <div className={style.header}>
                        <h4>Add Products</h4>
                        <p>This will be displayed on your product page</p>
                      </div>
                      <div className={style.FormValidation}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <div className="">
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
                            <div className="">
                              <label>
                                Regular Price <span>*</span>
                              </label>
                              <Field
                                type="number"
                                min="0"
                                onWheel={e => e.target.blur()}
                                placeholder="Example: 599"
                                name="selling_price"
                              />
                              <ErrorMessage
                                name="selling_price"
                                component="div"
                                className="error"
                              />
                              <div className={style.absulatePrice}>
                                <h6 tyle={{ color: "#4d4d4d" }}>
                                  Price: <i className="flaticon-taka" />{" "}
                                  {values.discount > 0
                                    ? values.discount_type === "flat"
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

                                // Update the default value of "discount" field
                                if (newAlignment === "flat") {
                                  setFieldValue("discount", "0");
                                } else {
                                  setFieldValue("discount", "%");
                                }
                              }}
                              aria-label="Platform"
                              className={style.ToggleButtonGroup}
                            >
                              <ToggleButton value="percent">
                                Parcentage
                              </ToggleButton>
                              <ToggleButton value="flat">
                                Fixed Amount
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </Grid>

                          {/* {console.log(values)} */}
                          <Grid item xs={12} sm={2}>
                            <div className="">
                              <label>Discount</label>
                              <Field
                                name="discount"
                                type="number"
                                min="0"
                                onWheel={e => e.target.blur()}
                                placeholder="Example: 599"
                              />
                            </div>
                            <ErrorMessage
                              name="discount"
                              component="div"
                              className="error"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className="">
                              <label>
                                Product Code <span>*</span>
                              </label>
                              <Field
                                type="text"
                                placeholder="Example: A103"
                                name="product_code"
                              />
                              <ErrorMessage
                                name="product_code"
                                component="div"
                                className="error"
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className="">
                              <label>
                                Available Quantity <span>*</span>
                              </label>
                              <Field
                                type="number"
                                min="0"
                                onWheel={e => e.target.blur()}
                                placeholder="Enter available quantity here"
                                name="product_quantity"
                                disabled={
                                  variantTable.length > 0 ? true : false
                                }
                                value={
                                  variantTable.length > 0
                                    ? getTotalQuantity(variantTable)
                                    : values?.product_quantity
                                }
                                onChange={e => {
                                  setFieldValue(
                                    "product_quantity",
                                    e.target.value
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="product_quantity"
                                component="div"
                                className="error"
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className={style.SelectDropdown}>
                              <label>
                                Category Name <span>*</span>
                              </label>
                              <AsyncSelect
                                key={productDetails?.id}
                                // value={selectedCategory}
                                defaultValue={categories.find(
                                  item =>
                                    item.value == productDetails?.category_id
                                )}
                                placeholder="Select an option..."
                                options={categories}
                                onChange={selectedOption => {
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
                              />

                              {/* <Select
                            defaultValue={categories.find(
                              item => item.value == productDetails?.category_id
                            )}
                              options={categories}
                              onChange={selectedOption => {
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
                              value={selectedCategory}
                            /> */}
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className="">
                              <label>
                                Delivery Charge <span>*</span>
                              </label>

                              <AsyncSelect
                                value={deliverChargeType}
                                placeholder="Select an option..."
                                options={DELIVERY_CHARGE_DATA}
                                onChange={selectedOption =>
                                  setDeliveryChargeType([
                                    {
                                      value: selectedOption.value,
                                      label: selectedOption.label,
                                    },
                                  ])
                                }
                              />

                              {/* <Select
                            defaultValue={DELIVERY_CHARGE_DATA.find(
                              item => item.value == productDetails?.delivery_charge
                            )}
                              options={DELIVERY_CHARGE_DATA}
                              onChange={selectedOption =>
                                setDeliveryChargeType([
                                  {
                                    value: selectedOption.value,
                                    label: selectedOption.label,
                                  },
                                ])
                              }
                              menuPosition="fixed"
                              value={deliverChargeType}
                            /> */}
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
                                        : "Dhaka"}{" "}
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
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className="">
                              <label>
                                Main Image(Recommended Size 600px * 600px){" "}
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

                                {productPreviewImage && selectProductImage && (
                                  <Box mt={2} textAlign="center">
                                    {/* <h6>Image Preview:</h6> */}
                                    <img
                                      src={productPreviewImage}
                                      alt={selectProductImage.name}
                                      Height="100px"
                                    />
                                  </Box>
                                )}
                                {productPreviewImage && selectProductImage ? (
                                  ""
                                ) : (
                                  <Box mt={2} textAlign="center">
                                    {/* <h6>Image Preview:</h6> */}
                                    <img
                                      src={productDetails?.main_image}
                                      alt={productDetails?.product_name}
                                      Height="100px"
                                    />
                                  </Box>
                                )}
                                {/* {productDetails?.main_image !== null ||
                              (productPreviewImage && selectProductImage) ? (
                                <Box mt={2} textAlign="center">
                                  <img
                                    src={
                                      productPreviewImage
                                        ? productPreviewImage
                                        : productDetails?.main_image
                                    }
                                    alt={productDetails?.product_name}
                                    height="100px"
                                  />
                                </Box>
                              ) : null} */}
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div className="">
                              <div className="EditTheme  CustomeInput">
                                <label>
                                  Gallery Images (Maximum 5, Recommended Size
                                  600px * 600px)
                                </label>
                                <ProductImage
                                  productImage={productGalleryImage}
                                  setProductImage={setProductGalleryImage}
                                  // other_images={[]}
                                  other_images={productDetails?.other_images}
                                />
                              </div>
                            </div>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <div className="">
                              <div className="EditTheme  CustomeInput">
                                <label>
                                  Gallery Video Link (Maximum 5, Youtube Video
                                  Link)
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
                      <div className={style.ProductsVariant}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <div className={style.ProductsVariantContent}>
                              <h4>Products Variants</h4>

                              {isOpenVariationOption ? (
                                <>
                                  <div className="customInput">
                                    <label>Variant Type</label>
                                    <div className={style.inputPlusDelete}>
                                      <Select
                                        className={style.fullWidth}
                                        options={variantAttributes}
                                        onChange={selectedOption => {
                                          if (selectedOption?.value === "add") {
                                            setOpenAddVariantAttributePopup(
                                              true
                                            );
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
                                  {isShowVariantValuesOption ? (
                                    <>
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
                                                    item =>
                                                      item?.value !== "add"
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
                                    </>
                                  ) : null}
                                </>
                              ) : (
                                <>
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
                                </>
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
                                      className={
                                        style.ProductsVariantsListsItem
                                      }
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
                                                <span>{singleItem?.value}</span>
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
                                    <th>Product Code</th>
                                    <th>Qty</th>
                                    <th>Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {variantTable?.length
                                    ? variantTable?.map((variant, index) => (
                                        <tr key={index}>
                                          {/* <td>
                                          {variant?.media === null ? (
                                            <div className={style.img}>
                                              <img
                                                src="images/blank-img.png"
                                                alt=""
                                              />
                                              <div className={style.overlay}>
                                                <input
                                                  type="file"
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

                                              {variant?.media !== null ? (
                                                <Button>
                                                  <i className="flaticon-close"></i>
                                                </Button>
                                              ) : null}
                                            </div>
                                          ) : (
                                            <img
                                              src={
                                                typeof variant?.media ===
                                                "string"
                                                  ? variant?.media
                                                  : URL.createObjectURL(
                                                      variant?.media
                                                    )
                                              }
                                              alt=""
                                            />
                                          )}
                                        </td> */}
                                          <td>
                                            <div className={style.img}>
                                              <img
                                                src={
                                                  variant?.media === null
                                                    ? "images/blank-img.png"
                                                    : typeof variant?.media ===
                                                      "string"
                                                    ? variant?.media
                                                    : variant?.media &&
                                                      URL.createObjectURL(
                                                        variant?.media
                                                      )
                                                }
                                                alt="ghfgh"
                                              />
                                              <div className={style.overlay}>
                                                <input
                                                  type="file"
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

                                              {/* {variant?.media !== null ? (
                                                <Button>
                                                  <i className="flaticon-close"></i>
                                                </Button>
                                              ) : null} */}
                                            </div>
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
                                                  ? values.discount_type ===
                                                    "flat"
                                                    ? values.selling_price -
                                                      values.discount
                                                    : values.selling_price -
                                                      values?.selling_price *
                                                        (values.discount / 100)
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
                                          <td className={style.varient}>
                                            <input
                                              type="text"
                                              placeholder="Product Code"
                                              defaultValue={
                                                variant?.product_code
                                              }
                                              onChange={e => {
                                                const newVariants = [
                                                  ...variantTable,
                                                ];
                                                newVariants[
                                                  index
                                                ].product_code = e.target.value;
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
                                            <div
                                              className={style.DhakaInCharge}
                                            >
                                              <input
                                                className={style.Dhaka}
                                                type="text"
                                                placeholder=""
                                                value={variant?.description}
                                                onChange={e => {
                                                  const newVariants = [
                                                    ...variantTable,
                                                  ];
                                                  newVariants[
                                                    index
                                                  ].description =
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
                    </div>
                    <div className={style.ProductsVariant}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <div className={style.ProductsVariantContent}>
                            {/* <h4>Product Cost</h4> */}
                            <div className={style.FormValidation}>
                              <Grid container spacing={2}>
                                {/* <Grid item xs={12} sm={6}>
                                  <div className="">
                                    <label>
                                      Buying Price <span>*</span>
                                    </label>
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
                                    <label>
                                      Transportation Cost <span>*</span>
                                    </label>
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
                                    <label>
                                      Packaging Cost <span>*</span>
                                    </label>
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
                                    <label>
                                      Ad Budget <span>*</span>
                                    </label>
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
                    <div className={style.Submit}>
                      {isLoading ? (
                        <Button type="submit" disabled>
                          <Spinner />
                          Updating Product
                        </Button>
                      ) : (
                        <Button type="submit">
                          <i className="flaticon-install"> </i>
                          Update Product
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </Box>
          </div>
        </Container>
        {openAddCategoryPopup ? (
          <AddProductCategory
            openModal={openAddCategoryPopup}
            closeModal={() => setOpenAddCategoryPopup(false)}
            setSelectedCategory={setSelectedCategory}
            fetchCategoriesData={fetchCategoriesData}
          />
        ) : null}
        {openAddVariantAttributePopup ? (
          <AddProductVariantType
            openModal={openAddVariantAttributePopup}
            closeModal={() => setOpenAddVariantAttributePopup(false)}
            setVariantAttribute={setVariantAttribute}
            fetchVariantAttributes={fetchVariantAttributes}
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
  }
};

export default EditProduct;
