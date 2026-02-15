import { Box, Container, Grid, Button ,ToggleButtonGroup, ToggleButton } from "@mui/material";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import { Field, Form, Formik, ErrorMessage } from "formik";
import style from "./addProduct.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import axios from "axios";
import { headers } from "../../../pages/api";
import Select from "react-select";
import AsyncSelect from 'react-select';
import AddProductCategory from "./AddProductCategory";
import { DELIVERY_CHARGE_DATA } from "../../../constant/Product";
import ProductImage from "../../edit-theme/ProductImage";
import QuillEditor from "../Description/Description";
import AddProductVariantType from "./AddProductVarintTypePopup";
import DeleteVariantAttributeWithValue from "./DeleteVariantAttributeWithValueModal";
import { useToast } from "../../../hook/useToast";
import DeleteSingleVariant from "./DeleteSingleVariantModal";
import * as Yup from "yup";
import { useRouter } from "next/router";
import AddVariantAttributeValue from "./AddVariantAttributeValuePopup";

const validationSchema = Yup.object({
  product_name: Yup.string().required("Product Name is required"),
  selling_price: Yup.string().required("Selling Price is required"),
  product_code: Yup.string().required("Product Code is required"),
  product_quantity: Yup.string().required("Product Quantity is required"),
});

const ViewProduct = () => {
  const router = useRouter();
  const showToast = useToast();
  const [categories, setCategories] = useState([]);
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
  const [productDetails, setProductDetails] = useState()

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
    const productDetailsRes = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_PRODUCT_DETAILS}${router?.query?.id}`, {
      headers: headers,
    });
    if (productDetailsRes?.data?.success) {
      setProductDetails(productDetailsRes?.data?.data)
      setVariantTable(productDetailsRes?.data?.data?.variations)

      const makeVariantAttributesArr = [];
      productDetailsRes?.data?.data?.attributes.forEach(item => {
        makeVariantAttributesArr.push({
          variantType: item?.key,
          variantTypeId: item?.id,
          variantValues: item?.values,
        });
      });

      setSelectVariantTypes(makeVariantAttributesArr)
    }
  }, [router?.query?.id])

  useEffect(() => {
    fetchProductDetails()
  }, [fetchProductDetails])

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



  const createVariant = async () => {
    const formData = new FormData();

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

  const addNewVariant = () => {
    const makeVariantsArr = {
      variantType: variantAttribute[0]?.label,
      variantTypeId: variantAttribute[0]?.value,
      variantValues: tempVariantValues,
    };
    setSelectVariantTypes([...selectVariantTypes, makeVariantsArr]);
    setIsOpenVariationOption(false);
    setVariantAttribute([]);
    setIsShowVariantValuesOption(false);
    setTempVariantValues([]);
  };

  const handleIsDeleteVariantType = () => {
    const newSelectVariantAfterDelete = [
      ...selectVariantTypes?.slice(0, selectedIndexForDeleteVariantType),
      ...selectVariantTypes.slice(selectedIndexForDeleteVariantType + 1),
    ];
    setSelectVariantTypes(newSelectVariantAfterDelete);
    setIsOpenDeleteProductVariantTypeModal(false);
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
    const value = productDetails?.delivery_charge === 'free' ? 'Free Delivery Charge' : 'Paid Delivery Charge'
    const defaultCategory = DELIVERY_CHARGE_DATA.find(
      item => item.value === value
    );
    
    setDeliveryChargeType([defaultCategory] || []);
  }, [productDetails]);

  return (
    <section className="DashboardSetting">
      <HeaderDescription
        headerIcon={"flaticon-product"}
        title={"Add New Products"}
        subTitle={"Add new products in your shop"}
        search={false}
        order={false}
      />
      <Container maxWidth="sm">
        <div className="DashboardSettingTabs">
          <Box className="boxShadow">
            <Formik
              enableReinitialize={true}
              initialValues={{
                product_name: productDetails?.product_name ? productDetails?.product_name : '',
                selling_price: productDetails?.price ? productDetails?.price : 0,
                discount: productDetails?.discount ? productDetails?.discount : 0,
                discount_type: productDetails?.discount_type ? productDetails?.discount_type : '',
                product_code: productDetails?.product_code ? productDetails?.product_code : '',
                product_quantity: productDetails?.product_qty ? productDetails?.product_qty : 0,
                inside_dhaka: productDetails?.inside_dhaka ? productDetails?.inside_dhaka : 0,
                outside_dhaka: productDetails?.outside_dhaka ? productDetails?.outside_dhaka : 0,
                subarea_charge: productDetails?.sub_area_charge ? productDetails?.sub_area_charge : 0,
              }}
              validationSchema={validationSchema}
              onSubmit={async data => {
                if (selectProductImage?.size > 1024 * 1024) {
                  showToast("Product image is too big !", "error");
                  return;
                } else if (!selectedCategory.length) {
                  showToast("Category required", "error");
                  return;
                } else if (selectProductImage === null) {
                  showToast("Product Image required", "error");
                  return;
                }

                data.size = "XL";
                data.color = "white";
                data.meta_tag = "buy";
                data.meta_description = "IT was good and I like it";
                data.status = "1";

                const formData = new FormData();
                formData.append('_method', "patch")
                // if (selectProductImage === undefined) {
                //   formData.append("main_image", productDetails?.main_image);
                // } else {
                //   formData.append("main_image", selectProductImage);
                // }

                if (selectedCategory.length) {
                  formData.append("category_id", selectedCategory[0]?.value);
                }
                formData.append("product_name", data.product_name);
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
                if (deliverChargeType[0]?.value === "Free Delivery Charge") {
                  formData.append("delivery_charge", "free");
                }
                if (deliverChargeType[0]?.value === "Paid Delivery Charge") {
                  formData.append("delivery_charge", "paid");
                  formData.append("inside_dhaka", data.inside_dhaka);
                  formData.append("outside_dhaka", data.outside_dhaka);
                }

                if (variantTable?.length) {
                  const variantTableJson = JSON.stringify(variantTable);
                  formData.append("variants", variantTableJson);
                  variantTable?.forEach((variantValue, index) => {
                    formData.append(`media_${index}`, variantValue?.media === undefined ? null : variantValue?.media);
                  });
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



                const createProductRes = await axios.post(
                  `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_PRODUCT_DETAILS}${router?.query?.id}`,
                  formData,
                  { headers: headers }
                );

                if (createProductRes?.data?.success) {
                  showToast("Product Updated Successfully", "success");
                  router.push("/product");
                } else {
                  showToast("Product Update Failure", "error");
                }
              }}
            >
              {({ values ,setFieldValue }) => (
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
                              disabled
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
                            disabled
                              type="number"
                              placeholder="Example: 599"
                              name="selling_price"
                            />
                            <ErrorMessage
                              name="selling_price"
                              component="div"
                              className="error"
                            />
                              <div className={style.absulatePrice}>
                              <h6 tyle={{color : "#4d4d4d"}}>
                                Price: <i className="flaticon-taka" /> {values.discount > 0 ? values.discount_type === 'flat' ? values.selling_price - values.discount : values.selling_price - (values?.selling_price * (values.discount / 100)) : ''}

                                {
                                  values.discount > 0 && <del style={{color : "#999"}}><i className="flaticon-taka" /> {values.selling_price > 0 ? values.selling_price : ''}</del>
                                }

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
                            disabled
                            value={values.discount_type}
                            exclusive
                            // onChange={handleChange}
                            onChange={(event, newAlignment) => {
                              setFieldValue("discount_type", newAlignment);

                              // Update the default value of "discount" field
                              if (newAlignment === "flat") {
                                setFieldValue("discount", "0.00");
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
                            disabled
                              name="discount"
                              type="text"
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
                              disabled
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
                              type="text"
                              disabled
                              placeholder="Enter available quantity here"
                              name="product_quantity"
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
                              value={selectedCategory}
                              disabled={true}
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
                              disabled
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
                                  <label> Delivery charge in Dhaka </label>
                                  <Field
                                    type="text"
                                    disabled
                                    placeholder="Delivery charge in Dhaka"
                                    name="inside_dhaka"
                                  />
                                </div>

                                <div className={style.customInput}>
                                  <label>Delivery charge out of Dhaka</label>
                                  <Field
                                    type="text"
                                    disabled
                                    name="outside_dhaka"
                                    placeholder="Delivery charge out of Dhaka"
                                  />
                                </div>
                                <div className="" style={{ marginTop: "10px", width: "100%" }}>
                                  <label>Sub Area Charge (Optional)</label>
                                  <Field
                                    type="text"
                                    disabled
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
                              Product Main Image <span>*</span>
                            </label>
                            <div className={style.imgUploader}>
                              <input
                                accept="image/*"
                                disabled
                                type="file"
                                id="select-image"
                                style={{ display: "none" }}
                                onChange={e =>
                                  setSelectProductImage(e.target.files[0])
                                }
                              />

                              <label htmlFor="select-image">
                                <Button
                                  disabled
                                  className={style.SelectImgButton}
                                  variant="contained"
                                  color="primary"
                                  component="span"
                                >
                                  Upload Image
                                </Button>
                              </label>
                              {productDetails?.main_image !== null || (productPreviewImage && selectProductImage) ? (
                                <Box mt={2} textAlign="center">
                                  <img
                                    src={productDetails?.main_image ? productDetails?.main_image : productPreviewImage}
                                    alt={productDetails?.product_name}
                                    height="100px"
                                  />
                                </Box>
                              ) : null}
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div className="">
                            <div className="EditTheme  CustomeInput">
                              <label>Product Gallery Image (Maximum 5)</label>
                              <ProductImage
                                productImage={productGalleryImage}
                                setProductImage={setProductGalleryImage}
                                other_images={[]}
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
                                      disabled
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
                                      disabled
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
                                          disabled
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
                                    {/* <div className={style.Submit}>
                                      <Button onClick={addNewVariant}>
                                        <i className="flaticon-install"> </i>
                                        Save Variant Type
                                      </Button>
                                    </div> */}
                                  </>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <div className={style.empty}>
                                  <img
                                    disabled
                                    src="/images/product-varient.png"
                                    alt=""
                                  />
                                </div>
                                <div className={style.AddNewProduct}>
                                  <Button
                                    disabled
                                    onClick={() => setIsOpenVariationOption(true)}
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
                                        disabled
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
                                      <td>
                                        {variant?.media === null ? (
                                          <div className={style.img}>
                                            <img
                                              src="images/blank-img.png"
                                              alt=""
                                            />
                                            <div className={style.overlay}>
                                              <input
                                                disabled
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
                                              <Button   disabled>
                                                <i className="flaticon-close"></i>
                                              </Button>
                                            ) : null}
                                          </div>
                                        ) : (
                                          <img
                                            src={typeof variant?.media === 'string' ? variant?.media : URL.createObjectURL(variant?.media)}
                                            alt=""
                                          />
                                        )}
                                      </td>
                                      <td className={style.varient}>
                                        <input
                                          disabled
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
                                          disabled
                                          type="text"
                                          className={style.tk}
                                          placeholder="Price"
                                          value={
                                            variant?.price === 0
                                              ? values?.selling_price
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
                                          disabled
                                          type="text"
                                          placeholder="Product Code"
                                          value={variant?.code}
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
                                          disabled
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
                                          }}
                                        />
                                      </td>
                                      <td className={style.lastChild}>
                                        <div className={style.DhakaInCharge}>
                                          <input
                                            disabled
                                            className={style.Dhaka}
                                            type="text"
                                            placeholder="ঢাকার ভেতর ..."
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
                                          <Button
                                            disabled
                                            onClick={() => {
                                              setSelectedDeleteVariant(index);
                                              setIsShowSingleVariantDeletePopup(
                                                true
                                              );
                                            }}
                                          >
                                            <i className="flaticon-delete"></i>
                                          </Button>
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
                  {/* <div className={style.Submit}>
                    <Button type="submit">
                      <i className="flaticon-install"> </i>
                      Update Product
                    </Button>
                  </div> */}
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
};

export default ViewProduct;
