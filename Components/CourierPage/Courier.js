import { Button, Container, Grid } from "@mui/material";
import Switch from "@mui/material/Switch";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import SuperFetch from "../../hook/Axios";
import useLoading from "../../hook/useLoading";
import { useToast } from "../../hook/useToast";
import { activateCourier, headers } from "../../pages/api";
import SmallLoader from "../SmallLoader/SmallLoader";
import Pathao from "./Pathao";
import RedxCourier from "./RedxCourier";

const Courier = ({ busInfo }) => {
    const router = useRouter()
    const showToast = useToast();
    const [isLoading, startLoading, stopLoading] = useLoading();
    let [showApi, setShowApi] = useState(false);
    let [secretApi, setSecretApi] = useState(false);
    const [showPathaoSicrets, setShowPathaoSicrets] = useState({
        sicretKey: false,
        password: false,
    })
    const data = Cookies.get();

    const [openSteadFast, setOpenSteadFast] = useState(false);
    const [openRedx, setOpenRedx] = useState(false);
    const [openPathao, setOpenPathao] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [pathaoData, setPathaoData] = useState()
    const [steadFastData, setSteadFastData] = useState({})
    const [redxData, setRedxData] = useState({})
    // handleApiKey
    const handleApiKey = (key) => {
        if (key === "apiKey") {
            setShowApi(!showApi)
        } if (key === "secretKey") {
            setSecretApi(!secretApi)
        }
    }


    const label = { inputProps: { "aria-label": "Switch demo" } };
    const mainData = data?.user;
    let parseData;
    if (mainData != null) {
        parseData = JSON.parse(mainData);
    }
    const merchantId = parseData?.id;


    const decodeJson = (data) => {
        return data === undefined ? " " : JSON.parse(data)
    }
    //steadfast courier
    const handleSteadfastSubmit = (data) => {
        startLoading()
        const config = {
            "Api-Key": data.apiKey,
            "Secret-Key": data.apiSecret,
        };
        const configData = JSON.stringify(config);
        activateCourier(merchantId, "steadfast", "active", configData).then(
            (res) => {
                if (res?.status === 200) {
                    stopLoading()
                    showToast("Steadfast details have been successfully submitted.")
                    if (router.query.redirect_from) {
                        router.push("/?current_steap=panel6")
                    }

                }
            }
        );
    };
    const handleRedxSubmit = (data) => {
        startLoading()
        const config = {
            "Api-Key": data.apiKey,
            "Secret-Key": data.apiSecret,
        };
        const configData = JSON.stringify(config);
        activateCourier(merchantId, "redx", "active", configData).then(
            (res) => {
                if (res?.status === 200) {
                    stopLoading()
                    showToast("Steadfast details have been successfully submitted.")
                    if (router.query.redirect_from) {
                        router.push("/?current_steap=panel6")
                    }

                }
            }
        );
    };


    //pathao
    const handlePathaoSubmit = (data) => {
        startLoading()
        const config = {
            "client_id": data.client_id,
            "client_secret": data.client_secret,
            "username": data.username,
            "password": data.password,
            "grant_type": "password",
            "store_id": data.store_id
        }
        const configData = JSON.stringify(config);
        activateCourier(merchantId, "pathao", "active", configData).then((res) => {
            if (res.status === 200) {
                showToast("Pathao details have been successfully submitted.")
                if (router.query.redirect_from) {
                    router.push("/?current_steap=panel6")
                }
            }
            stopLoading()
        });
    };


    useEffect(() => {
        startLoading()
        SuperFetch.get("/client/courier/list", { headers: headers })
            .then(function (response) {
                if (response.data?.data?.length > 0) {
                    for (let i = 0; i < response.data?.data.length; i++) {
                        if (response.data?.data[i].provider === 'steadfast') {
                            setSteadFastData(response.data?.data[i])
                            setOpenSteadFast(true)
                        }
                        if (response.data?.data[i].provider === 'pathao') {
                            setPathaoData(response.data?.data[i])
                            setOpenPathao(true)
                        }
                        if (response.data?.data[i].provider === 'redx') {
                            setRedxData(response.data?.data[i])
                            setOpenRedx(true)
                        }
                    }
                }
                stopLoading()
            })
            .catch(function (error) {
                stopLoading()
            });

    }, [])


    //toggle pathao sicret 


    const hanldeInputTypeChange = (input) => {
        if (input === "sicretKey") {
            setShowPathaoSicrets({
                sicretKey: !showPathaoSicrets?.sicretKey,
            })
        } if (input === "password") {
            setShowPathaoSicrets({
                password: !showPathaoSicrets?.password,
            })
        }
    }


    return (
        <>
            <section className='Courier'>
                {
                    isLoading && <SmallLoader />
                }

                {/* header */}
                <HeaderDescription videoLink={
                    {
                        video: "https://www.youtube.com/embed/PkGV4CPmCWo?si=Cqzjvs5kVd4Hkyjw",
                        title: "How to add your courier API with Funnel Liner : A detailed tutorial"
                    }} headerIcon={'flaticon-express-delivery'} title={'Courier'} subTitle={'Deliver your products with your preferred courier service'} search={false} order={false} />

                <Container maxWidth='sm'>

                    {/* CourierContent */}
                    <div className='CourierContent'>
                        <Grid container spacing={3}>
                            {/* item 1 */}
                            <Grid item xs={12} sm={6} md={4}>
                                <div className='CourierItem boxShadow'>

                                    <div className='img'>
                                        <img src='../images/steadfast.png' alt='' />
                                    </div>

                                    <div className='text'>
                                        <h4>Select Steadfast</h4>

                                        <div className='Toggle'>
                                            <Switch
                                                onChange={() => setOpenSteadFast(event.target.checked)}
                                                {...label}
                                                checked={openSteadFast}
                                            />
                                        </div>

                                        {/* <div className='Toggle'>
                                            {status && <>
                                                {openSteadFast && <button>Activated</button>}
                                            </>
                                            }
                                        </div> */}
                                    </div>


                                    {openSteadFast === true ? (

                                        <div className='InputField'>
                                            <form onSubmit={handleSubmit(handleSteadfastSubmit)}>

                                                <div className='customInput'>

                                                    <label>API Key</label>
                                                    <input {...register("apiKey", { required: true })} type={showApi ? 'text' : 'password'}
                                                        defaultValue={decodeJson(steadFastData?.config)['Api-Key'] !== undefined ? decodeJson(steadFastData?.config)['Api-Key'] : null} />
                                                    <div className="eye" onClick={() => handleApiKey("apiKey")}>
                                                        {
                                                            showApi
                                                                ?
                                                                <i className="flaticon-eye"></i>
                                                                :
                                                                <i className="flaticon-hidden"></i>
                                                        }
                                                    </div>
                                                    {errors.apiKey && (
                                                        <p className="error">
                                                            Api Key is required
                                                        </p>
                                                    )}

                                                </div>

                                                <div className="customInput">
                                                    <label>Secret Key</label>
                                                    <input {...register("apiSecret", { required: true })} defaultValue={decodeJson(steadFastData?.config)['Secret-Key']}
                                                        type={secretApi ? 'text' : 'password'} />

                                                    <div className="eye" onClick={() => handleApiKey("secretKey")}>
                                                        {
                                                            secretApi
                                                                ?
                                                                <i className="flaticon-eye"></i>
                                                                :
                                                                <i className="flaticon-hidden"></i>
                                                        }
                                                    </div>
                                                    {errors.apiSecret && (
                                                        <p className="error">
                                                            Api secret is required
                                                        </p>
                                                    )}

                                                </div>

                                                <div className="duelButton">
                                                    <Button type="submit">Submit</Button>

                                                </div>

                                            </form>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </Grid>


                            <Grid item xs={12} sm={6} md={4}>
                                <div className='CourierItem boxShadow'>
                                    <div className='img'>
                                        <img src='images/pathao.png' alt='' />
                                    </div>

                                    <div className='text'>
                                        <h4>Select Pathao Parcels</h4>

                                        <div className='Toggle'>
                                            <Switch
                                                onChange={() => setOpenPathao(event.target.checked)}
                                                {...label}
                                                checked={openPathao}
                                            />
                                        </div>
                                    </div>
                                    {openPathao === true ? (
                                        <Pathao merchantId={merchantId} stopLoading={stopLoading} startLoading={startLoading} showPathaoSicrets={showPathaoSicrets} pathaoData={pathaoData} hanldeInputTypeChange={hanldeInputTypeChange} ></Pathao>
                                        // <div className='InputField'>
                                        //     <form onSubmit={handleSubmit(handlePathaoSubmit)}>

                                        //         <div className='customInput'>
                                        //             <label>Client Id</label>
                                        //             <input type="text" {...register('client_id', { required: true })} defaultValue={decodeJson(pathaoData?.config)?.client_id} />
                                        //         </div>

                                        //         <div className='customInput'>
                                        //             <label>Client Secret</label>
                                        //             <input type={showPathaoSicrets?.sicretKey ? "text" : "password"} {...register('client_secret', { required: true })} defaultValue={decodeJson(pathaoData?.config)?.client_secret} />
                                        //             <div className="eye" onClick={() => hanldeInputTypeChange("sicretKey")}>
                                        //                 {
                                        //                     showPathaoSicrets?.sicretKey
                                        //                         ?
                                        //                         <i className="flaticon-eye"></i>
                                        //                         :
                                        //                         <i className="flaticon-hidden"></i>
                                        //                 }
                                        //             </div>
                                        //         </div>
                                        //         <div className='customInput'>
                                        //             <label>Username</label>
                                        //             <input type="text" {...register('username', { required: true })} defaultValue={decodeJson(pathaoData?.config)?.username} />
                                        //         </div>
                                        //         <div className='customInput'>
                                        //             <label>Password</label>
                                        //             <input type={showPathaoSicrets?.password ? "text" : "password"} {...register('password', { required: true })} defaultValue={decodeJson(pathaoData?.config)?.password} />
                                        //             <div className="eye" onClick={() => hanldeInputTypeChange("password")}>
                                        //                 {
                                        //                     showPathaoSicrets?.password
                                        //                         ?
                                        //                         <i className="flaticon-eye"></i>
                                        //                         :
                                        //                         <i className="flaticon-hidden"></i>
                                        //                 }
                                        //             </div>
                                        //         </div>
                                        //         {/* <div className='customInput'>
                                        //             <label>Grant Type</label>
                                        //             <input type="text" {...register('grant_type', { required: true })} defaultValue={decodeJson(pathaoData?.config)?.grant_type} />
                                        //         </div> */}
                                        //         <div className='customInput'>
                                        //             <label>Store ID</label>
                                        //             <input type="text" {...register('store_id', { required: true })} defaultValue={decodeJson(pathaoData?.config)?.store_id} />
                                        //         </div>

                                        //         <div className="duelButton">
                                        //             <Button type="submit">Submit</Button>
                                        //             {/* <Button disabled={isLoading} type="submit">{isLoading && <i><Spinner /> </i>}Submit</Button> */}
                                        //         </div>

                                        //     </form>
                                        // </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </Grid>



                            {/* <Grid item xs={12} sm={6} md={4}>
                                <div className='CourierItem boxShadow'>

                                    <div className='img'>
                                        <img src='../images/new-redx-logo.svg' alt='' />
                                    </div>

                                    <div className='text'>
                                        <h4>Select Redx</h4>

                                        <div className='Toggle'>
                                            <Switch
                                                onChange={() => setOpenSteadFast(event.target.checked)}
                                                {...label}
                                                checked={openSteadFast}
                                            />
                                        </div>

                                        <div className='Toggle'>
                                            {status && <>
                                                {openSteadFast && <button>Activated</button>}
                                            </>
                                            }
                                        </div>
                                    </div>


                                    {openSteadFast === true ? (

                                        <div className='InputField'>
                                            <form onSubmit={handleSubmit(handleRedxSubmit)}>

                                                <div className='customInput'>

                                                    <label>API Key</label>
                                                    <input {...register("apiKey", { required: true })} type={showApi ? 'text' : 'password'}

                                                        // defaultValue={decodeJson(steadFastData?.config)['Api-Key'] !== undefined ? decodeJson(steadFastData?.config)['Api-Key'] : null} 
                                                        />
                                                    <div className="eye" onClick={() => handleApiKey("apiKey")}>
                                                        {
                                                            showApi
                                                                ?
                                                                <i className="flaticon-eye"></i>
                                                                :
                                                                <i className="flaticon-hidden"></i>
                                                        }
                                                    </div>
                                                    {errors.apiKey && (
                                                        <p className="error">
                                                            Api Key is required
                                                        </p>
                                                    )}

                                                </div>

                                                <div className="customInput">
                                                    <label>Secret Key</label>
                                                    <input {...register("apiSecret", { required: true })}
                                                        // defaultValue={decodeJson(steadFastData?.config)['Secret-Key']}
                                                        type={secretApi ? 'text' : 'password'} />

                                                    <div className="eye" onClick={() => handleApiKey("secretKey")}>
                                                        {
                                                            secretApi
                                                                ?
                                                                <i className="flaticon-eye"></i>
                                                                :
                                                                <i className="flaticon-hidden"></i>
                                                        }
                                                    </div>
                                                    {errors.apiSecret && (
                                                        <p className="error">
                                                            Api secret is required
                                                        </p>
                                                    )}

                                                </div>

                                                <div className="duelButton">
                                                    <Button type="submit">Submit</Button>

                                                </div>

                                            </form>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </Grid> */}
                            <RedxCourier merchantId={merchantId} showToast={showToast} setOpenRedx={setOpenRedx} openRedx={openRedx} stopLoading={stopLoading} startLoading={startLoading} redxData={redxData}  />

                        </Grid>
                    </div>
                </Container>

            </section>
        </>
    );
};

export default Courier;
