import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import Cookies from 'js-cookie'
import { useToast } from '../../hook/useToast';
import { ThreeDots } from 'react-loader-spinner'
const axios = require('axios');
const SignIn = () => {
    const router = useRouter()
    const showToast = useToast()
    const [merchentPhone, setMerchentPhone] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLoginBikashMerchnet = (e) => {
        e.preventDefault();
        setIsLoading(true)
        axios
            .post(process.env.Bkash_URL, { number: merchentPhone, password: password, access_token: '6db5fa4d34aee26b39b473cdf0a8dcfa0308779102f6e509' }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
            )
            .then(res => {
                setIsLoading(true)
                if (res.data.status === "success") {

                    Cookies.set('m_b_k_n', res.data.number)
                    Cookies.set('m_b_k_p', res.data.password)
                    router.push("/bkash-marcent-dashboard")
                    showToast("Login Success!", "success")
                } else {
                    showToast("Invalid Account", "error")
                }
            })
            .catch(error => {
                setIsLoading(false)
                showToast("Something went wrong! ", "error")
            })
    }


    return (

        <>
            <section className='BkashSignUp'>
                <div className="BkashSignUpContent boxShadow">
                    <div className="Header">
                        <div className="img">
                            <img src="/images/bkash-marcent.png" alt="" />
                        </div>
                        <div className="text">
                            <h3>Welcome Back to</h3>
                            <h6>bKash Business Dashboard</h6>
                        </div>
                    </div>
                    <form onSubmit={handleLoginBikashMerchnet}>
                        <div className="customInput">
                            <label>Mobile Number</label>
                            <input required onChange={(e) => setMerchentPhone(e.target.value)} type="number" placeholder='Mobile Number' />
                        </div>

                        <div className="customInput">
                            <label>Password</label>
                            <input required onChange={(e) => setPassword(e.target.value)} type="text" placeholder='Password' />
                        </div>

                        <div className="duelButton">
                            <Button type="submit" disabled={isLoading}>Update</Button>
                        </div>

                    </form>
                </div>
            </section>
        </>
    )
}

export default SignIn
