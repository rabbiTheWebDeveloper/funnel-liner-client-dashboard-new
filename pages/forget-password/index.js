import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { LineWave } from "react-loader-spinner";
// import withAuth from "../../hook/PrivateRoute";
import dynamic from "next/dynamic";
//multi step div
import Button from "@mui/material/Button";
import getConfig from "next/config";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
const ReactCodeInput = dynamic(import("react-code-input"));
const axios = require("axios");
const steps = ["Select campaign settings", "Create an ad group", "Password Input"];
const ForgetPasswordPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter();
    const [click, setClick] = useState(false);
    const [disable, setDisable] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState();
    const [otp, setOtp] = useState();

    const props = {
        // className: reactCodeInput,
        inputStyle: {
            fontFamily: "monospace",
            margin: "4px",
            MozAppearance: "textfield",
            width: "45px",
            borderRadius: "5px",
            fontSize: "35px",
            height: "45px",
            paddingLeft: "17px",
            backgroundColor: "white",
            color: "#894bca",
            border: "1px solid #894bca",
            textAlig:'text-center'
        },
        inputStyleInvalid: {
            fontFamily: "monospace",
            margin: "4px",
            MozAppearance: "textfield",
            width: "45px",
            borderRadius: "3px",
            fontSize: "35px",
            height: "45px",
            paddingLeft: "15px",
            backgroundColor: "black",
            color: "red",
            border: "1px solid red",
        },
    };
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const handleSubmitPhoneNumber = (data) => {
        setPhoneNumber(data.phoneNumber);
        setDisable(true);
        axios
            .post(`${apiUrl}/client/forget-password`, {
                phone: data.phoneNumber,
            })
            .then(function (response) {
                if (response.data.success === false) {
                    toast.error("user not found")
                    setDisable(false);
                } else if (response.data.success === true) {
                    setDisable(false);
                    handleNext();
                }
            })
            .catch(function (error) {
                setDisable(false);
            });
    };

    const handleOtpChange = (e) => {
        setOtp(e);
    };

    //multi step div
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});

    const totalSteps = () => {
        return steps.length;
    };
    const completedSteps = () => {
        return Object.keys(completed).length;
    };
    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };
    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };
    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleSubmitOTP = () => {
        setDisable(true);
        axios
            .post(`${apiUrl}/client/otp-verify`, {
                phone: phoneNumber,
                otp: otp,
            })
            .then(function (response) {
                setDisable(false);
                if (response.data.success === true) {

                    Cookies.set('phoneNumber', response?.data?.data?.phone)

                    handleNext();
                } else if (response.data.success === false) {
                    toast.error("OTP Doesn't matched")
                }
            })
            .catch(function (error) {
                setDisable(false);
            });
    };


    //handle chnage password
    const {
        register: register2,
        formState: { errors: errors2 },
        handleSubmit: passwordChange,
    } = useForm();

    const handleChangedPassword = (data) => {

        setDisable(true);
        axios
            .post(`${apiUrl}/client/update-password`, {
                phone: Cookies.get('phoneNumber'),
                password: data.new_password,
                password_confirmation: data.confirm_password,
            })
            .then(function (response) {
                setDisable(false);

                if (response.data.success === true) {
                    toast.success("Password Changed")
                    router.push("/login");
                    // handleNext();
                } else if (response.data.success === false) {
                    toast.error("Password and confirm password does not match")
                }
            })
            .catch(function (error) {
                setDisable(false);

            });

    }
    let [showPass, setShowPass] = useState("");
    let handleShowPass = () => {
        setShowPass(!showPass);
    };
    let [showPass2, setShowPass2] = useState("");
    let handleShowPass2 = () => {
        setShowPass2(!showPass2);
    };

    return (
        <>
            <section className='Login'>
                {/* steap 0 phone number input */}
                {activeStep == 0 && (
                    <div className={`${disable === true ? 'LoginContent LoginContentDivOpacity' : 'LoginContent'}`}>
                        {/* Logo */}
                        <div className='Logo'>
                            <img src='/images/logo-beta.png' alt='' />
                        </div>

                        {/* HeaderText */}
                        <div className='HeaderText'>
                            <h4>
                                Enter your Phone number <br /> To reset your password
                            </h4>
                        </div>

                        {/* form Part */}
                        <div className='FormPart'>
                            <div className="spinnerForForgetPass">
                                <LineWave
                                    height='100'
                                    width='100'
                                    color='#4fa94d'
                                    ariaLabel='line-wave'
                                    wrapperStyle={{ margin: "30px" }}
                                    visible={disable}
                                    firstLineColor=''
                                    middleLineColor=''
                                    lastLineColor=''
                                />
                            </div>
                            <form key={1} onSubmit={handleSubmit(handleSubmitPhoneNumber)}>
                                <div className='customInput'>
                                    <label style={ { display:'block', textAlign: 'left' } }> Phone Number</label>
                                    <input type="text" defaultValue={"+880"} {...register("phoneNumber", {
                                        required: true,
                                        minLength: 10,
                                    })} placeholder="Enter Your Phone Number" />
                                    <p className="error">
                                        {errors.phoneNumber && (
                                            <span>Please Enter your valid phone number</span>
                                        )}
                                    </p>
                                </div>
                                <div className='customInput'>
                                    <Button disabled={disable} type='submit' className='bg'>
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}


                {/* steap 1 OTP input */}
                {
                    activeStep == 1 &&
                    <div className={`${disable === true ? 'LoginContent LoginContentDivOpacity' : 'LoginContent'}`}>
                        {/* Logo */}
                        <div className='Logo'>
                            <img src='/images/logo-beta.png' alt='' />
                        </div>

                        {/* HeaderText */}
                        <div className='HeaderText'>
                            <h4>
                                Please Enter The verification code we sent to your phone number
                            </h4>
                        </div>
                        <div className="spinnerForForgetPass">
                            <LineWave
                                height='100'
                                width='100'
                                color='#894bca'
                                borderRadius='10'
                                ariaLabel='line-wave'
                                wrapperStyle={{ margin: "30px" }}
                                visible={disable}
                                firstLineColor=''
                                middleLineColor=''
                                lastLineColor=''
                            />
                        </div>

                        {/* form Part */}
                        <div className='FormPart mx-auto'>
                            <div className='CustomeInput'>
                            <label style={ { display:'block', textAlign: 'left' } }> ENTER OTP</label>
                                <ReactCodeInput
                                    onChange={handleOtpChange}
                                    type='text'
                                    fields={6}
                                    {...props}
                                />
                            </div>
                            <div className='CustomeInput'>
                                <Button onClick={handleSubmitOTP} className='bg'>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                }


                {/* steap 2 password change */}
                {
                    activeStep == 2 && 
                    <section className='Login'>
                        <div className={`${disable === true ? 'LoginContent LoginContentDivOpacity' : 'LoginContent'}`}>
                            {/* Logo */}
                            <div className='Logo'>
                                <img src='/images/logo-beta.png' alt='' />
                            </div>
                            {/* HeaderText */}
                            <div className='HeaderText'>
                                <h5>
                                    Change Password
                                </h5>
                            </div>

                            {/* form Part */}
                            <div className='FormPart'>
                                <div className="spinnerForForgetPass">
                                    <LineWave
                                        height='100'
                                        width='100'
                                        color='#4fa94d'
                                        ariaLabel='line-wave'
                                        wrapperStyle={{ margin: "30px" }}
                                        visible={disable}
                                        firstLineColor=''
                                        middleLineColor=''
                                        lastLineColor=''
                                    />
                                </div>

                                <form key={2} onSubmit={passwordChange(handleChangedPassword)}>
                                    {/* Password */}
                                    <div className='customInput'>

                                        <label> New Password </label>
                                        <input 
                                            {...register2("new_password", {
                                                required: true,
                                            })}
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Password"
                                        />
                                        {showPass ? <div onClick={handleShowPass} className='eye'><AiFillEye /></div> :
                                            <div onClick={handleShowPass} className='eye'><AiFillEyeInvisible /></div>}
                                        <p className="error">
                                            {errors2.new_password && (
                                                <span>Password Required</span>
                                            )}
                                        </p>
                                    </div>
                                    {/* Confirm Password */}
                                    <div className='customInput'>
                                        <label> Confirm New Password </label>

                                        <input
                                            {...register2("confirm_password", {
                                                required: true,
                                            })}
                                            type={showPass2 ? 'text' : 'password'}
                                            placeholder='Confirm Password'
                                        />

                                        {showPass2 ? <div onClick={handleShowPass2} className='eye'><AiFillEye /></div> :
                                            <div onClick={handleShowPass2} className='eye'><AiFillEyeInvisible /></div>}
                                        <p className="error">
                                            {errors2.confirm_password && (
                                                <span>Password are not matching</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className='customInput'>
                                        <Button type="submit" className='bg'>
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                }

            </section>
            <Toaster />
        </>
    );
};

export default ForgetPasswordPage;
