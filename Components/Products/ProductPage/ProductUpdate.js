import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import style from "./style.module.css";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import ProductImage from "../../edit-theme/ProductImage";
import dynamic from "next/dynamic";
import QuillEditor from "../Description/Description";

const ProductUpdate = ({
  id,
  product,
  category,
  modalOpen,
  handleCloseModal,
  fetchProduct,
  busInfo,
}) => {
  const showToast = useToast();
  const [delivery, setDelivery] = useState("Free Delivery Charge");
  const [insideDhaka, setInsideDhaka] = useState(0);
  const [outDhaka, setOutDhaka] = useState(0);
  const [subArea, setSubArea] = useState(0);
  const { main_image } = product;
  const [selectedImage, setSelectedImage] = useState(null);
  const [productImage, setProductImage] = useState([]);
  const [productDescription, setProductDescription] = useState("");
  const [productSummary, setProductSummary] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setDelivery(product?.delivery_charge);
    setInsideDhaka(product?.inside_dhaka);
    setOutDhaka(product?.outside_dhaka);
  }, [id]);

  const onSubmit = data => {
    data._method = "patch";
    const formData = new FormData();
    if (selectedImage) {
      formData.append("main_image", selectedImage);
    }
    if (productImage.length) {
      for (let i = 0; i < productImage.length; i++) {
        formData.append("gallery_image[]", productImage[i]);
      }
    }
    formData.append("category_id", data.category_id);
    formData.append("product_name", data.product_name);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("product_code", data.product_code);
    formData.append("product_qty", data.product_qty);
    formData.append(
      "short_description",
      productSummary.length > 0 ? productSummary : product.short_description
    );
    formData.append(
      "long_description",
      productDescription.length > 0
        ? productDescription
        : product.long_description
    );

    formData.append("_method", data._method);
    if (delivery === "free") {
      formData.append("delivery_charge", "free");
    }
    if (delivery === "paid") {
      formData.append("delivery_charge", "paid");
      formData.append("inside_dhaka", insideDhaka);
      formData.append("outside_dhaka", outDhaka);
      formData.append("sub_area_charge", subArea);
    }
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + "/client/products/" + id,
        formData,
        { headers: headers }
      )
      .then(function (response) {
        if (response?.data?.success) {
          showToast("Product update successfully!", "success");
          handleCloseModal();
          fetchProduct();
        }
      })
      .catch(function (error) {
        if (error?.response?.status === 400) {
          showToast(error?.response?.data.error, "error");
        } else {
          showToast("Something went wrong!", "error");
        }
      });
  };

  const [imageUrl, setImageUrl] = useState(main_image);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleChangeProductDescription = editor => {
    setProductDescription(editor);
  };

  const handleChangeProductSummary = editor => {
    setProductSummary(editor);
  };
  console.log(product);
  return (
    <div>
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="updateModal"
      >
        <Box className="modalBox">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modalContent">
              <div className="header">
                <div className="left">
                  <i className="flaticon-edit"></i>
                  <h4>Products Update</h4>
                </div>

                <div className="right" onClick={handleCloseModal}>
                  <i className="flaticon-close-1"></i>
                </div>
              </div>

              <div className="updateModalForm">
                <div className="customInput">
                  <label>
                    Product Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={product?.product_name}
                    {...register("product_name", { required: true })}
                  />
                  {errors.product_name && (
                    <p className="error">This Product Name required</p>
                  )}
                </div>
                <div className="customInput">
                  <label>
                    Product Code <span>*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={product?.product_code}
                    {...register("product_code")}
                  />
                  {errors.product_code && (
                    <p className="error">This Product Name required</p>
                  )}
                </div>

                <div className="customInput">
                  <label>
                    Selling Price <span>*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={product?.price}
                    {...register("price")}
                  />
                  {errors.product && (
                    <p className="error">This Product Name required</p>
                  )}
                </div>
                <div className="customInput">
                <label>
                Discount Price
                </label>
                <input
                            name="discount"
                            type="text"
                            defaultValue={product?.discount}
                            placeholder="Example: 599"
                            {...register("discount", {

                              // pattern: /^(?!0)[1-9][0-9]*$/,
                            })}
                          />
               {errors?.discount ? (
                            <p className="error">Invalid discount Price</p>
                          ) : null}
                </div>

             

                <div className="customInput">
                  <label>
                    Available Quantity <span>*</span>{" "}
                  </label>
                  <input
                    type="text"
                    InputProps={{ readOnly: true, disableUnderline: true }}
                    {...register("product_qty", { required: true })}
                    defaultValue={product?.product_qty}
                  />
                  {errors.product_qty && (
                    <p className="error">This Product Name required</p>
                  )}
                </div>

                <div className="customInput">
                  <label>
                    Category Name <span>*</span>{" "}
                  </label>

                  <select
                    {...register("category_id")}
                    defaultValue={product?.category_id}
                  >
                    {Array.isArray(category)
                      ? category.map(data => {
                          return (
                            <option key={data?.id} value={data?.id}>
                              {data?.name}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </div>

                <div className="customInput">
                  <label>
                    Delivery Charge <span>*</span>{" "}
                  </label>

                  <select
                    name=""
                    defaultValue={product?.delivery_charge}
                    onChange={e => {
                      setDelivery(e.target.value);
                    }}
                  >
                    <option value="free">Free Delivery Charge</option>
                    <option value="paid">Paid Delivery Charge</option>
                  </select>

                  {delivery === "paid" && (
                    <div>
                      <div className={style.DuelInput}>
                        <div className="customInput">
                          <label>
                            {" "}
                            Delivery charge in{" "}
                            {busInfo?.default_delivery_location
                              ? busInfo?.default_delivery_location
                              : "Dhaka"}{" "}
                          </label>
                          <input
                            type="text"
                            onChange={e => setInsideDhaka(e.target.value)}
                            defaultValue={product?.inside_dhaka}
                          />
                        </div>

                        <div className="customInput">
                          <label>
                            {" "}
                            Delivery charge in{" "}
                            {busInfo?.default_delivery_location
                              ? busInfo?.default_delivery_location
                              : "Dhaka"}{" "}
                          </label>
                          <input
                            type="text"
                            onChange={e => setOutDhaka(e.target.value)}
                            defaultValue={product?.outside_dhaka}
                          />
                        </div>
                      </div>

                      <div className={"customInput"}>
                        <label>{" "} Sub Area Charge (Optional) {" "}</label>
                        <input
                          type="text"
                          onChange={e => setSubArea(e.target.value)}
                          placeholder="Sub area (Optional)"
                          defaultValue={product?.sub_area_charge}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="customInput">
                  <label>
                    Product Image <span>*</span>
                  </label>
                  <p className={style.ImageUploadSize}>
                    <span>Image Type:</span> png, jpg, jpeg{" "}
                    <span>Image Size:</span>Width: 500px, Height: 500px
                  </p>

                  <div className={style.imgUploader}>
                    <input
                      accept="image/*"
                      type="file"
                      id="select-image"
                      style={{ display: "none" }}
                      onChange={e => setSelectedImage(e.target.files[0])}
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
                    {imageUrl && selectedImage && (
                      <Box mt={2} textAlign="center">
                        <h6>Image Preview:</h6>
                        <img
                          src={imageUrl}
                          alt={selectedImage.name}
                          Height="100px"
                        />
                      </Box>
                    )}
                    {imageUrl && selectedImage ? (
                      ""
                    ) : (
                      <Box mt={2} textAlign="center">
                        <h6>Image Preview:</h6>
                        <img
                          src={product?.main_image}
                          alt={product?.main_image}
                          Height="100px"
                        />
                      </Box>
                    )}
                  </div>
                </div>

                <div className={"customInput"}>
                  <div className=" EditTheme  CustomeInput">
                    <label> Product Gallery Image (Maximum 5) </label>
                    <ProductImage
                      productImage={productImage}
                      setProductImage={setProductImage}
                      other_images={product?.other_images}
                    />
                  </div>
                </div>

                <div className={"product_sort_description"}>
                  <label>Product Short Description</label>
                  <div>
                    <QuillEditor
                      value={productSummary}
                      data={product?.short_description}
                      onChange={handleChangeProductSummary}
                      placeholder="Please Describe  Your Product Short Description "
                    />
                  </div>
                </div>
                <div className={"product_long_description"}>
                  <label>Product Description</label>
                  <div>
                    <QuillEditor
                      value={productDescription}
                      data={product?.long_description}
                      onChange={handleChangeProductDescription}
                      placeholder="Please Describe  Your Product  Description "
                    />
                  </div>
                </div>
              </div>

              <div className="duelButton">
                <Button type="submit">Update</Button>
                <Button type="reset" className="red">
                  Reset
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductUpdate;
