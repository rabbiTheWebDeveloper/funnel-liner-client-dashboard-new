import {Link} from '@mui/material';
import React, {useState} from 'react';
import axios from "axios";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import { API_ENDPOINTS } from '../../config/ApiEndpoints';

const Otp = ({phone}) => {

    const router = useRouter()
    const [code, setcode] = useState(new Array(6).fill(""));

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setcode([...code.map((d, indx) => (indx === index ? element.value : d))]);

        //Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const verifyOtp = () => {

        const data = {
            otp: code.toString().replaceAll(',', ''),
            phone: phone
        }
        axios.post(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.OTP.VERIFY_OTP, data).then((response) => {
            if (response.data.success) {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                });

                localStorage.clear()
                localStorage.setItem('user', JSON.stringify(response.data.data))
                localStorage.setItem('token', response.data.data.api_token)

                router.replace('http://dashboard.funnelliner.com').then(r =>{})
            } else {
                toast.error(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }).catch(errors => {
            toast.error('Something went wrong', {
                position: toast.POSITION.TOP_CENTER,
            });
        })
    }

    const resendOtp = () => {
        axios.post(API_ENDPOINTS.BASE_URL+ API_ENDPOINTS.OTP.RESEND_OTP, {phone: phone}).then((response) => {
            if (response.data.success) {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                toast.error(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }).catch(errors => {
            toast.error('Something went wrong', {
                position: toast.POSITION.TOP_CENTER,
            });
        })
    }

    return (

        <>

            <div className="Otp">

                <div className="OtpContent">

                    <div className="Logo">
                        <img src="images/logo_1.svg" alt=""/>
                    </div>

                    <h4>Confirm OTP</h4>

                    <div className="OtpCode">
                        <label>Otp has been send to given number, please enter the otp to verify</label>

                        {code.map((data, index) => {
                            return (
                                <input
                                    type="text"
                                    className="otp-field"
                                    name="otp"
                                    maxLength={1}
                                    key={index}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onFocus={(e) => e.target.select}
                                    autoFocus={index === 0}
                                    required={true}
                                />
                            );
                        })}
                    </div>

                    <p>Did you get the code? <Link onClick={resendOtp}>Resend Code</Link></p>
                    <button type="submit" onClick={verifyOtp}>Submit</button>

                </div>

            </div>

        </>

    )

}

export default Otp