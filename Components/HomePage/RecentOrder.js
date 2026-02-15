import React, { useEffect, useState } from 'react';

import { Button, Tooltip } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { headers } from '../../pages/api';

const RecentOrder = () => {
    const [recentOrder, setRecentOrder] = useState([]);



    const handleFetchRecentOrder = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.NEXT_PUBLIC_API_URL}/client/recent-order/count`,
                headers: headers,
            });
            setRecentOrder(data?.data?.data);
        } catch (err) {

        }
    }

    useEffect(() => {
        handleFetchRecentOrder();
    }, [])

   


    return (

        <>

            <div className="RecentOrder boxShadow">

                {/* header */}
                <div className="Header d_flex d_justify">

                    <div className="left">
                        <h4>Recent Order </h4>
                    </div>
                </div>

                {/* RecentOrderBox */}

                <div className="RecentOrderBox">

                    <div className="RecentOrderTitle">

                        {/* title */}
                        <div className="RecentOrderItem">

                            <div className="item">
                                <h5>Order No & Date</h5>
                            </div>

                            <div className="item">
                                <h5>Customer Info</h5>
                            </div>

                            <div className="item">
                                <h5>Product Info</h5>
                            </div>

                            <div className="item">
                                <h5>Total Price</h5>
                            </div>

                            <div className="item">
                                <h5>Status</h5>
                            </div>

                        </div>

                        {/* item */}

                        {recentOrder.length > 0 ? recentOrder.map((order, index) => {
                            return (
                                <div className="RecentOrderItem" key={index}>

                                    <div className="item">
                                        <h6>#{order.order_no}</h6>
                                        <p>{moment(order?.created_at).format('MMMM DD, YYYY')}</p>
                                    </div>

                                    {/* item */}
                                    <div className="item">
                                        <div className="name">
                                            <div className="icon">
                                                <i className="flaticon-user"></i>
                                            </div>
                                            <Tooltip
                                                title={order?.customer_name}
                                                placement="top-start"
                                            >
                                                <span>
                                                    {order?.customer_name?.length <
                                                        12 ? (
                                                        <span>
                                                            {order?.customer_name}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            {order?.customer_name?.slice(
                                                                0,
                                                                13
                                                            )}
                                                            ...
                                                        </span>
                                                    )}
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div className="name">
                                            <div className="icon">
                                                <i className="flaticon-phone-call"></i>
                                            </div>
                                            <Link href={`tel:${order?.phone}`}> {order?.phone}</Link>
                                        </div>
                                    </div>

                                    {/* item */}
                                    <div className="item">
                                        <div className="name">
                                            <Tooltip
                                                title={order?.order_details[0]?.product?.product_name}
                                                placement="top-start"
                                            >
                                                <span>
                                                    {order?.order_details[0]?.product?.length < 15 ? (
                                                        <span>{order?.order_details[0]?.product?.product_name}</span>
                                                    ) : (
                                                        <span>
                                                            {order?.order_details[0]?.product?.product_name.slice(0, 13)}
                                                            ...
                                                        </span>
                                                    )}
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div className="name">                                  
                                            {
                                                order?.order_details?.reduce((prevVal, currentVal) => {
                                                    return prevVal + (currentVal?.product_qty)
                                                }, 0)
                                            }
                                        </div>
                                    </div>

                                    {/* item */}
                                    <div className="item">
                                        <h4> <i className="flaticon-taka"></i> {order?.pricing?.grand_total?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h4>
                                    </div>

                                    {/* item */}
                                    <div className="item">

                                        <div className="Status">

                                            <div className="commonDropdown">

                                                {/* <PopupState variant="popover" popupId="demo-popup-menu">
                                                    {(popupState) => (
                                                        <>
                                                            <Button   {...bindTrigger(popupState)}>
                                                                {order?.order_status}
                                                            </Button>

                                                        </>
                                                    )}
                                                </PopupState> */}

                                                <Button>        {order?.order_status}</Button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )
                        }) : null}





                    </div>


                </div>






            </div>

        </>

    )
}

export default RecentOrder
