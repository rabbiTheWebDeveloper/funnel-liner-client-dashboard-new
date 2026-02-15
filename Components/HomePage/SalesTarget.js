import { Button } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import ProgressCircle from './HomePageCart/ProgressCircle';
import SalesTargetModal from './HomePageCart/SalesTargetModal';



const SalesTarget = ({ salesTarget, salesTargetRfatch }) => {
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);;
    const calculatePercentage = (achievement) => {
        const numberValue = parseFloat(achievement?.replace(/,/g, ''))
     
        let percent = Math.min(numberValue, 100);
        return percent;
    }
    return (

        <>

            <div className="SalesTarget boxShadow">

                <div className="SalesTargetContent">

                    <div className="Header d_flex d_justify">

                        <h4> <i className='flaticon-stock-market-1'></i> Sales Target</h4>

                        <Button onClick={handleOpenSales} className='bg'>Update Sales Target</Button>
                        <SalesTargetModal setOpenSales={setOpenSales} salesTargetRfatch={salesTargetRfatch} salesTarget={salesTarget} handleOpenSales={handleOpenSales} handleCloseSales={handleCloseSales} openSales={openSales} />

                    </div>

                    <div className="SalesTargetBox">

                        {/* item */}
                        <div className="SalesTargetItem">

                            <div className="Header">
                                <h5>Daily</h5>
                            </div>

                            <div className="SalesTargetItemBox d_flex d_justify">

                                <div className="left">

                                    <div className="item">
                                        <h6>Achievement </h6>
                                        <h3>{salesTarget?.amounts?.daily_total ? salesTarget?.amounts?.daily_total?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"} ৳</h3>
                                    </div>

                                    <div className="item">
                                        <h6>Target </h6>
                                        <h3>{Object.keys(salesTarget).length > 0 ? salesTarget.daily?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"} ৳</h3>
                                    </div>

                                </div>

                                <div className="right">

                                    <ProgressCircle percentage={parseFloat(salesTarget?.daily_completed ? salesTarget?.daily_completed : "00.00")} />
                                    <div className="overlay">
                                        <span>{salesTarget?.daily_completed ? salesTarget?.daily_completed : "00.00"}%</span>
                                        <p>Achievement </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* item */}
                        <div className="SalesTargetItem">

                            <div className="Header">
                                <h5>Monthly</h5>
                            </div>

                            <div className="SalesTargetItemBox d_flex d_justify">

                                <div className="left">

                                    <div className="item">
                                        <h6>Achievement </h6>
                                        <h3>{salesTarget?.amounts?.monthly_total ? salesTarget?.amounts?.monthly_total?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") :"00" } ৳</h3>
                                    </div>

                                    <div className="item">
                                        <h6>Target </h6>
                                        <h3>{Object.keys(salesTarget).length > 0 ? salesTarget.monthly?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"} ৳</h3>
                                    </div>

                                </div>

                                <div className="right">

                                    <ProgressCircle percentage={calculatePercentage(salesTarget?.monthly_completed ? salesTarget?.monthly_completed : "00.00")} />

                                    <div className="overlay">
                                        <span>{salesTarget?.monthly_completed ? salesTarget?.monthly_completed : "00.00"}%</span>
                                        <p>Achievement </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* item */}
                        <div className="SalesTargetItem">

                            <div className="Header d_flex d_justify">
                                <h5>Custom Date</h5>
                                <h5>
                                    {
                                        salesTarget?.from_date && <span>({salesTarget?.from_date ? moment(salesTarget?.from_date).format("DD-MM-YYYY") : ""} - {salesTarget?.to_date ? moment(salesTarget?.to_date).format("DD-MM-YYYY") : ""}) </span>
                                    }
                                </h5>
                            </div>


                            <div className="SalesTargetItemBox d_flex d_justify">

                                <div className="left">

                                    <div className="item">
                                        <h6>Achievement </h6>
                                        <h3>{salesTarget?.amounts?.custom_total ? salesTarget?.amounts?.custom_total?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00" }৳</h3>
                                    </div>

                                    <div className="item">
                                        <h6>Target </h6>
                                        <h3>{Object.keys(salesTarget).length > 0 ? salesTarget.custom?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"} ৳</h3>
                                    </div>

                                </div>

                                <div className="right">

                                    <ProgressCircle percentage={calculatePercentage(salesTarget?.custom_completed ? salesTarget?.custom_completed : "00.00")} />

                                    <div className="overlay">
                                        <span>{salesTarget?.custom_completed ? salesTarget?.custom_completed : "00.00"}%</span>
                                        <p>Achievement </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

export default SalesTarget
