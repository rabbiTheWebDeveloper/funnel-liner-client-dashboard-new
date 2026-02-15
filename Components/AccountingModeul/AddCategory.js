import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { headers } from '../../pages/api';
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const AddCategory = ({ handleCloseSuggestNote, openSuggestNote ,fetchLedgerData , type, closeAllModal, setSelectedLedgerCategory, addValue}) => {
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    const addCategory = async (data) => {
        data.type=type
        const addRes = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.CREATE_LEDGER}`, data, {
            headers: headers
        })
        if(addRes?.data?.success){
            addValue([{ value: addRes?.data?.data?.id, label: addRes?.data?.data?.name }])
            // addValue(addRes?.data?.data?.id)
            fetchLedgerData()
            handleCloseSuggestNote()
        }else{
            Swal.fire({
                icon: "error",
                title: error?.addRes?.data?.msg,

            });
            closeAllModal()
        }
        reset()
    }


    return (
        <div className="NoteHover">
            <Modal
                open={openSuggestNote}
                onClose={handleCloseSuggestNote}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="tableModal"
            >
                <Box>
                    <form onSubmit={handleSubmit(addCategory)}>
                        <div className="tableModalContent">
                            <div className="header">
                                <div className="left">
                                    <i className="flaticon-edit"></i>
                                    <h4>Please Enter Your Category/Ledger</h4>
                                </div>
                                <div className="right" onClick={handleCloseSuggestNote}>
                                    <i className="flaticon-close-1"></i>
                                </div>
                            </div>
                            <div className="tableModalForm">
                                <div className="customInput">
                                    <label>Category/Ledger</label>
                                    <input type="text" placeholder='Enter Your Category/Ledger' {...register("name", { required: true, maxLength: 20 })} />
                                    {errors.name && <span>This field is required</span>}
                                </div>
                            </div>
                            <div className="duelButton">
                                <Button type='submit'>Update</Button>
                                {/* <Button className="red">Reset</Button> */}
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddCategory;