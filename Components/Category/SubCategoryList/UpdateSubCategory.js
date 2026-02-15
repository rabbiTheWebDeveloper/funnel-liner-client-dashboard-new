import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { headers } from "../../../pages/api";

import style from "../SubProductPage/style.module.css";
import { useToast } from "../../../hook/useToast";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const UpdateSubCategory = ({
  id,
  isOpen,
  closePopup,
  handleFetchSubCategories,
  categories,
}) => {
  const showToast = useToast();
  const [subCategory, setSubCategory] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState("0");
  const [parentId, setParentId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      parent_id: "",
    },
  });

  const onSubCategorySubmit = (data) => {
    const formData = new FormData();
    if (selectedImage?.size > 5 * 1024 * 1024) {
      showToast("Image size is too big! Maximum 5MB allowed.", "error");
      return;
    }
    if (selectedImage) {
      formData.append("category_image", selectedImage);
    }
    formData.append("name", data.name);
    formData.append("status", status);
    formData.append("parent_id", parentId);
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
        showToast("Sub Category Updated Successfully");
        handleFetchSubCategories();
        closePopup();
      })
      .catch(function (error) {
        showToast("Something went wrong!", "error");
        closePopup();
      });

    reset();
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleParentIdChange = (event) => {
    setParentId(event.target.value);
  };

  const fetchSingleSubCategory = useCallback(async () => {
    await axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORY}/` + id,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        let data = response.data.data;
        setValue("name", data?.name);
        setValue("parent_id", data?.parent_id);
        setStatus(data?.status || "0");
        setParentId(data?.parent_id || "");
        setSubCategory(data);
      });
  }, [id, setValue]);

  useEffect(() => {
    if (isOpen) {
      fetchSingleSubCategory();
    }
  }, [isOpen, fetchSingleSubCategory]);

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
      setParentId("");
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
                <h4>Update Your Sub Category</h4>
              </div>

              <div className="right" onClick={closePopup}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubCategorySubmit)}>
              <div className="updateModalForm">
                <div className="customInput">
                  <label>
                    Sub Category Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Sub Category Name"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="customInput">
                  <label>
                    Category <span>*</span>
                  </label>
                  <select
                    value={parentId}
                    onChange={handleParentIdChange}
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400",
                      color: "#333",
                      backgroundColor: "#fff",
                      outline: "none",
                      marginTop: "8px",
                      appearance: "auto",
                    }}
                  >
                    <option value="">Select Category</option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  {!parentId && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      Category is required
                    </span>
                  )}
                </div>

                <div className="customInput">
                  <label>Sub Category Image (Max size 1 MB)</label>
                  <div className={style.imgUploader}>
                    <input
                      accept="image/*"
                      type="file"
                      id="select-image-sub"
                      style={{ display: "none" }}
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <label htmlFor="select-image-sub">
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
                          src={subCategory?.category_image}
                          alt={subCategory?.category_image}
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
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateSubCategory;
