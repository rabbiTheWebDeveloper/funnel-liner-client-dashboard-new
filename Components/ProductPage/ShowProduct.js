import { Box, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { headers } from "../../pages/api";

const ShowProduct = ({ id }) => {
    const [products, setProducts] = useState([]);
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);
    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + "/client/products/" + id, { headers: headers })
            .then(function (response) {
                setProducts(response.data.data);
            });
    }, [id]);

    return (
        <div>
            <i class="flaticon-view" onClick={handleOpenSales}></i>
            <Modal
                keepMounted
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
                                <h4>Products</h4>
                            </div>

                            <div className='right' onClick={handleCloseSales}>
                                <i class="flaticon-close-1"></i>
                            </div>

                        </div>

                        <table>


                            <tr>

                                <th>Product Name</th>
                                <td>{products?.product_name}</td>

                                <th>Selling Price</th>
                                <td>{products?.price}</td>

                            </tr>

                            <tr>

                                <th>Product Code</th>
                                <td>{products?.product_code}</td>

                                <th>Available Quantity</th>
                                <td>
                                    {products?.product_qty > 0 ? products?.product_qty : <p className="error"> stock out </p>}
                                </td>

                            </tr>

                            <tr>

                                <th>Product Image</th>
                                <td><img src={products?.main_image?.name} alt="" /></td>

                                <th></th>
                                <td></td>

                            </tr>


                        </table>

                    </div>

                    {/* <div className="SalesTargetModal">
                        <div className="Form">
                            <div className="CustomeInput">
                                <label> </label>
                                <TextField id="outlined-basic" disabled variant="outlined" value={products?.product_qty > 0 ? products?.product_qty : <span style={{ color: 'red' }}> />
                            </div>
                            <div className="CustomeInput">
                                <label> </label>
                                
                            </div>
                        </div>
                    </div> */}
                </Box>
            </Modal>
        </div>
    );
};

export default ShowProduct;
