import { Box, Button, Modal } from '@mui/material';
import React, { useState } from 'react';

const Table = () => {

    // UpdateModal
    const [tableModal, setTableModal] = useState(false);
    const handleTableModal = () => setTableModal(true);
    const handleTableModalClose = () => setTableModal(false);

    return (

        <>

            <div className='Table'>

                <table>

                    <thead>
                        <tr>
                            <th>SL</th>
                            <th>Image</th>
                            <th>Input</th>
                            <th>Select</th>
                            <th>Invoice</th>
                            <th>Text 2 line</th>
                            <th>Date</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>01</td>
                            <td>
                                <img src="/images/man.png" alt="" />
                            </td>
                            <td>
                                <input type="text" />
                            </td>
                            <td>
                                <select name="">
                                    <option value="">One</option>
                                    <option value="">Two</option>
                                    <option value="">Three</option>
                                </select>
                            </td>
                            <td>
                                <Button className='invoice'>
                                    Print <i className="flaticon-printer"></i>
                                </Button>
                            </td>
                            <td>
                                text 2 line
                            </td>

                            <td>
                                <input className='time' type="date" />
                            </td>
                            <td>
                                <Button className='note'>
                                    Note
                                    <div className='viewNote' onClick={handleTableModal}><span>View note</span></div>
                                </Button>
                            </td>

                            <td>

                                <div className="action">

                                    <Button className='viewActionBtn'>
                                        <i className="flaticon-view"></i>
                                    </Button>

                                    <Button className='updateActionBtn'>
                                        <i className="flaticon-edit"></i>
                                    </Button>

                                    <Button className='deleteActionBtn'>
                                        <i className="flaticon-delete"></i>
                                    </Button>

                                </div>

                            </td>

                        </tr>

                        <tr>
                            <td>01</td>
                            <td>
                                <img src="/images/man.png" alt="" />
                            </td>
                            <td>
                                <input type="text" />
                            </td>
                            <td>
                                <select name="">
                                    <option value="">One</option>
                                    <option value="">Two</option>
                                    <option value="">Three</option>
                                </select>
                            </td>
                            <td>
                                <Button className='invoice'>
                                    Print <i className="flaticon-printer"></i>
                                </Button>
                            </td>
                            <td>
                                text 2 line
                            </td>

                            <td>
                                <input className='time' type="date" />
                            </td>
                            <td>
                                <Button className='note'>
                                    Note
                                    <div className='viewNote' onClick={handleTableModal}><span>View note</span></div>
                                </Button>
                            </td>

                            <td>

                                <div className="action">

                                    <Button className='viewActionBtn'>
                                        <i className="flaticon-view"></i>
                                    </Button>

                                    <Button className='updateActionBtn'>
                                        <i className="flaticon-edit"></i>
                                    </Button>

                                    <Button className='deleteActionBtn'>
                                        <i className="flaticon-delete"></i>
                                    </Button>

                                </div>

                            </td>

                        </tr>

                        <tr>
                            <td>01</td>
                            <td>
                                <img src="/images/man.png" alt="" />
                            </td>
                            <td>
                                <input type="text" />
                            </td>
                            <td>
                                <select name="">
                                    <option value="">One</option>
                                    <option value="">Two</option>
                                    <option value="">Three</option>
                                </select>
                            </td>
                            <td>
                                <Button className='invoice'>
                                    Print <i className="flaticon-printer"></i>
                                </Button>
                            </td>
                            <td>
                                text 2 line
                            </td>

                            <td>
                                <input className='time' type="date" />
                            </td>
                            <td>
                                <Button className='note'>
                                    Note
                                    <div className='viewNote' onClick={handleTableModal}><span>View note</span></div>
                                </Button>
                            </td>

                            <td>

                                <div className="action">

                                    <Button className='viewActionBtn'>
                                        <i className="flaticon-view"></i>
                                    </Button>

                                    <Button className='updateActionBtn'>
                                        <i className="flaticon-edit"></i>
                                    </Button>

                                    <Button className='deleteActionBtn'>
                                        <i className="flaticon-delete"></i>
                                    </Button>

                                </div>

                            </td>

                        </tr>

                        <tr>
                            <td>01</td>
                            <td>
                                <img src="/images/man.png" alt="" />
                            </td>
                            <td>
                                <input type="text" />
                            </td>
                            <td>
                                <select name="">
                                    <option value="">One</option>
                                    <option value="">Two</option>
                                    <option value="">Three</option>
                                </select>
                            </td>
                            <td>
                                <Button className='invoice'>
                                    Print <i className="flaticon-printer"></i>
                                </Button>
                            </td>
                            <td>
                                text 2 line
                            </td>

                            <td>
                                <input className='time' type="date" />
                            </td>
                            <td>
                                <Button className='note'>
                                    Note
                                    <div className='viewNote' onClick={handleTableModal}><span>View note</span></div>
                                </Button>
                            </td>

                            <td>

                                <div className="action">

                                    <Button className='viewActionBtn'>
                                        <i className="flaticon-view"></i>
                                    </Button>

                                    <Button className='updateActionBtn'>
                                        <i className="flaticon-edit"></i>
                                    </Button>

                                    <Button className='deleteActionBtn'>
                                        <i className="flaticon-delete"></i>
                                    </Button>

                                </div>

                            </td>

                        </tr>

                        <tr>
                            <td>01</td>
                            <td>
                                <img src="/images/man.png" alt="" />
                            </td>
                            <td>
                                <input type="text" />
                            </td>
                            <td>
                                <select name="">
                                    <option value="">One</option>
                                    <option value="">Two</option>
                                    <option value="">Three</option>
                                </select>
                            </td>
                            <td>
                                <Button className='invoice'>
                                    Print <i className="flaticon-printer"></i>
                                </Button>
                            </td>
                            <td>
                                text 2 line
                            </td>

                            <td>
                                <input className='time' type="date" />
                            </td>
                            <td>
                                <Button className='note'>
                                    Note
                                    <div className='viewNote' onClick={handleTableModal}><span>View note</span></div>
                                </Button>
                            </td>

                            <td>

                                <div className="action">

                                    <Button className='viewActionBtn'>
                                        <i className="flaticon-view"></i>
                                    </Button>

                                    <Button className='updateActionBtn'>
                                        <i className="flaticon-edit"></i>
                                    </Button>

                                    <Button className='deleteActionBtn'>
                                        <i className="flaticon-delete"></i>
                                    </Button>

                                </div>

                            </td>

                        </tr>

                        <tr>
                            <td>01</td>
                            <td>
                                <img src="/images/man.png" alt="" />
                            </td>
                            <td>
                                <input type="text" />
                            </td>
                            <td>
                                <select name="">
                                    <option value="">One</option>
                                    <option value="">Two</option>
                                    <option value="">Three</option>
                                </select>
                            </td>
                            <td>
                                <Button className='invoice'>
                                    Print <i className="flaticon-printer"></i>
                                </Button>
                            </td>
                            <td>
                                text 2 line
                            </td>

                            <td>
                                <input className='time' type="date" />
                            </td>
                            <td>
                                <Button className='note'>
                                    Note
                                    <div className='viewNote' onClick={handleTableModal}><span>View note</span></div>
                                </Button>
                            </td>

                            <td>

                                <div className="action">

                                    <Button className='viewActionBtn'>
                                        <i className="flaticon-view"></i>
                                    </Button>

                                    <Button className='updateActionBtn'>
                                        <i className="flaticon-edit"></i>
                                    </Button>

                                    <Button className='deleteActionBtn'>
                                        <i className="flaticon-delete"></i>
                                    </Button>

                                </div>

                            </td>

                        </tr>

                    </tbody>

                </table>

                {/* Modal */}
                <Modal
                    keepMounted
                    open={tableModal}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                    className='tableModal'
                >
                    <Box className='modalBox'>

                        <div className='tableModalContent'>

                            <div className='header'>
                                <div className='left'>
                                    <i className="flaticon-edit"></i>
                                    <h4>Update</h4>
                                </div>

                                <div className='right' onClick={handleTableModalClose}>
                                    <i className="flaticon-close-1"></i>
                                </div>

                            </div>

                            <form action="">

                                <div className='tableModalForm'>

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
    )

}

export default Table