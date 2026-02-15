import { Box, Button, Container, Grid, Menu, MenuItem } from "@mui/material";
import Modal from "@mui/material/Modal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillCaretDown } from "react-icons/ai";

import Swal from "sweetalert2";
import { headers } from "../../pages/api";

import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import moment from "moment/moment";
import SuperFetch from "../../hook/Axios";
import DeliveryReport from "./DeliveryReport";
import { useToast } from "../../hook/useToast";

const TotalOrder = ({ allProduct, busInfo }) => {
    const showToast = useToast();
    const [salesTarget, setSalesTarget] = useState({});
    const [salesUpdate, setSalesUpdate] = useState({});

    const { register, handleSubmit, reset, formState: { errors } } = useForm();



    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);
    const [date, setTotalOrderDate] = useState('today');
    const [confirmed_date, setTotalConfirmedDate] = useState('today');
    const [sales_date, setTotalSalesDate] = useState('today');
    const [reportData, setReportData] = useState({})


    const onSubmit = (data) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/client/sales-target/update", data, {
                headers: headers,
            })
            .then(function (response) {

                setSalesUpdate(response);
                showToast('Sales Target update successfully!', 'success');
            })
            .catch(function (error) {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.msg,
                    footer: '<a href="">Why do I have this issue?</a>',
                });
            });


        reset();
        setOpenSales(false);
    };

    const handleFetchSellsTarget = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.NEXT_PUBLIC_API_URL}/client/sales-target`,
                headers: headers,
            });


            setSalesTarget(data?.data?.data);
        } catch (err) {

        }

    };
    const colorCheck = (num) => {
        if (num < 20 && num > 0) {
            return "red"
        } else if (num < 71 && num > 21) {
            return "blue"
        } else if (num => 80) {
            return "#72e128"
        }
    }
    const params = {
        date: date,
        confirmed_date: confirmed_date,
        sales_date: sales_date
    }

    useEffect(() => {
        handleFetchSellsTarget();
    }, [salesUpdate]);

    useEffect(() => {
        SuperFetch.get('/client/order-statistics', { params: params, headers: headers }).then(res => {
            setReportData(res.data.data)
        }).catch(error => {

        })
    }, [date, confirmed_date, sales_date])

    return (
        <>
            <section className="TotalOrder">
                <Container maxWidth="sm">
                    <Grid container spacing={3}>
                        {/* Total Order */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="TotalOrderItem boxShadow commonCart cart-1">

                                {/* header */}
                                <div className="header d_flex d_justify">
                                    <h4><i className="flaticon-stock-market-1"></i> Total Order</h4>

                                    <div className="DropDown">
                                        <PopupState variant="popover" popupId="DropDown">
                                            {(popupState) => (
                                                <>
                                                    <Button {...bindTrigger(popupState)}>
                                                        <h6 className="d_flex">
                                                            {date}
                                                            <div className="svg">
                                                                <AiFillCaretDown />
                                                            </div>
                                                        </h6>
                                                    </Button>

                                                    <Menu {...bindMenu(popupState)} >
                                                        <MenuItem onClick={(e) => {
                                                            setTotalOrderDate('today');
                                                            popupState.close()
                                                        }}>Today</MenuItem>

                                                        <MenuItem onClick={(e) => {
                                                            setTotalOrderDate('yesterday');
                                                            popupState.close()
                                                        }}>Yesterday</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalOrderDate('weekly');
                                                            popupState.close()
                                                        }}>Weekly</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalOrderDate('monthly');
                                                            popupState.close()
                                                        }}>Monthly</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalOrderDate('all');
                                                            popupState.close()
                                                        }}>All Order</MenuItem>

                                                    </Menu>
                                                </>
                                            )}
                                        </PopupState>
                                    </div>

                                </div>

                                <div className="middle">
                                    <h3>
                                        {reportData?.total}
                                    </h3>

                                </div>
                            </div>
                        </Grid>

                        {/* Total Confirmed Order */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="TotalOrderItem boxShadow commonCart cart-2">

                                {/* header */}
                                <div className="header d_flex d_justify">
                                    <h4><i className="flaticon-stock-market-1"></i> Total Confirmed Order</h4>

                                    <div className="DropDown">
                                        <PopupState variant="popover" popupId="DropDown">
                                            {(popupState) => (
                                                <>
                                                    <Button {...bindTrigger(popupState)}>
                                                        <h6 className="d_flex">
                                                            {confirmed_date}
                                                            <div className="svg">
                                                                <AiFillCaretDown />
                                                            </div>
                                                        </h6>
                                                    </Button>

                                                    <Menu {...bindMenu(popupState)} >
                                                        <MenuItem onClick={(e) => {
                                                            setTotalConfirmedDate('today');
                                                            popupState.close()
                                                        }}>Today</MenuItem>

                                                        <MenuItem onClick={(e) => {
                                                            setTotalConfirmedDate('yesterday');
                                                            popupState.close()
                                                        }}>Yesterday</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalConfirmedDate('weekly');
                                                            popupState.close()
                                                        }}>Weekly</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalConfirmedDate('monthly');
                                                            popupState.close()
                                                        }}>Monthly</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalConfirmedDate('all');
                                                            popupState.close()
                                                        }}>All Order</MenuItem>

                                                    </Menu>
                                                </>
                                            )}
                                        </PopupState>
                                    </div>
                                </div>

                                <div className="middle">
                                    <h3>
                                        {reportData?.confirmed}
                                    </h3>

                                </div>
                            </div>
                        </Grid>

                        {/* Total Sale Amount */}
                        <Grid item xs={12} sm={6} md={4}>

                            <div className="TotalOrderItem boxShadow commonCart cart-3">

                                {/* header */}
                                <div className="header d_flex d_justify">
                                    <h4><i className="flaticon-stock-market-1"></i> Total Sales Amount</h4>

                                    <div className="DropDown">
                                        <PopupState variant="popover" popupId="DropDown">
                                            {(popupState) => (
                                                <>
                                                    <Button {...bindTrigger(popupState)}>
                                                        <h6 className="d_flex">
                                                            {sales_date}
                                                            <div className="svg">
                                                                <AiFillCaretDown />
                                                            </div>
                                                        </h6>
                                                    </Button>

                                                    <Menu {...bindMenu(popupState)} >
                                                        <MenuItem onClick={(e) => {
                                                            setTotalSalesDate('today');
                                                            popupState.close()
                                                        }}>Today</MenuItem>

                                                        <MenuItem onClick={(e) => {
                                                            setTotalSalesDate('yesterday');
                                                            popupState.close()
                                                        }}>Yesterday</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalSalesDate('weekly');
                                                            popupState.close()
                                                        }}>Weekly</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalSalesDate('monthly');
                                                            popupState.close()
                                                        }}>Monthly</MenuItem>
                                                        <MenuItem onClick={(e) => {
                                                            setTotalSalesDate('all');
                                                            popupState.close()
                                                        }}>All Order</MenuItem>

                                                    </Menu>
                                                </>
                                            )}
                                        </PopupState>
                                    </div>
                                </div>

                                <div className="middle">
                                    <h3>
                                        {reportData?.sales}
                                    </h3>

                                </div>
                            </div>

                        </Grid>

                        {/* Total Available Courier Balance */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="TotalOrderItem boxShadow commonCart cart-4">

                                {/* header */}
                                <div className="Header d_flex d_justify">
                                    <h4><i className="flaticon-stock-market-1"></i> Total Available Courier Balance</h4>
                                </div>

                                <div className="middle">
                                    <h3>
                                        {busInfo?.courier_balance}
                                    </h3>
                                </div>
                            </div>
                        </Grid>

                        {/* Total Order */}
                        <Grid item xs={12} sm={6} md={4}>
                            <DeliveryReport />
                        </Grid>

                        {/* Total Order */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="SalesTarget TotalOrderItem boxShadow commonCart cart-1">
                                {/* header */}
                                <div className="header d_flex d_justify">
                                    <h4><i className="flaticon-stock-market-1"></i> Sales Target</h4>
                                </div>

                                <ul className="SalesTargetDailyTarget">
                                    <li>
                                        Daily
                                        - <span>{salesTarget?.amounts?.daily_total ? salesTarget?.amounts?.daily_total?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '৳' : "00" + '৳'} / {Object.keys(salesTarget).length > 0 ? salesTarget.daily?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '৳' : "00" + '৳'}</span>
                                        <span
                                            style={{ backgroundColor: colorCheck(parseInt(salesTarget?.daily_completed)) }}> {salesTarget?.daily_completed ? salesTarget?.daily_completed : "00.00"}% </span>
                                    </li>
                                    <li>
                                        Monthly
                                        - <span>{salesTarget?.amounts?.monthly_total ? salesTarget?.amounts?.monthly_total?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '৳' : "00" + '৳'} / {Object.keys(salesTarget).length > 0 ? salesTarget.monthly?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '৳' : "00" + '৳'}</span>

                                        <span
                                            style={{ backgroundColor: colorCheck(parseInt(salesTarget?.monthly_completed)) }}>{salesTarget?.monthly_completed ? salesTarget?.monthly_completed : "00.00"}% </span>
                                    </li>
                                    <li>
                                        Custom
                                        - <span>{salesTarget?.amounts?.custom_total ? salesTarget?.amounts?.custom_total?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '৳' : "00" + '৳'}/{Object.keys(salesTarget).length > 0 ? salesTarget.custom?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '৳' : "00" + '৳'}</span>
                                        <span
                                            style={{ backgroundColor: colorCheck(parseInt(salesTarget?.custom_completed)) }}> {salesTarget?.custom_completed ? salesTarget?.custom_completed : "00.00"}% </span>
                                    </li>

                                    <li>
                                        {
                                            salesTarget?.from_date && <strong>({salesTarget?.from_date ? moment(salesTarget?.from_date).format("DD-MM-YYYY") : ""} - {salesTarget?.to_date ? moment(salesTarget?.to_date).format("DD-MM-YYYY") : ""}) </strong>
                                        }

                                    </li>
                                </ul>

                                <div className="Main">

                                    <div className="duelButton">

                                        <Button onClick={handleOpenSales}>Update Sales Target</Button>
                                    </div>

                                    {/* modal */}
                                    <Modal
                                        open={openSales}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        className='updateModal'
                                    >
                                        <Box className='modalBox'>
                                            <div className="modalContent">

                                                <div className='header'>
                                                    <div className='left'>
                                                        <i className="flaticon-edit"></i>
                                                        <h4>Update Sales Target in BDT</h4>
                                                    </div>

                                                    <div className='right' onClick={handleCloseSales}>
                                                        <i className="flaticon-close-1"></i>
                                                    </div>

                                                </div>

                                                <div className="Form">
                                                    <form onSubmit={handleSubmit(onSubmit)}>

                                                        <div className="customInput">
                                                            <label>Enter Daily Sales Target <span>*</span></label>
                                                            <input type="text" defaultValue={salesTarget?.daily} {...register("daily")} />
                                                            {errors.daily && (
                                                                <p className="error">This field is required</p>
                                                            )}
                                                        </div>

                                                        <div className="customInput">
                                                            <label>Enter Monthly Sales Target <span>*</span></label>
                                                            <input type="text" defaultValue={salesTarget?.monthly} {...register("monthly")} />
                                                            {errors.weekly && (
                                                                <p className="error">This field is required</p>
                                                            )}
                                                        </div>

                                                        <div className="customInput">
                                                            <label>Enter Custom Sales Target <span>*</span></label>
                                                            <input type="text" defaultValue={salesTarget?.custom} {...register("custom")} />
                                                            {errors.custom && (
                                                                <p className="error">This field is required</p>
                                                            )}
                                                        </div>

                                                        <div className="customInput">
                                                            <label>
                                                                Choose Your Custom Targeting Date Range
                                                            </label>

                                                            <div className="d_flex">
                                                                <div className="customInput">
                                                                    <label>From</label>
                                                                    <input
                                                                        defaultValue={salesTarget?.from_date?.slice(0, 10)}  {...register("from_date")}
                                                                        type="date"
                                                                    />
                                                                </div>
                                                                {/* <h1>{salesTarget?.from_date?.slice(0, 10)}</h1> */}

                                                                <div className="customInput">
                                                                    <label>To</label>
                                                                    <input defaultValue={salesTarget?.to_date?.slice(0, 10)} {...register("to_date")}
                                                                        type="date" />
                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div className="duelButton">

                                                            <Button type="submit" className='One'>Save Changes</Button>
                                                            {/* <Button type="reset" className="red">Reset</Button> */}

                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Box>
                                    </Modal>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                </Container>
            </section>
        </>
    );
};

export default TotalOrder;
