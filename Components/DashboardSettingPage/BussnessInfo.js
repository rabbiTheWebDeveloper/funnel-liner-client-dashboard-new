import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";
import useLoading from "../../hook/useLoading";

const BussnessInfo = ({ redirectFrom, response }) => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const router = useRouter();
  const showToast = useToast();
  const [busInfo, setBusInfo] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [tfValue, setTFValue] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shopId, setShopId] = useState("");
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  //social links
  const [fbLink, setFbLink] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const businessSubmit = data => {
    startLoading();
    const formData = new FormData();
    if (selectedImage !== null) {
      formData.append("shop_logo", selectedImage);
    }
    formData.append("shop_name", tfValue);
    formData.append("shop_address", address);
    formData.append("shop_id", shopId);
    formData.append("shop_meta_title", data.shop_meta_title);
    formData.append("shop_meta_description", data.shop_meta_description);
    formData.append("email", email);
    formData.append("phone", phone);

    formData.append("fb", fbLink);
    formData.append("instagram", instagram);
    formData.append("linkedin", linkedin);
    formData.append("twitter", twitter);
    formData.append("youtube", youtube);

    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL +
          "/client/settings/business-info/update",
        formData,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        stopLoading();
        showToast("The business information has been successfully updated");
        if (redirectFrom === "panel1") {
          router.push("/?current_steap=panel2");
        }
      })
      .catch(function (error) {
        stopLoading();
        showToast(error?.response?.data?.msg, "error");
      });
    reset();
  };

  useEffect(() => {
    setBusInfo(response?.data?.data);
    setPhone(response?.data?.data.phone);
    setEmail(response?.data?.data.email);
    setTFValue(response?.data?.data?.name);
    setShopId(response?.data?.data?.shop_id);
    setAddress(response?.data?.data?.address);
    setWebsiteTitle(response?.data?.data?.shop_meta_title);
    setDesc(response?.data?.data?.shop_meta_description);
    setFbLink(
      response?.data?.data?.fb != "null" ? response?.data?.data?.fb : "https://"
    );
    setLinkedin(
      response?.data?.data?.linkedin != "null"
        ? response?.data?.data?.linkedin
        : "https://"
    );
    setInstagram(
      response?.data?.data?.instagram != "null"
        ? response?.data?.data?.instagram
        : "https://"
    );
    setTwitter(
      response?.data?.data?.twitter != "null"
        ? response?.data?.data?.twitter
        : "018xxxxxxxx"
    );
    setYoutube(
      response?.data?.data?.youtube != "null"
        ? response?.data?.data?.youtube
        : "https://"
    );
  }, [response]);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <>
      <form onSubmit={handleSubmit(businessSubmit)}>
        <div className="DashboardForm">
          {/* Shop Info */}
          <div className="DashboardSettingItem">
            <Grid container spacing={3}>
              <Grid item md={12}>
                <div className="left">
                  <h4>Shop Info</h4>
                  <p>This will be displayed on your shop profile</p>
                </div>
              </Grid>

              <Grid item md={12}>
                <div className="customInput">
                  <label>
                    Shop Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("shop_name")}
                    // onChange={newValue => setTFValue(newValue.target.value)}
                    value={tfValue}
                    required
                    InputProps={{ readOnly: true, disableUnderline: true }}
                    disabled
                  />
                </div>
                <div className="customInput">
                  <label>
                    Phone Number <span>*</span>
                  </label>
                  <input
                    type="number"
                    onWheel={e => e.target.blur()}
                    {...register("phone")}
                    value={phone}
                    onChange={newValue => setPhone(newValue.target.value)}
                    required
                  />

                  {errors.phone && (
                    <p className="error">This field is required</p>
                  )}
                </div>
                <div className="customInput">
                  <label>
                    Email Address <span>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("email")}
                    onChange={newValue => setEmail(newValue.target.value)}
                    value={email}
                    required
                    InputProps={{ readOnly: true }}
                  />
                  {errors.email && (
                    <p className="error">This field is required</p>
                  )}
                </div>

                <div className="customInput">
                  <label>
                    Shop Address <span>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("shop_address")}
                    onChange={newValue => setAddress(newValue.target.value)}
                    value={address}
                    required
                  />
                  {errors.shop_address && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Company Logo */}
          <div className="DashboardSettingItem">
            <Grid container spacing={3}>
              <Grid item md={12}>
                <div className="left">
                  <h4>
                    Company Logo <span>*</span>
                  </h4>
                </div>
              </Grid>

              <Grid item md={12}>
                <div className="customInput">
                  <label>
                    <span>Image</span> (png, jpg, jpeg)<span> Recommended size :</span>
                    (105px*42px)
                  </label>

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
                        <img src={busInfo?.shop_logo} alt={""} Height="100px" />
                      </Box>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Shop Info */}
          <div className="DashboardSettingItem">
            <Grid container spacing={3}>
              <Grid item md={12}>
                <div className="left">
                  <h4>Shop Info</h4>
                  <p>This will be displayed on your shop profile</p>
                </div>
              </Grid>

              <Grid item md={12}>
                <div className="customInput">
                  <label>Shop ID</label>
                  <input
                    type="text"
                    InputProps={{ readOnly: true }}
                    onChange={newValue => setShopId(newValue.target.value)}
                    value={shopId}
                    {...register("shop_id")}
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Social link */}
          <div className="DashboardSettingItem">
            <Grid container spacing={3}>
              <Grid item md={12}>
                <div className="left">
                  <h4>Social Link</h4>
                  <p>This Links will be add your footer section </p>
                </div>
              </Grid>

              <Grid item md={12}>
                <div className="customInput">
                  <label>
                    {" "}
                    <i className="flaticon-facebook"></i> Facebook business page
                    link
                  </label>
                  <input
                    type="text"
                    onChange={newValue => setFbLink(newValue.target.value)}
                    value={fbLink}
                  />
                </div>
                <div className="customInput">
                  <label>
                    {" "}
                    <i className="flaticon-linkedin"></i> Linkedin
                  </label>
                  <input
                    type="text"
                    onChange={newValue => setLinkedin(newValue.target.value)}
                    value={linkedin}
                  />
                </div>
                <div className="customInput">
                  <label>
                    <i className="flaticon-instagram"></i> Instagram
                  </label>
                  <input
                    type="text"
                    onChange={newValue => setInstagram(newValue.target.value)}
                    value={instagram}
                  />
                </div>
                <div className="customInput">
                  <label>
                    <i className="flaticon-whatsapp"></i> Whatsapp
                  </label>
                  <input
                    type="text"
                    onChange={newValue => setTwitter(newValue.target.value)}
                    value={twitter}
                  />
                </div>
                <div className="customInput">
                  <label>
                    {" "}
                    <i className="flaticon-youtube"></i> YouTube
                  </label>
                  <input
                    type="text"
                    onChange={newValue => setYoutube(newValue.target.value)}
                    value={youtube}
                  />
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Meta Description */}
          <div className="DashboardSettingItem">
            <Grid container spacing={3}>
              <Grid item md={12}>
                <div className="left">
                  <h4>Meta Description</h4>
                  <p>This will be displayed on your shop profile</p>
                </div>
              </Grid>

              <Grid item md={12}>
                <div className="customInput">
                  <label>Website Title</label>
                  <input
                    type="text"
                    {...register("shop_meta_title")}
                    onChange={newValue =>
                      setWebsiteTitle(newValue.target.value)
                    }
                    value={websiteTitle}
                  />
                </div>

                <div className="customInput">
                  <label>Description</label>
                  <input
                    type="text"
                    {...register("shop_meta_description")}
                    onChange={newValue => setDesc(newValue.target.value)}
                    value={desc}
                  />
                </div>

                <div className="duelButton">
                  <Button disabled={isLoading} type="submit">
                    Update
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </form>
    </>
  );
};

export default BussnessInfo;
