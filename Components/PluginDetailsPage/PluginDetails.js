import {Button, Container, Grid} from '@mui/material';
import React from 'react';
import Switch from '@mui/material/Switch';
import {BsPlug} from 'react-icons/bs';


const PluginDetails = () => {

    const label = {inputProps: {'aria-label': 'Switch demo'}};

    return (

        <>

            <section className='TopSellingProducts DashboardSetting Courier Plugin'>

                <Container maxWidth="sm">

                    <Grid Container spacing={3}>

                        <Grid item xs={12}>

                            <div className="Header d_flex d_justify">

                                {/* Left */}
                                <div className="Left d_flex">

                                    <div className="svg">
                                        <BsPlug/>
                                    </div>

                                    <div className="text">
                                        <h4>Plugins</h4>
                                        <p>Add plugins for extra advantages</p>
                                    </div>

                                </div>

                            </div>

                        </Grid>

                    </Grid>

                    {/* CourierContent */}
                    <div className="CourierContent PluginDetails">

                        <Grid container spacing={4}>

                            {/* item */}
                            <Grid item xs={12} sm={4} md={3}>

                                <div className="CourierItem Left">

                                    <div className="Free">
                                        <span>Free</span>
                                    </div>

                                    <div className="img">
                                        <img src="images/otp.png" alt=""/>
                                    </div>

                                    <div className="text">

                                        <h5>OTP Verify</h5>
                                        <p>One Time Payment</p>
                                        <h4>BDT 500</h4>

                                        <Button>Add Plugin</Button>

                                    </div>

                                </div>

                            </Grid>

                            {/* item */}
                            <Grid item xs={12} sm={8} md={9}>

                                <div className="">

                                    <div className="CourierItem Description">

                                        <h3>Plugins Details</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur proin ut
                                            odio eu dui molestie convallis. Massa aliquam odio et hac ultrices viverra
                                            cras. Consectetur volutpat pulvinar convallis dictum morbi pharetra morbi
                                            mauris. Sit diam posuere consequat dui. Nisl consectetur praesent sagittis,
                                            quam sed. Id diam adipiscing porttitor felis. Amet, justo vitae pellentesque
                                            in gravida. Tempus, fermentum eget iaculis non egestas morbi. Egestas diam
                                            quis porttitor urna leo.</p>

                                    </div>

                                    {/* SimilarPlugins */}
                                    <div className="SimilarPlugins">

                                        <h3>Plugins Details</h3>

                                        <Grid container spacing={4}>

                                            {/* item */}
                                            <Grid item sx={12} sm={6} md={4}>

                                                <div className="CourierItem">

                                                    <div className="Free">
                                                        <span>Free</span>
                                                    </div>

                                                    <div className="img">
                                                        <img src="images/fb-pixel.png" alt=""/>
                                                    </div>

                                                    <div className="text">

                                                        <h5>Facebook Pixel</h5>

                                                        <div className="Toggle">

                                                            <p>Disabled</p>

                                                            <Switch {...label} />

                                                        </div>

                                                    </div>

                                                </div>

                                            </Grid>

                                            {/* item */}
                                            <Grid item sx={12} sm={6} md={4}>

                                                <div className="CourierItem">

                                                    <div className="Free">
                                                        <span>Free</span>
                                                    </div>

                                                    <div className="img">
                                                        <img src="images/domain-verify.png" alt=""/>
                                                    </div>

                                                    <div className="text">

                                                        <h5>Domain Verify</h5>

                                                        <div className="Toggle">

                                                            <p>Disabled</p>

                                                            <Switch {...label} />

                                                        </div>

                                                    </div>

                                                </div>

                                            </Grid>

                                        </Grid>

                                    </div>

                                </div>

                            </Grid>

                        </Grid>

                    </div>

                </Container>

            </section>

        </>

    )

}

export default PluginDetails