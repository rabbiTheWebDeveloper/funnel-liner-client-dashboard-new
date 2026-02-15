import { Box, Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";

const AddCategory = () => {
    const showToast = useToast()
    const [selectedImage, setSelectedImage] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter();
    const onCategorySubmit = (data) => {
        data.parent_id = "0";
        data.description = "";
        data.status = "1";
        const formData = new FormData();
        formData.append('category_image', selectedImage);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('parent_id', data.parent_id);
        formData.append('status', data.status);

        if (selectedImage?.size > 1024 * 1024) {
            showToast("Image size is too big !", 'error')
            return;
        }
        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/categories", formData, { headers: headers })
            .then(function (response) {
              
                if (response?.data?.success) {
                    showToast(response?.data?.message, "success")
                    router.push("/category-list");
                }
            })
            .catch(function (error) {
                if (error?.response?.status === 422) {
                    showToast("This category already exist !", "error")
                } else if (error?.response?.status === 400) {
                    showToast("Category image required!. ", "error")
                }
                else {
                    showToast("Something went wrong!", "error")
                }

            });

    };


    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);
    return (
        <div className="DashboardTabsItem">

            <h4>Update Category Information</h4>
            <p>Update your Category info</p>

            <div className="DashboardForm">

                {/* Shop Info */}
                <div className="DashboardFormItem">

                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={3}>

                            <div className="left">

                                <h5>Category</h5>
                                <p>This will be displayed on your Category page</p>

                            </div>

                        </Grid>

                        <Grid item xs={12} sm={9}>

                            <div className="CustomeInput">
                                <form onSubmit={handleSubmit(onCategorySubmit)}>

                                    <div className="Item">

                                        <label>Category Name <span>*</span></label>

                                        <TextField id="outlined-basic" label=""
                                            variant="outlined" {...register("name", { required: true })}
                                            placeholder='Category Name' />

                                    </div>

                                    <div className="Item Upload">
                                        <label>Category Image <span>*</span></label>
                                        <p>Image must be a file of type: <span>png, jpg, jpeg</span></p>
                                        <p>Image Size: <span>(Width: 500px, Height: 500px)</span></p>

                                        <input
                                            accept="image/*"
                                            type="file"
                                            id="select-image"
                                            style={{ display: "none" }}
                                            onChange={(e) => setSelectedImage(e.target.files[0])}
                                        />
                                        <label htmlFor="select-image">
                                            <Button variant="contained" color="primary" component="span">
                                                Upload Image
                                            </Button>
                                        </label>
                                        {imageUrl && selectedImage && (
                                            <Box mt={2} textAlign="center">
                                                <h6>Image Preview:</h6>
                                                <img src={imageUrl} alt={selectedImage.name} Height="100px" />
                                            </Box>
                                        )}
                                    </div>

                                    <div className="Item">
                                        <Button type='submit' className='Update'>Add Category</Button>
                                    </div>
                                </form>

                            </div>

                        </Grid>

                    </Grid>

                </div>

            </div>


        </div>
    );
};

export default AddCategory;