import { Box, Button, Grid, Modal } from "@mui/material";
import axios from "axios";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";
import useLoading from "../../hook/useLoading";
import { Fragment, useEffect, useState } from "react";
import SuperFetch from "../../hook/Axios";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import Spinner from "../commonSection/Spinner/Spinner";
import ProductImage from "../edit-theme/ProductImage";
const validationSchema = Yup.object({
  customer_name: Yup.string().required("Customer Name is required"),
  customer_phone: Yup.string()
    .required("Customer Contact No. is required")
    .matches(
      /^(?:\+8801|01)[3-9]\d{8}$/,
      "Customer Contact No. must be a valid "
    ),
  customer_address: Yup.string()
    .required("Customer Address is required")
    .min(10, "Customer Address must be at least 10 characters"),
  products: Yup.array().of(
    Yup.object().shape({
      product_id: Yup.string().required("Product is required"),
      product_qty: Yup.number()
        .typeError("Product quantity must be a number")
        .required("Product quantity is required")
        .min(1, "Product quantity must be at least 1"),
      shipping_cost: Yup.number()
        .typeError("Shipping cost must be a number")
        .required("Product quantity is required")
        .min(0, "Shipping cost cannot be negative"),
    })
  ),
  order_type: Yup.string().required("Order Source is required"),
});
function replaceEmptyStringsWithNull(arr) {
  return arr.map(item => (item === "" ? 0 : item));
}
const OrderUpdateModal = ({
  order,
  orderId,
  handleCloseOrderUpdateModal,
  modalOpenUpdate,
  products,
  handleFetch,
  orderUpdate,
  imagePermetions,
}) => {
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productGalleryImage, setProductGalleryImage] = useState([]);

  const OrderUpdate = async inputData => {
    try {
      const productIds = inputData.products.map(product => product.product_id);
      const selectedVariants = inputData.products.map(
        product => product.variant_id
      );
      const productQuantities = inputData.products.map(
        product => product.product_qty
      );
      const shippingCosts = inputData.products.map(
        product => product.shipping_cost
      );
      const data = {
        customer_name: inputData.customer_name,
        phone: inputData.customer_phone,
        address: inputData.customer_address,
        order_type: inputData.order_type,
        product_id: productIds,
        product_qty: productQuantities,
        shipping_cost: shippingCosts,
        variant_id: replaceEmptyStringsWithNull(selectedVariants),
        order_status: inputData.order_status,
        _method: "patch",
      };

      const formData = new FormData();
      formData.append("customer_name", data.customer_name);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("order_status", data.order_status);
      formData.append("order_type", data.order_type);
      formData.append("_method", data._method);

      if (productIds.length) {
        for (let i = 0; i < productIds.length; i++) {
          formData.append("product_id[]", productIds[i]);
        }
      }

      if (productQuantities.length) {
        for (let i = 0; i < productQuantities.length; i++) {
          formData.append("product_qty[]", productQuantities[i]);
        }
      }
      if (data.variant_id.length) {
        for (let i = 0; i < data.variant_id.length; i++) {
          formData.append("variant_id[]", data.variant_id[i]);
        }
      }

      if (shippingCosts.length) {
        for (let i = 0; i < shippingCosts.length; i++) {
          formData.append("shipping_cost[]", shippingCosts[i]);
        }
      }
      if (productGalleryImage.length) {
        for (let i = 0; i < productGalleryImage.length; i++) {
          formData.append("order_attach_img[]", productGalleryImage[i]);
        }
      }
      startLoading();
      const response = await SuperFetch.post(
        API_ENDPOINTS.ORDERS.ORDER_EDIT + orderId,
        formData,
        {
          headers: headers,
        }
      );
      if (response?.data?.data?.constructor === Object) {
        showToast("Order Update   Successfully !", "success");
        handleFetch();
      } else {
        showToast(response?.data?.message, "error");
      }
    } catch (error) {
      if (error?.response) {
        if (error.response.status === 400) {
          const errorMessages = error.response.data.errorMessages;
          const errorMessageStr = errorMessages
            .map(message => {
              return Object.values(message).join(", ");
            })
            .join(", ");
          showToast(errorMessageStr, "error");
        } else {
          Object.keys(error?.response?.data?.msg).forEach(key => {
            const errorMessage = error?.response?.data?.msg[key][0];
            showToast(errorMessage, "error");
          });
        }
      }
    } finally {
      stopLoading();
      handleCloseOrderUpdateModal();
      handleFetch();
    }
  };
  useEffect(() => {
    const defaultSelectedProducts =
      order?.order_details?.map(item => item?.product_id || "") || [];
    setSelectedProducts(defaultSelectedProducts);
  }, [order]);
  return (
    <Modal
      open={modalOpenUpdate}
      onClose={handleCloseOrderUpdateModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="viewModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="header">
            <div className="left">
              <i className="flaticon-edit"></i>
              <h4>Update Order Details</h4>
            </div>

            <div className="right" onClick={handleCloseOrderUpdateModal}>
              <i className="flaticon-close-1"></i>
            </div>
          </div>
          <Formik
            initialValues={{
              customer_name: order?.customer_name,
              customer_phone: order?.phone,
              customer_address: order?.address,
              order_type: order?.order_type,
              order_status: order?.order_status,
              products: order?.order_details?.map(item => ({
                product_id: item?.product_id,
                variant_id: item?.variant !== null ? item.variant : "",
                product_qty: item?.quantity,
                shipping_cost: item?.shipping_cost,
              })),
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              OrderUpdate(values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="updateModalForm OrderModal">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={7}>
                      <div className="customInput">
                        <label>
                          Enter Customer Name <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_name"
                          placeholder="Enter Customer Name"
                        />
                        <ErrorMessage
                          name="customer_name"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <div className="customInput">
                        <label>
                          Enter Customer Contact No. <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_phone"
                          defaultValue="+88"
                          placeholder="Enter Customer Contact No"
                          // defa
                        />
                        <ErrorMessage
                          name="customer_phone"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      <div className="customInput">
                        <label>
                          Enter Customer Address <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_address"
                          placeholder="Enter Customer Address"
                        />
                        <ErrorMessage
                          name="customer_address"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <div className="customInput">
                        <label>
                          Order Source<span>*</span>
                        </label>

                        <Field component="select" name="order_type">
                          <option value="">Select Order Source</option>

                          <option key={"social"} value={"social"}>
                            Social Media
                          </option>
                          <option key={"phone"} value={"phone"}>
                            Phone Call
                          </option>
                          <option key={"landing"} value={"landing"}>
                            Landing
                          </option>
                          <option key={"website"} value={"website"}>
                            Website
                          </option>
                          <option key={"woocommerce"} value={"woocommerce"}>
                            WooCommerce
                          </option>
                          <option key={"others"} value={"others"}>
                            Others
                          </option>
                        </Field>
                        <ErrorMessage
                          name="order_type"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="OrderAddProductModal">
                        <FieldArray key={order?.id} name="products">
                          {arrayHelpers => (
                            <Fragment>
                              <div>
                                {values?.products?.map((product, index) => (
                                  <div key={index}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={4}>
                                        <div className="customInput">
                                          <label>
                                            Product Name <span>*</span>
                                          </label>
                                          <Field
                                            component="select"
                                            onChange={e => {
                                              const selectedProductId =
                                                e.target.value;
                                              setFieldValue(
                                                `products[${index}].product_id`,
                                                selectedProductId
                                              );
                                              setSelectedProducts(
                                                prevSelected => {
                                                  prevSelected[index] =
                                                    selectedProductId;
                                                  return [...prevSelected];
                                                }
                                              );
                                            }}
                                            value={
                                              values.products[index]
                                                .product_id || ""
                                            }
                                            name={`products[${index}].product_id`}
                                          >
                                            <option value="">
                                              Select Product
                                            </option>
                                            {Array.isArray(products)
                                              ? products?.map(data => (
                                                  <option
                                                    key={data?.id}
                                                    value={data?.id}
                                                  >
                                                    {data?.product_name}
                                                  </option>
                                                ))
                                              : null}
                                          </Field>
                                          <ErrorMessage
                                            name={`products.${index}.product_id`}
                                            component="div"
                                            className="error"
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <div className="customInput">
                                          <label>
                                            Product Quantity<span>*</span>
                                          </label>
                                          <Field
                                            type="number"
                                            variant="outlined"
                                            name={`products.${index}.product_qty`}
                                            placeholder="Enter Product Quantity"
                                            // defa
                                          />{" "}
                                          <ErrorMessage
                                            name={`products.${index}.product_qty`}
                                            component="div"
                                            className="error"
                                          />
                                          {/* Display error for product_quantity if needed */}
                                        </div>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <div className="customInput">
                                          <label>
                                            Shipping Cost <span>*</span>
                                          </label>
                                          <Field
                                            type="number"
                                            variant="outlined"
                                            name={`products.${index}.shipping_cost`}
                                            placeholder="Shipping Cost"
                                            defa
                                          />
                                          <ErrorMessage
                                            name={`products.${index}.shipping_cost`}
                                            component="div"
                                            className="error"
                                          />
                                        </div>
                                      </Grid>
                                      {selectedProducts[index] &&
                                      products.find(
                                        product =>
                                          product.id == selectedProducts[index]
                                      ) &&
                                      products.find(
                                        product =>
                                          product.id == selectedProducts[index]
                                      ).variations.length > 0 ? (
                                        <Grid item xs={12} sm={3}>
                                          <div className="customInput">
                                            <label>Variant</label>
                                            <Field
                                              component="select"
                                              name={`products[${index}].variant_id`}
                                            >
                                              <option value="">
                                                Select Variant
                                              </option>
                                              {selectedProducts[index] &&
                                                products.find(
                                                  product =>
                                                    product.id ==
                                                    selectedProducts[index]
                                                ) &&
                                                products
                                                  .find(
                                                    product =>
                                                      product.id ==
                                                      selectedProducts[index]
                                                  )
                                                  .variations.map(variant => (
                                                    <option
                                                      key={variant.id}
                                                      value={variant.id}
                                                    >
                                                      {variant.variant}
                                                    </option>
                                                  ))}
                                            </Field>
                                            <ErrorMessage
                                              name={`products[${index}].variant_id`}
                                              component="div"
                                              className="error"
                                            />
                                          </div>
                                        </Grid>
                                      ) : null}

                                      {values?.products.length > 1 ? (
                                        <Grid item xs={12} sm={1}>
                                          <Button
                                            className="DeleteModalButton"
                                            type="button"
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                          >
                                            <i className="flaticon-delete"></i>
                                          </Button>
                                        </Grid>
                                      ) : null}
                                    </Grid>
                                  </div>
                                ))}
                              </div>
                              <div className="HeaderButton">
                                <Button
                                  className="bg"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      product_id: "",
                                      variant_id: "",
                                      product_qty: 1,
                                      shipping_cost: 0,
                                    })
                                  }
                                >
                                  Add Product <i className="flaticon-plus"></i>
                                </Button>
                              </div>
                            </Fragment>
                          )}
                        </FieldArray>
                      </div>
                    </Grid>
                    {order?.order_status === "confirmed" ||
                    order?.order_status === "shipped" ? (
                      <Grid item xs={12} sm={5}>
                        <div className="customInput">
                          <label>Status</label>
                          <Field name="order_status" component="select">
                            <option value="">Select Status</option>

                            <option key={"follow_up"} value={"follow_up"}>
                              Follow Up
                            </option>
                            <option key={"cancelled"} value={"cancelled"}>
                              Cancelled
                            </option>
                            <option key={"pending"} value={"pending"}>
                              Pending
                            </option>
                          </Field>
                        </div>
                      </Grid>
                    ) : null}

                    {imagePermetions && imagePermetions ? (
                      <Grid item xs={12}>
                        <div className="OrderAddProductModal">
                          <label>
                            Order Attached Images (Maximum 5)
                          </label>
                          {/* <input  type="file" style={{ display: "flex"  }} name="image" id="image" /> */}
                          <ProductImage
                            productImage={productGalleryImage}
                            setProductImage={setProductGalleryImage}
                            other_images={
                              order?.order_attach_images
                                ? order.order_attach_images
                                : []
                            }
                            place={
                              "Drag 'n' drop some Product  Image here, or click to select Product  Image"
                            }
                          />
                        </div>
                      </Grid>
                    ) : null}
                  </Grid>
                </div>
                <div className="duelButton">
                  {isLoading ? (
                    <Button type="submit" className="One">
                      {" "}
                      <Spinner /> Updating Order
                    </Button>
                  ) : (
                    <Button type="submit" className="One">
                      {" "}
                      Update Order
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Box>
    </Modal>
  );
};
export default OrderUpdateModal;
