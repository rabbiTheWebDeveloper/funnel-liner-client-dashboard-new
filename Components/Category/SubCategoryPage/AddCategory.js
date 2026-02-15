import { Box, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLoading from "../../../hook/useLoading";
import { useToast } from "../../../hook/useToast";
import Spinner from "../../commonSection/Spinner/Spinner";
import style from "./addCategory.module.css";
import axios from "axios";
import { headers } from "../../../pages/api";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const AddCategory = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState("0"); // State for status
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const router = useRouter();
  const onCategorySubmit = async data => {
    try {
      // --- Validate ---
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        showToast("Image size is too big !", "error");
        return;
      }

      // --- Prepare FormData ---
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("status", status);
      if (selectedImage) {
        formData.append("category_image", selectedImage);
      }

      startLoading();

      // --- API Request ---
      const res = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/client/categories`,
        formData,
        { headers }
      );

      // --- Success ---
      if (res.data?.success) {
        showToast(res.data.message, "success");
        // router.push("/category-list");
      }
    } catch (error) {
      const err = error?.response;

      if (err?.status === 422) {
        showToast(err.data?.errors?.category?.[0], "error");
      } else if (err?.status === 400) {
        showToast(err.data?.message, "error");
      } else {
        showToast("Something went wrong!", "error");
      }
    } finally {
      stopLoading();
    }
  };

  const handleStatusChange = event => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
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

                  {/* Status Selector */}
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

                  <div className={style.customInput}>
                    <label>
                      Category Image
                      <span className={style.mustBe}>
                        {" "}
                        [Max size 1 MB, Recommended size (200px*200px)]
                      </span>
                    </label>

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
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className={style.Submit}>
                  {isLoading ? (
                    <>
                      <Button disabled type="submit">
                        <i>
                          <Spinner />
                        </i>
                        Add Category
                      </Button>
                    </>
                  ) : (
                    <Button type="submit">
                      <i className="flaticon-install"> </i>
                      Add Category
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AddCategory;
