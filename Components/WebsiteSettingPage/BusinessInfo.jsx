import { Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../hook/useToast";
import { headers, shopId } from "../../pages/api";
import axios from "axios";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const BusinessInfo = ({ websiteSettingsData }) => {
  const showToast = useToast();
  const [desc, setDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [favIcon, setFavicon] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async data => {
    try {
      const formData = new FormData();
      formData.append("shop_name", websiteSettingsData?.name);
      formData.append("shop_address", data.shopAddress);
      selectedImage &&
        formData.append(
          "shop_logo",
          selectedImage ? selectedImage : websiteSettingsData?.shop_logo
        );
      favIcon &&
        formData.append(
          "shop_favicon",
          favIcon ? favIcon : websiteSettingsData?.shop_favicon
        );
      formData.append("shop_id", shopId);
      formData.append("shop_meta_title", data.websiteTitle);
      formData.append("shop_meta_description", data.shop_meta_description);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append(
        "default_delivery_location",
        data.default_delivery_location
      );
      const response = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/client/settings/business-info/update`,
        formData,
        { headers }
      );
      showToast(response.data.msg, "success");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong!",
      });
    }
  };
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);
  useEffect(() => {
    if (favIcon) {
      setFaviconPreview(URL.createObjectURL(favIcon));
    }
  }, [favIcon]);
  return (
    <div className="DashboardTabsItem">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="BusinessInfo">
          <div className="BusinessInfoItem">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <h4>Shop Info</h4>
                <p>Update your shop info and other settings</p>
                <div className="customInput">
                  <label>Shop Name</label>
                  <input
                    type="text"
                    {...register("shopName")}
                    value={websiteSettingsData?.name}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                    disabled
                  />
                </div>

                <div className="customInput">
                  <label>Shop Address</label>
                  <input
                    type="text"
                    {...register("shopAddress")}
                    defaultValue={websiteSettingsData?.address}
                  />
                </div>

                <div className="customInput">
                  <label>Business Email</label>
                  <input
                    type="text"
                    {...register("email")}
                    defaultValue={websiteSettingsData?.email}
                  />
                </div>

                <div className="customInput">
                  <label>Phone</label>
                  <input
                    type="number"
                    onWheel={e => e.target.blur()}
                    {...register("phone")}
                    defaultValue={websiteSettingsData?.phone}
                  />
                </div>
                <div className="customInput">
                  <label>Default Delivery location </label>
                  <input
                    name="default_delivery_location"
                    type="text"
                    {...register("default_delivery_location")}
                    defaultValue={
                      websiteSettingsData?.default_delivery_location
                    }
                    placeholder="default delivery location "
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          <div className="BusinessInfoItem SupportTicketItem">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <h4>Company Logo</h4>
                <div className="customInput">
                  <label>
                    (Image format: png, jpg, jpeg),
                    <span>Recommended size (105px*42px)</span>
                  </label>
                  <p></p>
                  <div className="imgUploader">
                    <input
                      accept="image/*"
                      type="file"
                      id="select-image"
                      style={{ display: "none" }}
                      onChange={e => setSelectedImage(e.target.files[0])}
                    />
                    <label htmlFor="select-image">
                      <Button
                        className="SelectImgButton"
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
                          alt={selectedImage?.name}
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
                          src={websiteSettingsData?.shop_logo}
                          alt={""}
                          Height="100px"
                        />
                      </Box>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="BusinessInfoItem SupportTicketItem">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <h4>Favicon </h4>

                <div className="customInput">
                  <div className="imgUploader">
                    <label>
                      Image Size: <span>(Width: 100px, Height: 100px)</span>
                    </label>

                    <input
                      accept="image/*"
                      type="file"
                      id="favicon"
                      style={{ display: "none" }}
                      onChange={e => {
                        setFavicon(e.target.files[0]);
                      }}
                    />

                    <label htmlFor="favicon">
                      <Button
                        className="SelectImgButton"
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Upload Favicon
                      </Button>
                    </label>
                    {faviconPreview && favIcon && (
                      <Box mt={2} textAlign="center">
                        <h6>Image Preview:</h6>
                        <img
                          src={faviconPreview}
                          alt={"favicon"}
                          Height="100px"
                        />
                      </Box>
                    )}

                    {faviconPreview && favIcon ? (
                      ""
                    ) : (
                      <Box mt={2} textAlign="center">
                        <h6>Image Preview:</h6>
                        <img
                          src={websiteSettingsData?.shop_favicon}
                          alt={""}
                          Height="100px"
                        />
                      </Box>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="BusinessInfoItem SupportTicketItem">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <h4>Shop Info</h4>
                <p>This will be displayed on your shop profile</p>
                <div className="customInput">
                  <label>Shop ID</label>
                  <input
                    type="text"
                    InputProps={{ readOnly: true }}
                    {...register("shopID")}
                    defaultValue={shopId}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="BusinessInfoItem SupportTicketItem">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <h4>Meta Description</h4>
                <p>This will be displayed on your shop profile</p>
                <div className="customInput">
                  <label>Website Title</label>
                  <input
                    type="text"
                    {...register("websiteTitle")}
                    defaultValue={websiteSettingsData?.shop_meta_title}
                  />
                </div>
                <div className="customInput">
                  <label>Description</label>
                  <input
                    type="text"
                    {...register("shop_meta_description")}
                    onChange={newValue => setDesc(newValue.target.value)}
                    defaultValue={websiteSettingsData?.shop_meta_description}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="duelButton">
            <Button type="submit">Update</Button>
            <Button className="red">Reset</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default BusinessInfo;
