import { FormControl, FormControlLabel, FormGroup, Switch } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useToast } from '../../hook/useToast';
import { headers } from '../../pages/api';

const BulkSmsStatus = ({ handelFetchBusInfo }) => {
    const showToast = useToast();
    const [data, setData] = useState({});
    const [state, setState] = useState({});

    // Toggle
    const handleChangeToggle = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked ? '1' : '0',
        });
        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/order-sms-status-update", {
            sms_status: event.target.name
        }, {
            headers: headers
        })
            .then(function (response) {

                showToast(response?.data?.message, 'success');

            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.msg,
                }).then(r => r);
            });
    };

    const handleFetchBusInfo = async () => {
        try {
            let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/order-sms-status-show`, {
                headers: headers,
            });
            setData(response?.data?.data);
            setState(response?.data?.data);

        } catch (err) {

        }
    };
    useEffect(() => {
        handleFetchBusInfo().then(r => r);
    }, []);
    return (
        <div className="BulkSms">
            <div className="commonCart boxShadow cart-5">
                <FormControl component="fieldset" variant="standard">
                    <div className="header">
                        <h4><i className='flaticon-order-delivery'></i> Order Status Message</h4>
                        <p>Choose When You Want to Send Your Order Status Message</p>
                    </div>

                    <FormGroup className='BulkToggle'>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.pending === '1'}
                                    onChange={handleChangeToggle}
                                    name="pending"
                                />
                            }
                            label="Pending Order"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.confirmed === '1'}
                                    onChange={handleChangeToggle}
                                    name="confirmed"
                                />
                            }
                            label="Confirm Order"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.cancelled === '1'}
                                    onChange={handleChangeToggle}
                                    name="cancelled"
                                />
                            }
                            label="Cancel Order"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.shipped === '1'}
                                    onChange={handleChangeToggle}
                                    name="shipped"
                                />
                            }
                            label="Shipped"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.delivered === '1'}
                                    onChange={handleChangeToggle}
                                    name="delivered"
                                />
                            }
                            label="Delivered"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={state.returned === '1'}
                                    onChange={handleChangeToggle}
                                    name="returned"
                                />
                            }
                            label="Order Return"
                        />
                    </FormGroup>

                </FormControl>
            </div>
        </div>
    );
};

export default BulkSmsStatus;
