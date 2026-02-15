import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import React, { useState } from 'react';

import { BsThreeDotsVertical } from 'react-icons/bs';


const DataTable = () => {

    // Dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <>

            <div className="DataTable">

                {/* DataTableRow */}
                <div className="DataTableRow">

                    <div className="DataTableColum">
                        <h3>SL</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Order No & Date</h3>
                    </div>

                    <div className="DataTableColum Address">
                        <h3>Customer Info</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Product Info</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Discount</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Total Price</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Advanced</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Due</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Status</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Notes</h3>
                    </div>

                    <div className="DataTableColum">
                        <h3>Action</h3>
                    </div>

                </div>

                {/* DataTableRow */}
                {/* item */}
                <div className="DataTableRow">

                    <div className="DataTableColum">
                        <div className="number">1</div>
                    </div>

                    <div className="DataTableColum">
                        <div className="orderColor">#3210</div>
                        <p>2 hours ago</p>
                        <p>Jun 27, 2023</p>
                    </div>

                    <div className="DataTableColum Address">

                        <div className="Name">
                            <div className="icon"> <i className='flaticon-user-1'></i> </div>
                            Safayet Hossain...
                        </div>

                        <div className="Name PhoneNumber">
                            <div className="icon"> <i className="flaticon-phone-call"></i> </div>
                            01854886330
                        </div>

                        <div className="Name">
                            <div className="icon"> <i className="flaticon-location"></i> </div>
                            <p>Dhanmondi 32, Road 12, Dhaka</p>
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Name">Green tea</div>

                        <div className="Price"> <i className='flaticon-taka'></i> 990 </div>

                        <div className="Quantity">Quantity: <span>45</span></div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Discount">
                            <div className="inputTaka"><i className='flaticon-taka'></i></div>
                            <input type="text" placeholder='0' />
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="TotalPrice">
                            <i className='flaticon-taka'></i>
                            5456455
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Discount">
                            <div className="inputTaka"><i className='flaticon-taka'></i></div>
                            <input type="text" placeholder='0' />
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="TotalPrice">
                            <i className='flaticon-taka'></i>
                            5456455
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Status">

                            <div className="commonDropdown">

                                <Button
                                    id="fade-button"
                                    aria-controls={open ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    Status <i className="flaticon-arrow-down-sign-to-navigate"></i>
                                </Button>

                                <Menu
                                    id="fade-menu"
                                    className='commonDropdownUl'
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={handleClose}>Pending</MenuItem>
                                    <MenuItem onClick={handleClose}>Follow Up</MenuItem>
                                    <MenuItem onClick={handleClose}>Confirmed</MenuItem>
                                    <MenuItem onClick={handleClose}>Cancelled</MenuItem>
                                    <MenuItem onClick={handleClose}>Hold On</MenuItem>

                                </Menu>

                            </div>

                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Note">
                            <textarea name="" rows="3" placeholder='Internal Notes...'></textarea>
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Action">

                            <div className="commonDropdown">

                                <PopupState variant="popover" popupId="demo-popup-menu">
                                    {(popupState) => (
                                        <>
                                            <Button {...bindTrigger(popupState)}>
                                                <BsThreeDotsVertical />
                                            </Button>
                                            <Menu {...bindMenu(popupState)}>
                                                <MenuItem onClick={popupState.close}>Pending</MenuItem>
                                                <MenuItem onClick={popupState.close}>Follow Up</MenuItem>
                                                <MenuItem onClick={popupState.close}>Confirm</MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                </PopupState>

                            </div>

                        </div>

                    </div>

                </div>

                {/* item */}
                <div className="DataTableRow">

                    <div className="DataTableColum">
                        <div className="number">1</div>
                    </div>

                    <div className="DataTableColum">
                        <div className="orderColor">#3210</div>
                        <p>2 hours ago</p>
                        <p>Jun 27, 2023</p>
                    </div>

                    <div className="DataTableColum Address">

                        <div className="Name">
                            <div className="icon"> <i className='flaticon-user-1'></i> </div>
                            Safayet Hossain...
                        </div>

                        <div className="Name PhoneNumber">
                            <div className="icon"> <i className="flaticon-phone-call"></i> </div>
                            01854886330
                        </div>

                        <div className="Name">
                            <div className="icon"> <i className="flaticon-location"></i> </div>
                            <p>Dhanmondi 32, Road 12, Dhaka</p>
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Name">Green tea</div>

                        <div className="Price"> <i className='flaticon-taka'></i> 990 </div>

                        <div className="Quantity">Quantity: <span>45</span></div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Discount">
                            <div className="inputTaka"><i className='flaticon-taka'></i></div>
                            <input type="text" placeholder='0' />
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="TotalPrice">
                            <i className='flaticon-taka'></i>
                            5456455
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Discount">
                            <div className="inputTaka"><i className='flaticon-taka'></i></div>
                            <input type="text" placeholder='0' />
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="TotalPrice">
                            <i className='flaticon-taka'></i>
                            5456455
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Status">

                            <div className="commonDropdown">

                                <Button
                                    id="fade-button"
                                    aria-controls={open ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    Status <i className="flaticon-arrow-down-sign-to-navigate"></i>
                                </Button>

                                <Menu
                                    id="fade-menu"
                                    className='commonDropdownUl'
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={handleClose}>Pending</MenuItem>
                                    <MenuItem onClick={handleClose}>Follow Up</MenuItem>
                                    <MenuItem onClick={handleClose}>Confirmed</MenuItem>
                                    <MenuItem onClick={handleClose}>Cancelled</MenuItem>
                                    <MenuItem onClick={handleClose}>Hold On</MenuItem>

                                </Menu>

                            </div>

                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Note">
                            <textarea name="" rows="3" placeholder='Internal Notes...'></textarea>
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Action">

                            <div className="commonDropdown">

                                <PopupState variant="popover" popupId="demo-popup-menu">
                                    {(popupState) => (
                                        <>
                                            <Button {...bindTrigger(popupState)}>
                                                <BsThreeDotsVertical />
                                            </Button>
                                            <Menu {...bindMenu(popupState)}>
                                                <MenuItem onClick={popupState.close}>Pending</MenuItem>
                                                <MenuItem onClick={popupState.close}>Follow Up</MenuItem>
                                                <MenuItem onClick={popupState.close}>Confirm</MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                </PopupState>

                            </div>

                        </div>

                    </div>

                </div>

                {/* item */}
                <div className="DataTableRow">

                    <div className="DataTableColum">
                        <div className="number">1</div>
                    </div>

                    <div className="DataTableColum">
                        <div className="orderColor">#3210</div>
                        <p>2 hours ago</p>
                        <p>Jun 27, 2023</p>
                    </div>

                    <div className="DataTableColum Address">

                        <div className="Name">
                            <div className="icon"> <i className='flaticon-user-1'></i> </div>
                            Safayet Hossain...
                        </div>

                        <div className="Name PhoneNumber">
                            <div className="icon"> <i className="flaticon-phone-call"></i> </div>
                            01854886330
                        </div>

                        <div className="Name">
                            <div className="icon"> <i className="flaticon-location"></i> </div>
                            <p>Dhanmondi 32, Road 12, Dhaka</p>
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Name">Green tea</div>

                        <div className="Price"> <i className='flaticon-taka'></i> 990 </div>

                        <div className="Quantity">Quantity: <span>45</span></div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Discount">
                            <div className="inputTaka"><i className='flaticon-taka'></i></div>
                            <input type="text" placeholder='0' />
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="TotalPrice">
                            <i className='flaticon-taka'></i>
                            5456455
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Discount">
                            <div className="inputTaka"><i className='flaticon-taka'></i></div>
                            <input type="text" placeholder='0' />
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="TotalPrice">
                            <i className='flaticon-taka'></i>
                            5456455
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Status">

                            <div className="commonDropdown">

                                <Button
                                    id="fade-button"
                                    aria-controls={open ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    Status <i className="flaticon-arrow-down-sign-to-navigate"></i>
                                </Button>

                                <Menu
                                    id="fade-menu"
                                    className='commonDropdownUl'
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={handleClose}>Pending</MenuItem>
                                    <MenuItem onClick={handleClose}>Follow Up</MenuItem>
                                    <MenuItem onClick={handleClose}>Confirmed</MenuItem>
                                    <MenuItem onClick={handleClose}>Cancelled</MenuItem>
                                    <MenuItem onClick={handleClose}>Hold On</MenuItem>

                                </Menu>

                            </div>

                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Note">
                            <textarea name="" rows="3" placeholder='Internal Notes...'></textarea>
                        </div>

                    </div>

                    <div className="DataTableColum">

                        <div className="Action">

                            <div className="commonDropdown">

                                <PopupState variant="popover" popupId="demo-popup-menu">
                                    {(popupState) => (
                                        <>
                                            <Button {...bindTrigger(popupState)}>
                                                <BsThreeDotsVertical />
                                            </Button>
                                            <Menu {...bindMenu(popupState)}>
                                                <MenuItem onClick={popupState.close}>Pending</MenuItem>
                                                <MenuItem onClick={popupState.close}>Follow Up</MenuItem>
                                                <MenuItem onClick={popupState.close}>Confirm</MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                </PopupState>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    )
}

export default DataTable