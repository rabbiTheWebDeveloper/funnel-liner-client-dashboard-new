import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { headers } from '../../pages/api';
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const AddPayment = ({ handleClosePaymentMethod, openSuggestNote1 ,fetchCaseOutPaymentMethodData , type, fetchCaseInPaymentMethodData, closeAllModal, setSelectedPaymentCategory, addValue }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const addPaymentMethod = async (data) => {
        data.type=type
        
        const addPaymentMethodRes = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.CREATE_PAYMENT_METHOD}` , data, {
            headers: headers
        })

        if(addPaymentMethodRes?.data?.success){
            addValue([{ value: addPaymentMethodRes?.data?.data?.id, label: addPaymentMethodRes?.data?.data?.name }])
            // addValue(addPaymentMethodRes?.data?.data?.id)
            if(type === 'CashIn'){
                fetchCaseInPaymentMethodData()
            }else{
                fetchCaseOutPaymentMethodData()
            }
            handleClosePaymentMethod()
        }else{
            Swal.fire({
                icon: "error",
                title: addPaymentMethodRes?.data?.msg,
            });
            closeAllModal()
        }
        reset()
        
    };

    return (
        <div className="NoteHover">
            <Modal
                open={openSuggestNote1}
                onClose={handleClosePaymentMethod}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="tableModal"
            >
                <Box>
                    <form onSubmit={handleSubmit(addPaymentMethod)}>
                        <div className="tableModalContent">
                            <div className="header">
                                <div className="left">
                                    <i className="flaticon-edit"></i>
                                    <h4>Please Enter Your Payment Method </h4>
                                </div>
                                <div className="right" onClick={handleClosePaymentMethod}>
                                    <i className="flaticon-close-1"></i>
                                </div>
                            </div>
                            <div className="tableModalForm">
                                <div className="customInput">
                                    <label>Payment Method</label>
                                    <input type="text" placeholder='Enter Your Payment Method' {...register("name", { required: true, maxLength: 20 })} />
                                    {errors.name && <span>This field is required</span>}
                                </div>
                            </div>
                            <div className="duelButton">
                                <Button type='submit'>Add Payment Method</Button>
                                {/* <Button className="red">Reset</Button> */}
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddPayment;
