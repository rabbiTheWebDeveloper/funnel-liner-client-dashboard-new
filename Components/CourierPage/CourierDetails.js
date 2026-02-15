import { Box, Button, Container, Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import { GiReturnArrow } from 'react-icons/gi';
import { GoGraph } from 'react-icons/go';



const CourierDetails = ({ busInfo }) => {
    const { courier_balance } = busInfo
    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    // UpdateStockModal
    const [openStock, setOpenStock] = useState(false);
    const handleOpenStock = () => setOpenStock(true);
    const handleStockClose = () => setOpenStock(false);


    const courierblance = () => {
        axios.get('https://dev.funnelliner.com/check-balance')
            .then(function (response) {
                // handle success
              
            })
            .catch(function (error) {
                // handle error
              
            })
    }

    useEffect(() => {
        axios.get('https://dev.funnelliner.com/check-balance')
            .then(function (response) {
                // handle success
            })
            .catch(function (error) {
                // handle error
              
            })
    }, [])


    return (

        <>

            <section className='TopSellingProducts DashboardSetting Courier'>


                <Container maxWidth="sm">
                    {/* CourierContent */}
                    <div className="CourierDetailsContent">

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <div className="CourierDetailsItem">

                                    <div className='d_flex d_justify'>

                                        <div className="img">
                                            <img src="/images/steadfast.png" alt="" />
                                        </div>
                                        <div>
                                            <Button onClick={courierblance}><FiRefreshCcw /> Refresh</Button>
                                        </div>

                                    </div>

                                    <div className="CourierDetailsList">

                                        <Grid container spacing={3}>


                                            <Grid item sm={4} xs={6}>

                                                <div className="CourierListItem">

                                                    <h6><GoGraph /> Total Parcel</h6>

                                                    <h3>000</h3>

                                                </div>

                                            </Grid>


                                            <Grid item sm={4} xs={6}>

                                                <div className="CourierListItem bdrMob">

                                                    <h6><GoGraph /> Total Delivered</h6>

                                                    <h3>000</h3>

                                                </div>

                                            </Grid>


                                            <Grid item sm={4} xs={6}>

                                                <div className="CourierListItem">

                                                    <h6><GoGraph /> Total Cancelled</h6>

                                                    <h3>000</h3>

                                                </div>

                                            </Grid>


                                            <Grid item sm={4} xs={6}>

                                                <div className="CourierListItem bdrMob">

                                                    <h6><GoGraph /> Total Pending</h6>

                                                    <h3>000</h3>

                                                </div>

                                            </Grid>


                                            <Grid item sm={4} xs={6}>

                                                <div className="CourierListItem">

                                                    <h6><GoGraph /> Parcel To Be Delivered</h6>

                                                    <h3>000</h3>

                                                </div>

                                            </Grid>


                                            <Grid item sm={4} xs={6}>

                                                <div className="CourierListItem Last">

                                                    <h6><GoGraph /> Total Balance</h6>

                                                    <h3>{courier_balance ? courier_balance : "00"}</h3>

                                                </div>

                                            </Grid>

                                        </Grid>

                                    </div>

                                    <div className="RequestPayment">

                                        <Button onClick={handleOpenStock}>Request Payment</Button>

                                        {/* Modal */}
                                        <Modal
                                            open={openStock}
                                            onClose={handleStockClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box>

                                                <div className="UpdateStockModal">

                                                    <Grid Container spacing={3}>

                                                        <Grid item xs={12}>

                                                            <div className="Header">

                                                                {/* Left */}
                                                                <div className="Left d_flex">

                                                                    <div className="svg">
                                                                        <GiReturnArrow />
                                                                    </div>

                                                                    <div className="text">
                                                                        <h4>Request Payment</h4>
                                                                        <p>Payment Request For Due Amount</p>
                                                                    </div>

                                                                </div>

                                                                <div className="UpdateStockModalContent ">

                                                                    <div className="CustomeInput">

                                                                        <div className="CheckPaymentContent d_flex">

                                                                            {/* item */}
                                                                            <div className="CheckPayment">
                                                                                <input type="radio" name='Payment'
                                                                                    id='Bkash' />
                                                                                <label htmlFor="Bkash"><img
                                                                                    src="images/bkash.png"
                                                                                    alt="" /></label>
                                                                            </div>

                                                                            {/* item */}
                                                                            <div className="CheckPayment">
                                                                                <input type="radio" name='Payment'
                                                                                    id='Nagod' />
                                                                                <label htmlFor="Nagod"><img
                                                                                    src="images/nagod.png"
                                                                                    alt="" /></label>
                                                                            </div>

                                                                            {/* item */}
                                                                            <div className="CheckPayment">
                                                                                <input type="radio" name='Payment'
                                                                                    id='Bank' />
                                                                                <label htmlFor="Bank"><img
                                                                                    src="images/banktransfer.png"
                                                                                    alt="" /></label>
                                                                            </div>

                                                                            {/* item */}
                                                                            <div className="CheckPayment">
                                                                                <input type="radio" name='Payment'
                                                                                    id='Cash' />
                                                                                <label htmlFor="Cash"><img
                                                                                    src="images/cashpayment.png"
                                                                                    alt="" /></label>
                                                                            </div>

                                                                        </div>


                                                                        <p>Note :  payment comming Soon  </p>

                                                                        <div className="Item">
                                                                            <Button disabled className='Update'>Continue</Button>
                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </Grid>

                                                    </Grid>

                                                </div>

                                            </Box>

                                        </Modal>

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

export default CourierDetails