import { Button, Menu, MenuItem } from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";

import SuperFetch from "../../hook/Axios";
import { headers } from "../../pages/api";


const DeliveryReport = () => {
    const [date, setDate] = useState('today')
    const [report, setReport] = useState({})
    const params = {
        date: date
    }
    useEffect(() => {
        SuperFetch.get('/client/order-delivery-report', { params: params, headers: headers }).then((res) => {
            setReport(res.data?.data)
        })
    }, [date])

    
    

    return (
        <div className="SalesTarget TotalOrderItem boxShadow commonCart cart-5">
            {/* header */}
            <div className="header d_flex d_justify">
                <h4><i className="flaticon-stock-market-1"></i>Delivery Report</h4>

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

                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={(e) => {
                                        setDate('today')
                                    }}>Today</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        setDate('yesterday')
                                    }}>Yesterday</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        setDate('weekly')
                                    }}>Weekly</MenuItem>

                                    <MenuItem onClick={(e) => {
                                        setDate('monthly')
                                    }}>Monthly</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        setDate('all')
                                    }}>All</MenuItem>
                                </Menu>
                            </>
                        )}
                    </PopupState>
                </div>
            </div>

            <ul className="SalesTargetDailyTarget CancleOrder">
                <li>
                    Delivery : <span>{report.delivered}</span>
                </li>
                <li>
                    Return : <span>{report.returned}</span>
                </li>
                <li>
                    Return Ratio : <span>{report.returned_ratio}%</span>
                </li>
            </ul>
        </div>


    );
};

export default DeliveryReport;