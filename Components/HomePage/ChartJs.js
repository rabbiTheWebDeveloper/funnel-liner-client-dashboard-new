import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect, useState } from 'react';
import SuperFetch from '../../hook/Axios';
import { headers } from '../../pages/api';
import ChartDesign from './ChartDesign';
import { filterOverview } from './HomeUtlis';

const ChartJs = () => {
    const [overview_data, setOverview_data] = useState('week');
    const [reportData, setReportData] = useState([])

    // Dropdown
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const chart_data = {
        "chart-status": overview_data
    }
    useEffect(() => {
        SuperFetch.post('/client/chart/statistics', chart_data, { headers: headers }).then(res => {
            setReportData(res.data.data)
        }).catch(error => {
        })
    }, [overview_data])


  
    return (

        <>

            <div className="ChartJs boxShadow">

                {/* header */}
                <div className="Header d_flex d_justify">

                    <div className="left">
                        <h4>Sales Performance </h4>
                    </div>

                    <div className="right">

                        <div className="commonDropdown">

                            <PopupState variant="popover" popupId="DropDown">
                                {(popupState) => (
                                    <>
                                        <Button id="fade-button"
                                            aria-controls={open ? 'fade-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick} {...bindTrigger(popupState)}>

                                            {filterOverview(overview_data)} <i className="flaticon-arrow-down-sign-to-navigate"></i>

                                        </Button>

                                        <Menu id="fade-menu"
                                            className='commonDropdownUl'
                                            MenuListProps={{
                                                'aria-labelledby': 'fade-button',
                                            }}
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose} {...bindMenu(popupState)} >
                                            <MenuItem onClick={(e) => {
                                                setOverview_data('today');
                                                popupState.close()
                                            }}>Today</MenuItem>
                                             <MenuItem onClick={(e) => {
                                                setOverview_data('yesterday');
                                                popupState.close()
                                            }}>Yesterday</MenuItem>
                                            <MenuItem onClick={(e) => {
                                                setOverview_data('week');
                                                popupState.close()
                                            }}>Last Weekly</MenuItem>
                                            <MenuItem onClick={(e) => {
                                                setOverview_data('month');
                                                popupState.close()
                                            }}>Last 30th days</MenuItem>
                                            <MenuItem onClick={(e) => {
                                                setOverview_data('year');
                                                popupState.close()
                                            }}>Yearly</MenuItem>

                                        </Menu>
                                    </>
                                )}
                            </PopupState>
                        </div>

                    </div>

                </div>

                {/*  */}
                <div>
                    <ChartDesign data={reportData}></ChartDesign>
                </div>

            </div>

        </>

    )
}

export default ChartJs
