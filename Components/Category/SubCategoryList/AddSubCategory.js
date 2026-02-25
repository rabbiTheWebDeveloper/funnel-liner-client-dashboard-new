import { Box, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useLoading from "../../../hook/useLoading";
import { useToast } from "../../../hook/useToast";
import Spinner from "../../commonSection/Spinner/Spinner";
import style from "../SubCategoryPage/addCategory.module.css";
import axios from "axios";
import { headers } from "../../../pages/api";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import Select from "react-select";

const AddSubCategory = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parent_id: "",
    },
  });
  const [status, setStatus] = useState("0");
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const router = useRouter();

  // Fetch categories for dropdown
  const fetchCategories = useCallback(() => {
    axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}`,
        { headers: headers }
      )
      .then(function (response) {
        setCategories(response.data.data || []);
      })
      .catch(function (error) {});
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onSubCategorySubmit = async data => {
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
      formData.append("parent_id", data.parent_id);
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
        showToast(res.data.message, "Category added successfully!");
        router.push("/sub-category-list");
      }
    } catch (error) {
      const err = error?.response;

      if (err?.data?.errors) {
        Object.keys(err.data.errors).forEach(key => {
          const errorMessage =
            err.data.errors[key]?.[0] || err.data.errors[key];
          showToast(errorMessage, "error");
        });
      } else if (err?.data?.message) {
        showToast(err.data.message, "error");
      } else {
        showToast("Something went wrong! Please try again.", "error");
      }
    } finally {
      stopLoading();
    }
  };

  const handleStatusChange = event => {
    setStatus(event.target.value);
  };

  const categoryOptions = Array.isArray(categories)
    ? categories.map(cat => ({
        value: cat.id,
        label: cat.name,
      }))
    : [];

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
            <form onSubmit={handleSubmit(onSubCategorySubmit)}>
              <div className={style.AddProduct}>
                <div className={style.header}>
                  <h4>Sub Category</h4>
                  <p>This will be displayed on your Sub Category page</p>
                </div>

                <div className={style.FormValidation}>
                  <div className={style.customInput}>
                    <label>
                      Sub Category Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      placeholder="Sub Category Name"
                    />
                    {errors?.name && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        Sub Category Name is required
                      </span>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className={style.customInput}>
                    <label>
                      Category <span>*</span>
                    </label>
                    <Controller
                      name="parent_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          options={categoryOptions}
                          value={
                            categoryOptions.find(
                              option =>
                                String(option.value) === String(field.value)
                            ) || null
                          }
                          onChange={selectedOption =>
                            field.onChange(selectedOption?.value || "")
                          }
                          isSearchable
                          placeholder="Select Category"
                          menuPosition="fixed"
                          styles={{
                            control: base => ({
                              ...base,
                              minHeight: "46px",
                              borderRadius: "10px",
                              marginTop: "8px",
                            }),
                            valueContainer: base => ({
                              ...base,
                              padding: "2px 12px",
                            }),
                          }}
                        />
                      )}
                    />
                    {errors?.parent_id && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        Category is required
                      </span>
                    )}
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
                      Sub Category Image
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
                        Add Sub Category
                      </Button>
                    </>
                  ) : (
                    <Button type="submit">
                      <i className="flaticon-install"> </i>
                      Add Sub Category
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

export default AddSubCategory;
