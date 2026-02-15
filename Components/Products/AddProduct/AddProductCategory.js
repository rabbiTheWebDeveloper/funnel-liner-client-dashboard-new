import { Box, Button, Grid, Modal } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import style from "./addCategory.module.css";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const AddProductCategory = ({
  handleCloseSuggestNote,
  openModal,
  HandelFetchCategory,
  setSelectedCategory,
  fetchCategoriesData,
  closeModal
}) => {
  const showToast = useToast();
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null);
  const [seletectCategoryImgURL, setSelectCategoryImgURL] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onCategorySubmit = (data) => {
    setSelectedCategory({ value: data.name, label: data.name });
    data.parent_id = "0";
    data.description = "";
    data.status = "1";
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("parent_id", data.parent_id);
    formData.append("status", data.status);
    if (selectedCategoryImage?.size > 1024 * 1024) {
      showToast("Image size is too big !", "error");
      return;
    }
    if (selectedCategoryImage) {
      formData.append("category_image", selectedCategoryImage);
    }
    axios
      .post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.CREATE_CATEGORY}`, formData, {
        headers: headers,
      })
      .then(function (response) {
        closeModal()
        if (response?.data?.success) {
          fetchCategoriesData();
          showToast(response?.data?.message, "success");
          handleCloseSuggestNote();
          HandelFetchCategory();
          setValue("name", "");
          closeModal()
        }
      })
      .catch(function (error) {
        if (error?.response?.status === 422) {
          showToast("This category already exists!", "error");
        } else if (error?.response?.status === 400) {
          showToast("Category image is required!", "error");
        } else {
          // showToast("Something went wrong!", "error");
        }
      });
  };

  useEffect(() => {
    if (selectedCategoryImage) {
      setSelectCategoryImgURL(URL.createObjectURL(selectedCategoryImage));
    }
  }, [selectedCategoryImage]);

  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="updateModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="">
            {/* Shop Info */}
            <div className="DashboardFormItem">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <form onSubmit={handleSubmit(onCategorySubmit)}>
                    <div className={style.AddProduct}>
                      <div className={style.header}>
                        <h4>Category</h4>
                        <p>This will be displayed on your Category page</p>
                      </div>
                      <div className={style.FormValidation}>
                        <div className={style.customInput}>
                          <label>
                            Category Name <span>*</span>
                          </label>
                          <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Category Name"
                          />
                        </div>
                        <div className={style.customInput}>
                          <label>
                            Image <span className={style.mustBe}>Must be:</span> (png,
                            jpg) ; <span className={style.mustBe}>Image Size: </span>{" "}
                            (W:500px, h: 500px)
                          </label>

                          <div className={style.imgUploader}>
                            <input
                              accept="image/*"
                              type="file"
                              id="select-category-image"
                              style={{ display: "none" }}
                              onChange={e => setSelectedCategoryImage(e.target.files[0])}
                            />
                            <label htmlFor="select-category-image">
                              <Button
                                className={style.SelectImgButton}
                                variant="contained"
                                color="primary"
                                component="span"
                              >
                                Upload Image
                              </Button>
                            </label>
                            {seletectCategoryImgURL && selectedCategoryImage ? (
                              <Box mt={2} textAlign="center">
                                <h6>Image Preview:</h6>
                                <img
                                  src={seletectCategoryImgURL}
                                  alt={selectedCategoryImage.name}
                                  Height="100px"
                                />
                              </Box>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className={style.Submit}>
                        <Button type="submit">
                          <i className="flaticon-install"></i> Add Category
                        </Button>
                      </div>
                    </div>
                  </form>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddProductCategory;
