import {
  Box,
  Container,
  Button,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import { Field, Form, Formik, ErrorMessage } from "formik";
import style from "./adCampaign.module.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import axios from "axios";
import { headers } from "../../../pages/api";
import Select from "react-select";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useToast } from "../../../hook/useToast";
import useLoading from "../../../hook/useLoading";
import useDebounce from "../../../hook/useDebounce";
import Spinner from "../../commonSection/Spinner/Spinner";

const AD_TYPE_OPTIONS = [
  { value: "social media", label: "Social Media" },
  { value: "google", label: "Google" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: 1, label: "Publish" },
  { value: 0, label: "Draft" },
];

const COUNTDOWN_OPTIONS = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Campaign name is required"),
  description: Yup.string().required("Description is required"),
  meta_title: Yup.string().required("Meta title is required"),
  meta_description: Yup.string().required("Meta description is required"),
  ad_type: Yup.string().required("Ad type is required"),
  is_active: Yup.number().required("Status is required"),
  has_countdown: Yup.number().required("Countdown selection is required"),
  countdown_start: Yup.string().when("has_countdown", {
    is: 1,
    then: Yup.string().required("Countdown start date is required"),
    otherwise: Yup.string().notRequired(),
  }),
  countdown_end: Yup.string().when("has_countdown", {
    is: 1,
    then: Yup.string().required("Countdown end date is required"),
    otherwise: Yup.string().notRequired(),
  }),
});

const BATCH_SIZE = 15;

