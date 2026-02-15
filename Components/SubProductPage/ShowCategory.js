import { Box, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { headers } from "../../pages/api";
const ShowCategory = ({ id }) => {
    const [products, setProducts] = useState([]);
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + "/client/categories/" + id, { headers: headers })
            .then(function (response) {
                // handle success
                setProducts(response.data.data);
            });
    }, [id]);
    return (
        <div>
            <div onClick={handleOpenSales}> <i class="flaticon-view"></i> </div>

            <Modal
                open={openSales}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='viewModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>

                            <div className='left'>
                                <i class="flaticon-view"></i>
                                <h4>View Category</h4>
                            </div>

                            <div className='right' onClick={handleCloseSales}>
                                <i class="flaticon-close-1"></i>
                            </div>

                        </div>

                        <table>


                            <tr>

                                <th>Category Name</th>
                                <td>{products?.name}</td>

                                <th>Category Image</th>
                                <td><img src={products?.category_image} alt="" /></td>

                            </tr>


                        </table>

                    </div>

                </Box>

            </Modal>

        </div>
    );
};

export default ShowCategory;