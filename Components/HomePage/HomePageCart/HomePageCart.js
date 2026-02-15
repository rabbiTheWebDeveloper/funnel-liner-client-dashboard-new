import { Box, Button, Fade, Menu, MenuItem, Modal } from '@mui/material';
import axios from 'axios';
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import moment from 'moment';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useToast } from '../../../hook/useToast';
import { headers } from '../../../pages/api';
import { colorCheck, filterOrder } from '../HomeUtlis';
import CustomDate from './CustomDate';
import SearchIcon from '../../OrderPage/SearchIcon';
import searchAnimation from "../../../public/search.gif";

const HomePageCart = ({ data,loading, setFetchData, startDate, setStartDate, endDate, setEndDate, title, salesTargetRfatch, listItem2, filter, salesTarget, number, increase, cartIcon, increaseTitle, decrease, decreaseTitle, cartImg, listItem, deliveryCount, deliveryReturnCount, returnRatioCount, openSale }) => {
    const showToast = useToast();
    const [anchorEl, setAnchorEl] = React.useState(null);
    ;
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    // 
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);

    const onSubmit = (data) => {
        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/sales-target/update", data, {
            headers: headers,
        })
            .then(function (response) {
                salesTargetRfatch()
                showToast('Sales Target update successfully!', 'success');
            })
            .catch(function (error) {

            });
        reset();
        setOpenSales(false);
    };




    return (

        <>

            <div className="HomePageCart boxShadow">

                {/* Header */}
                <div className="Header d_flex d_justify">

                    <div className="left">
                        <h4>{title}</h4>
                    </div>

                    <div className="right">
                        {
                            filter !== true &&
                            <div className="d_flex">
                                <div>
                                    {data === 'custom' && (
                                        <CustomDate setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} ></CustomDate>
                                    )
                                    }
                                </div>

                                <div className="commonDropdown DropDown">

                                    <PopupState variant="popover" popupId="DropDown">
                                        {(popupState) => (
                                            <>
                                                <Button {...bindTrigger(popupState)}>
                                                    {filterOrder(data)} <i className="flaticon-arrow-down-sign-to-navigate"></i>
                                                </Button>

                                                <Menu id="fade-menu"
                                                    className='commonDropdownUl'
                                                    MenuListProps={{
                                                        'aria-labelledby': 'fade-button',
                                                    }}
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    TransitionComponent={Fade} {...bindMenu(popupState)} >
                                                    <MenuItem onClick={(e) => {
                                                        setFetchData('today');
                                                        popupState.close()
                                                    }}>Today</MenuItem>

                                                    <MenuItem onClick={(e) => {
                                                        setFetchData('yesterday');
                                                        popupState.close()
                                                    }}>Yesterday</MenuItem>
                                                    <MenuItem onClick={(e) => {
                                                        setFetchData('weekly');
                                                        popupState.close()
                                                    }}>Weekly</MenuItem>
                                                    <MenuItem onClick={(e) => {
                                                        setFetchData('monthly');
                                                        popupState.close()
                                                    }}>Monthly</MenuItem>
                                                    <MenuItem onClick={(e) => {
                                                        setFetchData('all');
                                                        popupState.close()
                                                    }}>Life Time</MenuItem>
                                                    <MenuItem onClick={(e) => {
                                                        setFetchData('custom');
                                                        popupState.close()
                                                    }}>Custom</MenuItem>

                                                </Menu>
                                            </>
                                        )}
                                    </PopupState>
                                </div>

                            </div>




                        }

                    </div>

                </div>

                {/* Middle */}
                <div className="Middle">
                    <h3>{
                   loading ?   <Image
                   src={searchAnimation}
                   alt="Search Animation"
                   width={40}
                   height={40}
                 />: number}</h3>
                    <ul className='ListItem'>
                        {
                            listItem == true &&
                            <>
                                <li>Delivery : <span> {deliveryCount} </span></li>
                                <li>Return : <span> {deliveryReturnCount} </span></li>
                                <li>Return Ratio : <span> {returnRatioCount} %</span></li>

                            </>
                        }
                        {
                            listItem2 == true &&
                            <>
                                {/* <li>Daily - 00৳ / 00৳ :<span> {deliveryCount} </span></li>
                                <li>Monthly - 00৳ / 00৳ :<span> {deliveryReturnCount} </span></li>
                                <li>Custom - 00৳/00৳ : 0.00%  <span> {returnRatioCount} %</span></li> */}

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
                                        salesTarget?.from_date && <span>({salesTarget?.from_date ? moment(salesTarget?.from_date).format("DD-MM-YYYY") : ""} - {salesTarget?.to_date ? moment(salesTarget?.to_date).format("DD-MM-YYYY") : ""}) </span>
                                    }

                                </li>
                            </>
                        }

                    </ul>
                </div>

                {/* Footer */}
                <div className="Footer">
                    <h6 className={ data !== 'custom' && increase}> {data !== 'custom' && increaseTitle} <i className={ data !== 'custom' && cartIcon}></i> </h6>
                </div>

                {/* img */}
                <div className="img">
                    <Image src={cartImg} width={55} height={55} alt="" />
                </div>


                {
                    openSale == true &&
                    <div className="duelButton">
                        <Button onClick={handleOpenSales}>Update Sales Target</Button>
                    </div>
                }

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

                                        {/* <Button type="reset" className="red">Reset</Button> */}
                                        <Button type="submit" className='One'>Save Changes</Button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </Box>
                </Modal>

            </div>

        </>

    )
}

export default HomePageCart
