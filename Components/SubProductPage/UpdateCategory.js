import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { headers } from "../../pages/api";

import style from './style.module.css';



const UpdateCategory = ({ id }) => {
    const [products, setProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [mainImg, setMainImg] = useState();
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [previewMainImg, setPreviewMainImg] = useState({ file: null });

    const handleMainImage = (e) => {
        setMainImg(e.target.files[0]);
        const file = e.target.files[0];
        setPreviewMainImg({ file: URL.createObjectURL(file) });
    };


    const onCategorySubmit = (data) => {
        const formData = new FormData();
        if (selectedImage) {
            formData.append('category_image', selectedImage);
        }
        formData.append('name', data.name);

        formData.append('_method', 'patch');


        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/categories/" + id, formData, { headers: headers }
        )

            .then(function (response) {
                Swal.fire(
                    'Category Update Successfully!',
                    response?.data?.msg,
                    'success'
                )
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',

                    footer: '<a href="">Why do I have this issue?</a>'
                })
            });

        reset();
        setOpenSales(false);
    };


    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + "/client/categories/" + id, { headers: headers })
            .then(function (response) {
                let allProduct = response.data.data;
                setProducts(allProduct);


            });
    }, []);


    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);



    return (
        <div>
            <div onClick={handleOpenSales}> <i class="flaticon-edit"></i> </div>

            <Modal
                open={openSales}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='updateModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>

                            <div className='left'>
                                <i class="flaticon-edit"></i>
                                <h4>Update Your Category</h4>
                            </div>

                            <div className='right' onClick={handleCloseSales}>
                                <i class="flaticon-close-1"></i>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit(onCategorySubmit)}>

                            <div className='updateModalForm'>

                                <div className='customInput'>
                                    <label>Category Name <span>*</span></label>
                                    <input type="text" defaultValue={products?.name}  {...register("name", { required: true })}
                                        placeholder='Category Name'
                                    />
                                </div>

                                <div className='customInput'>

                                    <label>Category Image <span>*</span></label>
                                    {/* <p className={style.ImageUploadSize}><span>Image Type:</span> png, jpg, jpeg <span>Image Size:</span>Width: 500px, Height: 500px</p> */}

                                    <div className={style.imgUploader}>

                                        <input
                                            accept="image/*"
                                            type="file"
                                            id="select-image"
                                            style={{ display: "none" }}
                                            onChange={(e) => setSelectedImage(e.target.files[0])}
                                        />
                                        <label htmlFor="select-image">
                                            <Button className={style.SelectImgButton} variant="contained" color="primary" component="span">
                                                Upload Image
                                            </Button>
                                        </label>

                                        {imageUrl && selectedImage && (
                                            <Box mt={2} textAlign="center">
                                                <h6>Image Preview:</h6>
                                                <img src={imageUrl} alt={selectedImage.name} height="100px" />
                                            </Box>
                                        )}

                                        {
                                            imageUrl && selectedImage ? "" : <Box mt={2} textAlign="center">
                                                <h6>Image Preview:</h6>
                                                <img src={products?.category_image} alt={products?.main_image?.type} height="100px" />
                                            </Box>
                                        }

                                    </div>

                                </div>

                            </div>

                            <div className="duelButton">
                                <Button type="submit">Update</Button>
                                <Button type="reset" className="red">Reset</Button>
                            </div>

                        </form>

                    </div>

                </Box>

            </Modal>
        </div>
    );
};

export default UpdateCategory;
