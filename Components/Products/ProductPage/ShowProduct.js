import { Box, Modal } from "@mui/material";
const ShowProduct = ({ id, product, modalOpen, handleCloseModal}) => {
    return (
        <div>
           
            <Modal
                keepMounted
                open={modalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='viewModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>
                            <div className='left'>
                                <i className="flaticon-view"></i>
                                <h4>Products</h4>
                            </div>

                            <div className='right' onClick={handleCloseModal}>
                                <i className="flaticon-close-1"></i>
                            </div>

                        </div>

                        <div className="table">

                            <table>


                                <tr>

                                    <th>Product Name</th>
                                    <td>{product?.product_name}</td>

                                    <th>Selling Price</th>
                                    <td>{product?.price}</td>

                                </tr>

                                <tr>

                                    <th>Product Code</th>
                                    <td>{product?.product_code}</td>

                                    <th>Available Quantity</th>
                                    <td>
                                        {product?.product_qty > 0 ? product?.product_qty : <p className="error"> stock out </p>}
                                    </td>

                                </tr>
                                <tr>

                                    <th>Product Image</th>
                                    <td><img src={product?.main_image} alt="" /></td>
                                    <th></th>
                                    <td></td>

                                </tr>


                            </table>

                        </div>

                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ShowProduct;