const AdCampaign = ({ busInfo }) => {
  const router = useRouter();
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();

  // Selected product IDs for the campaign
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Product list state — accumulated across pages
  const [productList, setProductList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [productSearchValue, setProductSearchValue] = useState("");

  // Refs for infinite scroll
  const pageRef = useRef(1);
  const sentinelRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isFetchingRef = useRef(false);
  // Map of id -> name so chip labels survive across batches
  const productNameMapRef = useRef({});

  // ---- Fetch a single page and append to list ----
  const fetchPage = useCallback(
    async (page, searchTerm, reset = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (reset) setInitialLoading(true);
      else setLoadingMore(true);

      try {
        let response;
        if (searchTerm) {
          response = await axios.get(
            `${API_ENDPOINTS.BASE_URL}/client/products-for-search`,
            {
              headers,
              params: { search: searchTerm, page, perPage: BATCH_SIZE },
            }
          );
        } else {
          response = await axios.get(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_PRODUCTS}`,
            {
              headers,
              params: { page, perPage: BATCH_SIZE },
            }
          );
        }

        const items =
          response.data.data?.data || response.data.data || [];
        const lastPage =
          response.data?.last_page ||
          response.data?.data?.last_page ||
          1;

        // Cache names for chip display
        items.forEach((p) => {
          productNameMapRef.current[p.id] = p.product_name;
        });

        if (reset) {
          setProductList(items);
        } else {
          setProductList((prev) => [...prev, ...items]);
        }

        setHasMore(page < lastPage);
        pageRef.current = page;
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  // ---- Initial load ----
  useEffect(() => {
    pageRef.current = 1;
    fetchPage(1, "", true);
  }, []);

  // ---- Infinite scroll via IntersectionObserver ----
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isFetchingRef.current) {
          fetchPage(pageRef.current + 1, productSearchValue);
        }
      },
      {
        root: container,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, productSearchValue, fetchPage]);

  // ---- Debounced search ----
  const doSearch = useDebounce((term) => {
    pageRef.current = 1;
    setProductList([]);
    setHasMore(true);
    fetchPage(1, term, true);
  }, 500);

  const handleProductSearchChange = (e) => {
    const value = e.target.value;
    setProductSearchValue(value);
    doSearch(value);
  };

  // ---- Selection helpers ----
  const handleToggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    const currentIds = productList.map((p) => p.id);
    const allSelected = currentIds.every((id) =>
      selectedProducts.includes(id)
    );
    if (allSelected) {
      setSelectedProducts((prev) =>
        prev.filter((id) => !currentIds.includes(id))
      );
    } else {
      setSelectedProducts((prev) => {
        const newIds = currentIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p !== id));
  };

  const getProductLabel = (id) => {
    return productNameMapRef.current[id] || `Product #${id}`;
  };

  // ---- Form submit ----
  const handleSubmit = async (values, { resetForm }) => {
    if (selectedProducts.length === 0) {
      showToast("Please select at least one product", "error");
      return;
    }

    const payload = {
      name: values.name,
      description: values.description,
      meta_title: values.meta_title,
      meta_description: values.meta_description,
      ad_type: values.ad_type,
      ad_url: values.ad_url || "",
      ad_image_url: values.ad_image_url || "",
      ad_video_url: values.ad_video_url || "",
      is_active: values.is_active,
      has_countdown: values.has_countdown,
      countdown_start:
        values.has_countdown === 1 ? values.countdown_start : "",
      countdown_end: values.has_countdown === 1 ? values.countdown_end : "",
      products: selectedProducts,
    };

    try {
      startLoading();
      const res = await axios.post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CAMPAIGNS.CREATE_CAMPAIGN}`,
        payload,
        { headers }
      );
      if (res?.data?.success || res?.status === 200 || res?.status === 201) {
        showToast("Campaign created successfully!", "success");
        resetForm();
        setSelectedProducts([]);
      } else {
        showToast(res?.data?.message || "Something went wrong", "error");
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to create campaign",
        "error"
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <section className={style.AdCampaign}>
      <HeaderDescription
        headerIcon="flaticon-product"
        title="Ad Campaign"
        subTitle="Create a new ad campaign for your products"
        search={false}
        order={false}
        novideo={true}
      />

      <Container maxWidth="sm">
        <div className="boxShadow">
          <Formik
            initialValues={{
              name: "",
              description: "",
              meta_title: "",
              meta_description: "",
              ad_type: "social media",
              ad_url: "",
              ad_image_url: "",
              ad_video_url: "",
              is_active: 1,
              has_countdown: 0,
              countdown_start: "",
              countdown_end: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                {/* Basic Information */}
                <div className={style.sectionBox}>
                  <h4>Basic Information</h4>
                  <div className={style.FormValidation}>
                    {/* Name */}
                    <div className={style.customInput}>
                      <label className={style.mustBe}>
                        Campaign Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Enter campaign name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className={style.errorText}
                      />
                    </div>

                    {/* Description */}
                    <div className={style.customInput}>
                      <label className={style.mustBe}>
                        Description <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="description"
                        placeholder="Enter campaign description"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className={style.errorText}
                      />
                    </div>

                    {/* Meta Title */}
                    <div className={style.customInput}>
                      <label className={style.mustBe}>
                        Meta Title <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="meta_title"
                        placeholder="Enter meta title"
                      />
                      <ErrorMessage
                        name="meta_title"
                        component="div"
                        className={style.errorText}
                      />
                    </div>

                    {/* Meta Description */}
                    <div className={style.customInput}>
                      <label className={style.mustBe}>
                        Meta Description <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="meta_description"
                        placeholder="Enter meta description"
                      />
                      <ErrorMessage
                        name="meta_description"
                        component="div"
                        className={style.errorText}
                      />
                    </div>
                  </div>
                </div>

                {/* Ad Configuration */}
                <div className={style.sectionBox}>
                  <h4>Ad Configuration</h4>
                  <div className={style.FormValidation}>
                    {/* Ad Type */}
                    <div
                      className={`${style.customInput} ${style.SelectDropdown}`}
                    >
                      <label className={style.mustBe}>
                        Ad Type <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        options={AD_TYPE_OPTIONS}
                        value={AD_TYPE_OPTIONS.find(
                          (opt) => opt.value === values.ad_type
                        )}
                        onChange={(selected) =>
                          setFieldValue("ad_type", selected?.value)
                        }
                        placeholder="Select Ad Type"
                      />
                      <ErrorMessage
                        name="ad_type"
                        component="div"
                        className={style.errorText}
                      />
                    </div>

                    {/* Status */}
                    <div
                      className={`${style.customInput} ${style.SelectDropdown}`}
                    >
                      <label className={style.mustBe}>
                        Status <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        options={STATUS_OPTIONS}
                        value={STATUS_OPTIONS.find(
                          (opt) => opt.value === values.is_active
                        )}
                        onChange={(selected) =>
                          setFieldValue("is_active", selected?.value)
                        }
                        placeholder="Select Status"
                      />
                      <ErrorMessage
                        name="is_active"
                        component="div"
                        className={style.errorText}
                      />
                    </div>

                    {/* Ad URL */}
                    <div className={style.customInput}>
                      <label className={style.mustBe}>Ad URL</label>
                      <Field
                        type="text"
                        name="ad_url"
                        placeholder="Enter ad URL"
                      />
                    </div>

                    {/* Ad Image URL */}
                    <div className={style.customInput}>
                      <label className={style.mustBe}>Ad Image URL</label>
                      <Field
                        type="text"
                        name="ad_image_url"
                        placeholder="Enter ad image URL"
                      />
                    </div>

                    {/* Ad Video URL */}
                    <div className={style.customInputFull}>
                      <label className={style.mustBe}>Ad Video URL</label>
                      <Field
                        type="text"
                        name="ad_video_url"
                        placeholder="Enter ad video URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Countdown Section */}
                <div className={style.sectionBox}>
                  <h4>Countdown (Flash Sale)</h4>
                  <div className={style.FormValidation}>
                    {/* Has Countdown */}
                    <div
                      className={`${style.customInput} ${style.SelectDropdown}`}
                    >
                      <label className={style.mustBe}>
                        Enable Countdown{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        options={COUNTDOWN_OPTIONS}
                        value={COUNTDOWN_OPTIONS.find(
                          (opt) => opt.value === values.has_countdown
                        )}
                        onChange={(selected) =>
                          setFieldValue("has_countdown", selected?.value)
                        }
                        placeholder="Enable Countdown?"
                      />
                      <ErrorMessage
                        name="has_countdown"
                        component="div"
                        className={style.errorText}
                      />
                    </div>

                    {values.has_countdown === 1 && (
                      <>
                        {/* Countdown Start */}
                        <div className={style.customInput}>
                          <label className={style.mustBe}>
                            Countdown Start{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <Field
                            type="datetime-local"
                            name="countdown_start"
                          />
                          <ErrorMessage
                            name="countdown_start"
                            component="div"
                            className={style.errorText}
                          />
                        </div>

                        {/* Countdown End */}
                        <div className={style.customInput}>
                          <label className={style.mustBe}>
                            Countdown End{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <Field type="datetime-local" name="countdown_end" />
                          <ErrorMessage
                            name="countdown_end"
                            component="div"
                            className={style.errorText}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Products Section */}
                <div className={style.sectionBox}>
                  <h4>
                    Products{" "}
                    {selectedProducts.length > 0 && (
                      <span className={style.selectedCount}>
                        ({selectedProducts.length} selected)
                      </span>
                    )}
                  </h4>

                  {/* Selected Product Chips */}
                  {selectedProducts.length > 0 && (
                    <div className={style.productChips}>
                      {selectedProducts.map((id) => (
                        <span key={id} className={style.productChip}>
                          {getProductLabel(id)}
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(id)}
                            title="Remove product"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Product Search */}
                  <div className={style.productSearch}>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearchValue}
                      onChange={handleProductSearchChange}
                    />
                  </div>

                  {/* Scrollable Product Table */}
                  <div
                    className={style.productTable}
                    ref={scrollContainerRef}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>
                            <Checkbox
                              checked={
                                productList.length > 0 &&
                                productList.every((p) =>
                                  selectedProducts.includes(p.id)
                                )
                              }
                              indeterminate={
                                productList.some((p) =>
                                  selectedProducts.includes(p.id)
                                ) &&
                                !productList.every((p) =>
                                  selectedProducts.includes(p.id)
                                )
                              }
                              onChange={handleToggleAll}
                              size="small"
                            />
                          </th>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Price (BDT)</th>
                          <th>Quantity</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      {initialLoading ? (
                        <tbody>
                          <tr>
                            <td colSpan={6}>
                              <Box sx={{ width: "100%", padding: "10px" }}>
                                {[...Array(5)].map((_, index) => (
                                  <Skeleton
                                    width="100%"
                                    key={index}
                                    height={28}
                                  />
                                ))}
                              </Box>
                            </td>
                          </tr>
                        </tbody>
                      ) : productList.length > 0 ? (
                        <tbody>
                          {productList.map((product) => (
                            <tr
                              key={product.id}
                              className={
                                selectedProducts.includes(product.id)
                                  ? style.selectedRow
                                  : ""
                              }
                              onClick={() =>
                                handleToggleProduct(product.id)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <td>
                                <Checkbox
                                  checked={selectedProducts.includes(
                                    product.id
                                  )}
                                  onChange={() =>
                                    handleToggleProduct(product.id)
                                  }
                                  size="small"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <img
                                  src={
                                    product?.wp_product_id
                                      ? product?.wp_product_image_url
                                      : product?.main_image
                                  }
                                  alt={product?.product_name}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                              </td>
                              <td>
                                <Tooltip
                                  title={product?.product_name}
                                  placement="top-start"
                                >
                                  <span>
                                    {product?.product_name?.length < 25
                                      ? product?.product_name
                                      : `${product?.product_name?.slice(
                                          0,
                                          25
                                        )}...`}
                                  </span>
                                </Tooltip>
                              </td>
                              <td>{product?.price}</td>
                              <td>
                                {product?.product_qty >= 0 ? (
                                  product?.product_qty
                                ) : (
                                  <span style={{ color: "red" }}>
                                    Out {product?.product_qty}
                                  </span>
                                )}
                              </td>
                              <td>
                                {product?.status ? (
                                  <span className={style.statusActive}>
                                    Active
                                  </span>
                                ) : (
                                  <span className={style.statusInactive}>
                                    Inactive
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}

                          {/* Sentinel row — triggers next batch */}
                          <tr ref={sentinelRef} style={{ height: "1px" }}>
                            <td
                              colSpan={6}
                              style={{ padding: 0, border: "none" }}
                            >
                              {loadingMore && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    padding: "12px 0",
                                  }}
                                >
                                  <CircularProgress size={22} />
                                </Box>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td
                              colSpan={6}
                              style={{
                                textAlign: "center",
                                padding: "30px",
                                color: "#999",
                              }}
                            >
                              No products found
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>

                  {!initialLoading && !hasMore && productList.length > 0 && (
                    <p className={style.endOfList}>
                      All {productList.length} products loaded
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className={style.Submit}>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        <i className="flaticon-check-mark"></i> Create Campaign
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </section>
  );
};

export default AdCampaign;
