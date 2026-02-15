import { Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import style from './editUploader.module.css';

const UploderNew = ({ imageData, setImageData, setLinks, links , bannerList }) => {
    function handleImageUpload(event, index) {
        const file = event.target.files[0];
        const reader = new FileReader();
        const uniqueId = Date.now(); // Generate a unique identifier

        reader.onload = function (e) {
            const imageDataCopy = [...imageData];
            imageDataCopy[index] = { file, previewURL: e.target.result, id: uniqueId };
            setImageData(imageDataCopy);
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            // Reset image data for the specified index
            const imageDataCopy = [...imageData];
            imageDataCopy[index] = { file: null, previewURL: null, id: uniqueId };
            setImageData(imageDataCopy);
        }
    }

    function removeField(index) {
        setImageData(prevImageData => {
            const imageDataCopy = [...prevImageData];
            imageDataCopy.splice(index, 1);
            return imageDataCopy;
        });

        setLinks(prevLinks => {
            const linksCopy = [...prevLinks];
            linksCopy.splice(index, 1);
            return linksCopy;
        });
    }

    useEffect(() => {
        imageData.forEach((image, index) => {
            if (image.file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setImageData(prevImageData => {
                        const imageDataCopy = [...prevImageData];
                        imageDataCopy[index] = { file: image.file, previewURL: reader.result, id: image.id };
                        return imageDataCopy;
                    });
                };
                reader.readAsDataURL(image.file);
            }
        });
    }, []);

    const handleLinkChange = (index, value) => {
        setLinks(prevLinks => {
            const linksCopy = [...prevLinks];
            linksCopy[index] = value;
            return linksCopy;
        });
    };

    const clearImage = index => {
        const imageDataCopy = [...imageData];
        imageDataCopy[index] = { file: null, previewURL: null, id: imageData[index].id };
        setImageData(imageDataCopy);
    };

    return (

        <> 

            {imageData.map((image, index) => (
                <div className={style.SliderUploaderContent} key={index}>
                    <div className={style.imgUploader}>
                        {/* <div> */}
                            <input
                                accept="image/*"
                                type="file"
                                id={`select-image-${image.id}`}
                                style={{ display: 'none' }}
                                onChange={event => handleImageUpload(event, index)}
                            />

                            <label htmlFor={`select-image-${image.id}`}>
                                <Button className={style.SelectImgButton} variant="contained" color="primary" component="span">
                                    Upload Image
                                </Button>
                            </label>
                        {/* </div> */}
                        {image.previewURL && (
                            <Box mt={2} textAlign="center">
                                <h6>Image Preview:</h6>
                                <img src={image.previewURL} alt="Preview" style={{ width: '100px', height: 'auto' }} />
                                <div className={style.close} onClick={() => clearImage(index)}>
                                    <i className="flaticon-close-1"></i>
                                </div>
                            </Box>
                        )}
                    </div>

                    <input
                        type="text" onChange={e => handleLinkChange(index, e.target.value)}
                        className={style.InputLink}
                        value={links}
                        placeholder='Photo Link'
                    />
                    {/* <div className={style.close}>
                        <i className="flaticon-close-1"></i>
                    </div> */}
                </div>
            ))}
        </>
    );
};

export default UploderNew;
