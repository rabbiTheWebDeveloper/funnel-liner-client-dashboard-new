import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import { headers } from '../../../pages/api';
import style from './style.module.css';



const ShortNotification = ({ popupState, handleDropdownChange, id, notifyFac, handelNotify, setCountNotify, data, unread }) => {

   

    const notification = () => {
        const orderBody = {
            notify_id: id,
            type: "order"
        }
        axios.post(process.env.NEXT_PUBLIC_API_URL + `/client/notifications-read`, orderBody, {
            headers: headers,
        })
            .then(function (res) {
                handelNotify()
                // setData(res.data.data)
            })
            .catch((error) => {

            });

        // setNotifyfac(false)
    }

    let newDataList = data.slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);

    return (
        <div
            className={style.NotificationList}
            onClick={() =>
              {  handleDropdownChange("1", popupState) ; notification}
            }
        >
            <div className={style.header} onClick={notification}>
                <h4> Notifications </h4>
                <p>You have {unread()} unread messages</p>
            </div>

            <h5>New</h5>

            <ul className={style.NotificationUl}>


                {
                    Array.isArray(newDataList)
                        ? newDataList.map((item, key) => {
                            return (
                                <li>
                                    <div className={style.left}>
                                        <div className={style.img}>
                                            <i className="flaticon-notification"></i>
                                        </div>
                                        <div className={style.text}>
                                            <h6>
                                                {item?.data?.message}
                                                {/* Order No: 123456 Has Shipped To... */}
                                            </h6>
                                            <p>{item?.data?.order_time}</p>
                                            {
                                                item?.read != null && <p>Seen :
                                                    {item?.read?.slice(0, 10) >=
                                                        today
                                                        ? moment(
                                                            item?.read
                                                        ).fromNow()
                                                        : moment(item?.read).format(
                                                            "DD-MM-YYYY"
                                                        )}
                                                </p>
                                            }

                                        </div>
                                    </div>
                                    {/* <div className="right">
                                    <i className="flaticon-close"></i>
                                </div> */}
                                </li>

                            )
                        }) :
                        <li>
                            <div className={style.left}>
                                {/* <div className="img">
                            <i className="flaticon-notification"></i>
                        </div> */}
                                <div className={style.text}>
                                    <h6>
                                        Empty notification
                                        {/* Order No: 123456 Has Shipped To... */}
                                    </h6>
                                    {/* <p>29 July 2020 - 02:26 PM</p> */}
                                </div>
                            </div>
                            {/* <div className="right">
                        <i className="flaticon-close"></i>
                    </div> */}
                        </li>
                }


                {/* <li>
                    <div className="left">
                        <div className="img">
                            <img src="/images/product5.png" alt="" />
                        </div>
                        <div className="text">
                            <h6>
                                Order No: 123456 Has Shipped To...
                            </h6>
                            <p>29 July 2020 - 02:26 PM</p>
                        </div>
                    </div>
                    <div className="right">
                        <i className="flaticon-close"></i>
                    </div>
                </li>

                <li>
                    <div className="left">
                        <div className="img">
                            <img src="/images/product5.png" alt="" />
                        </div>
                        <div className="text">
                            <h6>
                                Order No: 123456 Has Shipped To...
                            </h6>
                            <p>29 July 2020 - 02:26 PM</p>
                        </div>
                    </div>
                    <div className="right">
                        <i className="flaticon-close"></i>
                    </div>
                </li>

                <li>
                    <div className="left">
                        <div className="img">
                            <img src="/images/product5.png" alt="" />
                        </div>
                        <div className="text">
                            <h6>
                                Order No: 123456 Has Shipped To...
                            </h6>
                            <p>29 July 2020 - 02:26 PM</p>
                        </div>
                    </div>
                    <div className="right">
                        <i className="flaticon-close"></i>
                    </div>
                </li> */}
            </ul>

            <Link href="/notification" className={style.AllShow} onClick={notification}>
                See all notifications
            </Link>
        </div>
    );
};

export default ShortNotification;