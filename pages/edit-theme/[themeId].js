import { Button, Container, Grid } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import EditUpdate from '../../Components/edit-theme/EditUpdate';
import ProductImage from '../../Components/edit-theme/ProductImage';
import Uplode from '../../Components/edit-theme/Uplode';

import { useToast } from '../../hook/useToast';
import { headers, shopId, userId } from '../api';
import { API_ENDPOINTS } from '../../config/ApiEndpoints';

const ThemeIdPage = () => {
    const [update, setUpdate] = useState(false)
    const [reviewImage, setReviewImage] = useState([])
    const [productImage, setProductImage] = useState([])
    const [logoImage, setLogoImage] = useState(null);
    const [favicon, setFaviconIcon] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const showToast = useToast()
    const router = useRouter()
    const { themeId } = router.query
    const token = Cookies.get("token");

    const editForm = (data) => {
        const formData = new FormData();
        if (logoImage) {
            formData.append("request_shop_logo", logoImage);
        }
        if (favicon) {
            formData.append("request_shop_favicon", logoImage);
        }
        if (bannerImage) {
            formData.append("request_banner_image", bannerImage);
        }
        if (reviewImage.length > 0) {
            for (let i = 0; i < reviewImage.length; i++) {
                formData.append('request_reviews[]', reviewImage[i]);
            }
        }
        if (productImage.length > 0) {
            for (let i = 0; i < productImage.length; i++) {
                formData.append('request_product_images[]', productImage[i]);
            }
        }
        if (themeId) {
            formData.append("theme", themeId);
        }
        formData.append("status", "pending");
        formData.append("h_line", data.h_line);
        formData.append("sub_head", data.sub_head);
        formData.append("product_price", data.product_price);
        formData.append("phone_number", data.phone_number);
        formData.append("description", data.description);
        formData.append("video_link", data.video_link);
        formData.append("note", data.note);
        formData.append("features", data.features);
        setIsLoading(true)
        axios.post(API_ENDPOINTS.BASE_URL + "/client/requests", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "shop-id": shopId,
                "id": userId,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                showToast("Page information update success")
                setIsLoading(false)
                setUpdate(true)
            })
            .catch(function (error) {
                setIsLoading(false)
                showToast(error?.response?.data?.msg ? error?.response?.data?.msg : "Something went wrong", "error")
            });


    }


    const [editInfo, setEditInfo] = useState({});

    const handleFetchEditInfo = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.NEXT_PUBLIC_API_URL}/client/requests`,
                headers: headers,
            });
            setEditInfo(data?.data?.data[0]);
        } catch (err) {
          
        }
    };

    useEffect(() => {
        handleFetchEditInfo();
    }, [update]);


    return (

        <>

            <section className='EditTheme'>
            
                {
                    editInfo?.status === 0 ? <EditUpdate></EditUpdate> :

                        <form onSubmit={handleSubmit(editForm)}>

                            <Container maxWidth="sm">

                                <Grid container spacing={3}>

                                    <Grid item xs={12} sm={12} md={12}>
                                        <h3 className='HeaderText'>For any help please call <span>01894844452</span></h3>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Shop Logo <span>*</span> <small> (Image must be a file of type: png, jpg, jpeg)</small> </label>
                                            <input type="file" onChange={(e) => setLogoImage(e.target.files[0])} {...register("logoImage", { required: true })} accept="image/*" />
                                            <p> Image Size: <span>(Width: 100px, Height: 100px)</span></p>
                                            {errors.logoImage && <span style={{ color: 'red' }}>This field is required</span>}
                                        </div>
                                    </Grid>


                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Head Line </label>
                                            <input type="text" {...register("h_line")} placeholder='Head Line' defaultValue={editInfo?.h_line} />
                                         
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Sub Head Line </label>
                                            <input type="text" {...register("sub_head")} placeholder=' Sub Headline' defaultValue={editInfo?.sub_head} />
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Product Price <span>*</span> </label>
                                            <input type="number"  {...register("product_price", { required: true })} placeholder='Product Price' defaultValue={editInfo?.product_price} />
                                            {errors.product_price && <span style={{ color: 'red' }}>This field is required</span>}
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Help Line Number <span>*</span> </label>
                                            <input type="number" {...register("phone_number", { required: true })} placeholder='Help Line Number' defaultValue={editInfo?.phone_number} />
                                            {errors.phone_number && <span style={{ color: 'red' }}>This field is required</span>}
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Banner Image  <small> (Image must be a file of type: png, jpg, jpeg)</small></label>
                                            <input type="file" onChange={(e) => setBannerImage(e.target.files[0])} {...register("bannerImage")} accept="image/*" />
                                            <p> Image Size: <span>(Width: 1920px, Height: 700px)</span></p>
                                    
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Product Quality description </label>
                                            <textarea type="text" rows="5" {...register("description")} placeholder='Product Quality description ' defaultValue={editForm?.description} ></textarea>
                                   
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>

                                        <div className="CustomeInput">
                                            <label> Product benefits or features </label>
                                            <textarea rows="5" type="text" {...register("features")} placeholder='Product benefits or features' defaultValue={editForm?.features} ></textarea>
                                      
                                        </div>

                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Product Image (Minimum 5) </label>
                                            <ProductImage productImage={productImage} setProductImage={setProductImage} editInfo={editInfo} ></ProductImage>
                                            <p>Image must be a file of type: <span>png, jpg, jpeg</span></p>
                                            <p>Image Size: <span>(Width: 500px, Height: 500px)</span></p>
                                        </div>
                                    </Grid>

                                

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">

                                            <label> Customer Review (Minimum 5) </label>
                                            <Uplode reviewImage={reviewImage} setReviewImage={setReviewImage} editInfo={editInfo?.request_reviews} ></Uplode>
                                            <p>Image must be a file of type: <span>png, jpg, jpeg</span></p>
                                            <p>Image Size: <span>(Width: 500px, Height: 500px)</span></p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Youtube Video link </label>
                                            <input type="text" {...register("video_link")} placeholder='Product Description video' defaultValue={editInfo?.video_link} />
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <div className="CustomeInput">
                                            <label> Special Note </label>
                                            <textarea name="" rows="5" {...register("note")} placeholder='Special Note' defaultValue={editInfo?.note}></textarea>
                                         
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12}>
                                        <div className="CustomeInput">
                                            <Button disabled={isLoading} className="theme_edit_submit_btn" type='submit' sx={{ mb: 2 }}>
                                                Submit
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Container>
                        </form>
                }
            </section>

        </>

    )

}

export default ThemeIdPage
