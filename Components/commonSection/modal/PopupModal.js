import { Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";

const PopupModal = () => {

    // Modal

    //   EditModal
    const [viewModal, setViewModal] = useState(false);
    const handleViewModal = () => setViewModal(true);
    const handleViewModalClose = () => setViewModal(false);

    // UpdateModal
    const [updateModal, setUpdateModal] = useState(false);
    const handleUpdateModal = () => setUpdateModal(true);
    const handleUpdateModalClose = () => setUpdateModal(false);

    return (
        <>
            <div className="PopupModal">


                {/* Edit Modal */}
                <Button className="bg" onClick={handleViewModal}>
                    View Modal
                </Button>

                <Modal
                    keepMounted
                    open={viewModal}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                    className='viewModal'
                >
                    <Box className='modalBox'>

                        <div className='modalContent'>

                            <div className='header'>
                                <div className='left'>
                                    <i className="flaticon-view"></i>
                                    <h4>View</h4>
                                </div>

                                <div className='right' onClick={handleViewModalClose}>
                                    <i className="flaticon-close-1"></i>
                                </div>

                            </div>

                            <div className="table">

                                <table>

                                    <tr>

                                        <th>Order Date</th>
                                        <td>15 minutes ago</td>

                                        <th>Order Date</th>
                                        <td>Order Date</td>

                                    </tr>

                                    <tr>

                                        <th>Order Date</th>
                                        <td>15 minutes ago15 minutes ago15 minutes ago15 minutes ago15 minutes ago</td>

                                        <th>Order Date</th>
                                        <td>15 minutes ago15 minutes ago15 minutes ago15 minutes ago</td>

                                    </tr>

                                    <tr>

                                        <th>Order Date</th>
                                        <td>15 minutes ago</td>

                                        <th>Order Date</th>
                                        <td>Order Date</td>

                                    </tr>

                                    <tr>

                                        <th>Order Date</th>
                                        <td>15 minutes ago</td>

                                        <th>Order Date</th>
                                        <td>Order Date</td>

                                    </tr>


                                </table>

                            </div>

                        </div>

                    </Box>

                </Modal>



                {/* Update Modal */}
                <Button className="bg" onClick={handleUpdateModal}>
                    Update Modal
                </Button>

                <Modal
                    keepMounted
                    open={updateModal}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                    className='updateModal'
                >
                    <Box className='modalBox'>

                        <div className='modalContent'>

                            <div className='header'>
                                <div className='left'>
                                    <i className="flaticon-edit"></i>
                                    <h4>Update</h4>
                                </div>

                                <div className='right' onClick={handleUpdateModalClose}>
                                    <i className="flaticon-close-1"></i>
                                </div>

                            </div>

                            <form action="">

                                <div className='updateModalForm'>

                                    <div className='customInput'>
                                        <label>Customer Name</label>
                                        <input type="text" placeholder="Name" />
                                    </div>

                                    <div className='customInput'>
                                        <label>Contact No</label>
                                        <input type="text" placeholder="Name" />
                                    </div>

                                    <div className='customInput'>
                                        <label>Contact No</label>
                                        <select name="">
                                            <option value="">1</option>
                                            <option value="">2</option>
                                            <option value="">3</option>
                                        </select>
                                    </div>

                                    <div className='customInput'>
                                        <label>Contact No</label>
                                        <input type="text" placeholder="Name" />
                                    </div>

                                    <div className='customInput'>
                                        <label>Contact No</label>
                                        <input type="file" placeholder="Name" />
                                    </div>

                                    <div className='customInput'>
                                        <label>Contact Details</label>
                                        <textarea name="" rows="3"></textarea>
                                    </div>

                                </div>

                                <div className="duelButton">

                                    <Button>Update</Button>
                                    <Button className="red">Reset</Button>

                                </div>

                            </form>

                        </div>

                    </Box>

                </Modal>

            </div>
        </>
    );
};

export default PopupModal;
