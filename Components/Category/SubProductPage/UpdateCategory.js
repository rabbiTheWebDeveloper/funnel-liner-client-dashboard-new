import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { headers } from "../../../pages/api";

import style from "./style.module.css";
import { useToast } from "../../../hook/useToast";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const UpdateCategory = ({ id, isOpen, closePopup, hanldeFetchCategories }) => {
  const showToast = useToast();
  const [products, setProducts] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState("0"); // Add status state

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onCategorySubmit = data => {
    const formData = new FormData();
    if (selectedImage?.size > 5 * 1024 * 1024) {
      showToast("Image size is too big! Maximum 5MB allowed.", "error");
      return;
    }
    if (selectedImage) {
      formData.append("category_image", selectedImage);
    }
    formData.append("name", data.name);
    formData.append("status", status); // Add status to form data
    formData.append("_method", "patch");

    axios
      .post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.UPDATE_CATEGORY}/` +
          id,
        formData,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast("Category Update Successfully");
        hanldeFetchCategories();
        closePopup();
      })
      .catch(function (error) {
        showToast("Something went wrong!", "error");
        closePopup();
      });

    reset();
  };

  // Add status change handler
  const handleStatusChange = event => {
    setStatus(event.target.value);
  };

  const fetchSingleCategory = useCallback(async () => {
    await axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORY}/` + id,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        let allProduct = response.data.data;
        setValue("name", response?.data?.data?.name);
        setValue("status", response?.data?.data?.status);
        setStatus(response?.data?.data?.status || "0"); // Set initial status from API
        setProducts(allProduct);
      });
  }, [id, setValue]);

  useEffect(() => {
    if (isOpen) {
      fetchSingleCategory();
    }
  }, [isOpen, fetchSingleCategory]);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedImage(null);
      setImageUrl(null);
      setStatus("0");
    }
  }, [isOpen, reset]);

  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="updateModal"
      >
        <Box className="modalBox">
          <div className="modalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-edit"></i>
                <h4>Update Your Category</h4>
              </div>

              <div className="right" onClick={closePopup}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>
            <form onSubmit={handleSubmit(onCategorySubmit)}>
              <div className="updateModalForm">
                <div className="customInput">
                  <label>
                    Category Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Category Name"
                  />
                </div>
                <div className="customInput">
                  <label>Category Image (Max size 1 MB)</label>
                  {/* <p className={style.ImageUploadSize}><span>Image Type:</span> png, jpg, jpeg <span>Image Size:</span>Width: 500px, Height: 500px</p> */}
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
                          height="100px"
                        />
                      </Box>
                    )}

                    {imageUrl && selectedImage ? (
                      ""
                    ) : (
                      <Box mt={2} textAlign="center">
                        <h6>Image Preview:</h6>
                        <img
                          src={products?.category_image}
                          alt={products?.category_image}
                          height="100px"
                        />
                      </Box>
                    )}
                  </div>
                </div>

                <div className={style.customInput}>
                  <label>
                    Status <span>*</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border:
                          status === "1"
                            ? "2px solid #1976d2"
                            : "1px solid #ddd",
                        backgroundColor: status === "1" ? "#e3f2fd" : "#fff",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <input
                        type="radio"
                        value="1"
                        checked={status === "1"}
                        onChange={handleStatusChange}
                        style={{ marginRight: "8px" }}
                      />
                      Active
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border:
                          status === "0"
                            ? "2px solid #d32f2f"
                            : "1px solid #ddd",
                        backgroundColor: status === "0" ? "#ffebee" : "#fff",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <input
                        type="radio"
                        value="0"
                        checked={status === "0"}
                        onChange={handleStatusChange}
                        style={{ marginRight: "8px" }}
                      />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>

              <div className="duelButton">
                <Button type="submit">Update</Button>
                {/* <Button type="reset" className="red">Reset</Button> */}
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateCategory;
