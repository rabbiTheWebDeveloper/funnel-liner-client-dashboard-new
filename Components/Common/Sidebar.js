import { Badge, Collapse, List, ListItemButton, Skeleton } from "@mui/material";
import Link from "next/link";
import { useRouter } from 'next/router';
import React from "react";
import { AiOutlineFileDone, AiOutlineHome, AiOutlineShoppingCart, AiOutlineStock } from "react-icons/ai";
import { BiMessageRoundedDots, BiSupport } from "react-icons/bi";
import { BsPlug, BsShop } from "react-icons/bs";
import { FaCalculator, FaLaptopCode, FaRegMoneyBillAlt } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { GiWorld } from "react-icons/gi";
import { HiCurrencyDollar } from "react-icons/hi";
import { RiTeamLine } from "react-icons/ri";
import { TbTemplateOff, TbTruckDelivery } from "react-icons/tb";
import { shopId } from "../../pages/api";

const Sidebar = ({ busInfo, myAddonsList, pendingOrderCount }) => {
    const router = useRouter();
    const [openCategory, setOpenCategory] = React.useState(false);
    const [openStock, setOpenStock] = React.useState(false);
    const [openTemplate, setOpenTemplate] = React.useState(false);
    const [openMyTemplate, setOpenMyTemplate] = React.useState(false);
    const [openAccountDashboard, setHandleAccountDashboard] = React.useState(false);


    // handleCategory
    const handleCategory = () => {
        setOpenCategory(!openCategory);
    };

    // handleStock
    const handleStock = () => {
        setOpenStock(!openStock);
    };

    // handleTemplate
    const handleTemplate = () => {
        setOpenTemplate(!openTemplate);
    };
    // handleTemplate
    const handleMyTemplate = () => {
        setOpenMyTemplate(!openMyTemplate);
    };

    // handleTemplate
    const handleAccountDashboard = () => {
        setHandleAccountDashboard(!openAccountDashboard);
    };



    return (
        <>
            <section className='Sidebar'>
                {/* logo */}
                <div className='Logo'>
                    <Link href='/'>
                        <img src='/images/funnel-liner-logo-beta.png' alt='' />
                    </Link>
                </div>

                {/* Shop */}
                <div className='Shop'>
                    <Link href='/'>
                        {
                            busInfo?.shop_logo ? <img src={busInfo?.shop_logo} alt='' /> : <BsShop />
                        }                     
                    </Link>
                    <h4>{busInfo?.name}</h4>
                    <p>ID: {shopId}</p>
                </div>

                <div className='MenuItemContent'>
                    {/* Dashboard */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href='/'
                                className={router.pathname === "/" ? "active" : ""}
                            // className={props.active == "dashboard" && "active"}
                            >

                                <AiOutlineHome /> Dashboard
                            </Link>
                        </ListItemButton>
                    </div>

                    {/* Orders */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href={"/order"}
                                className={router.pathname === "/order" ? "active" : ""}
                            >
                                <AiOutlineFileDone /> Orders
                                <Badge badgeContent={pendingOrderCount.pending > 0 ? pendingOrderCount.pending : '0'} color="primary" style={{ marginRight: '10px', marginTop: 0 }} />
                            </Link>

                        </ListItemButton>
                    </div>

                    {/* Products */}
                    <div className='MenuItem'>

                        <ListItemButton onClick={() => handleCategory(true)}>
                            <h6
                            //  className={props.active == "product" && "active"}

                            >

                                <AiOutlineShoppingCart /> Products
                                <span>
                                    <FiChevronDown />
                                </span>

                            </h6>
                        </ListItemButton>

                        <Collapse in={openCategory} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/product" ? "active" : ""} href={"/product"}>Product</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/category-list" ? "active" : ""} href={'/category-list'}>Category</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/sub-category-list" ? "active" : ""} href={'/sub-category-list'}>Sub Category</Link>
                            </List>
                        </Collapse>

                    </div>

                    {/* Orders */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href={'/courier'}
                                className={router.pathname === "/courier" ? "active" : ""}
                            >

                                <TbTruckDelivery /> Courier
                            </Link>
                        </ListItemButton>
                    </div>

                    {/* Stock */}
                    <div className='MenuItem'>
                        <ListItemButton onClick={() => handleStock(true)}>
                            <h6

                            >

                                <AiOutlineStock /> Stock
                                <span>
                                    <FiChevronDown />
                                </span>
                            </h6>
                        </ListItemButton>

                        <Collapse in={openStock} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                <Link href={'/inventory'} className={router.pathname === "/inventory" ? "active" : ""}>Inventory</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/stockin" ? "active" : ""} href={'/stockin'}>Stock In</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/product-return" ? "active" : ""} href={'/product-return'}>Product Return</Link>
                            </List>
                        </Collapse>
                    </div>

                    {/* Bulk SMS */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href={'/bulk-sms'} className={router.pathname === "/bulk-sms" ? "active" : ""}
                            >

                                <BiMessageRoundedDots /> Bulk SMS
                            </Link>
                        </ListItemButton>
                    </div>

                    {/* Support Ticket */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href={'/support-ticket'}
                                className={router.pathname === "/support-ticket" ? "active" : ""}
                            >


                                <BiSupport />
                                Support Ticket
                            </Link>
                        </ListItemButton>
                    </div>

                    {/* Customers */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href={'/customer-list'}
                                // className={props.active == "customar" && "active"}
                                className={router.pathname === "/customer-list" ? "active" : ""}
                            >

                                <RiTeamLine /> Customers
                            </Link>
                        </ListItemButton>
                    </div>

                    {/* Templates */}
                    <div className='MenuItem'>
                        <ListItemButton onClick={() => handleTemplate(true)}>
                            <h6
                            >

                                <TbTemplateOff />
                                Templates
                                <span>
                                    <FiChevronDown />
                                </span>
                            </h6>
                        </ListItemButton>

                        <Collapse in={openTemplate} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                <Link href={'/landing-page'}

                                    className={router.pathname === "/landing-page" ? "active" : ""}
                                >Landing Page Website</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link href={'/multi-page'}

                                    className={router.pathname === "/multi-page" ? "active" : ""}
                                >Multi Page Website</Link>
                            </List>
                        </Collapse>
                    </div>

                    {/* My Page */}
                    <div className='MenuItem'>
                        <ListItemButton onClick={() => handleMyTemplate(true)}>
                            <h6

                            >

                                <FaLaptopCode /> My Page
                                <span>
                                    <FiChevronDown />
                                </span>
                            </h6>
                        </ListItemButton>

                        <Collapse in={openMyTemplate} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/myLandingPage" ? "active" : ""} href={'/myLandingPage'}>Landing Page Website</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/myMultiWebsite" ? " active" : ""} href={'/myMultiWebsite'}>Multi Page Website</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/web-pages" ? "active" : ""} href={'/web-pages'}>Pages</Link>
                            </List>


                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/home-slider" ? "active" : ""} href={'/home-slider'}>All Slider</Link>
                            </List>
                            {/* <List component='div' disablePadding>
                                <Link className={router.pathname === "/banner" ? "active" : ""} href={'/banner'}>Banner</Link>
                            </List> */}

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/about-us" ? "active" : ""} href={'/about-us'}>About us</Link>
                            </List>


                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/terms-and-condition" ? "active" : ""} href={'/terms-and-condition'}>Terms and Condition</Link>
                            </List>

                            <List component='div' disablePadding>
                                <Link className={router.pathname === "/privacy-policy" ? "active" : ""} href={'/privacy-policy'}>Privacy and policy</Link>
                            </List>

                        </Collapse>
                    </div>

                    {/* Website Setting */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href={'/website-setting'}
                                className={router.pathname === "/website-setting" ? "active" : ""}
                            >

                                <GiWorld /> Website Settings
                            </Link>
                        </ListItemButton>
                    </div>

                    {/* Plugins */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link
                                href={'/plug-in'}

                                className={router.pathname === "/plug-in" ? "active" : ""}
                            >

                                <BsPlug /> Addons
                            </Link>
                        </ListItemButton>
                    </div>
                    {Array.isArray(myAddonsList) ? myAddonsList?.map((addon, index) => {
                        return (
                            addon?.addons_details?.id === 17 && addon?.addons_details?.status === 1 &&
                            <div className='MenuItem'>
                                <ListItemButton>
                                    <Link href={'/bkash-marcent'} className={router.pathname === "/bkash-marcent" ? "active" : ""}>
                                        <img src="/images/bkash-marcent.png" alt="" /> Bkash Merchant
                                    </Link>
                                </ListItemButton>
                            </div>

                        )
                    })
                        :
                        null}




                    {
                        Array.isArray(myAddonsList) ? myAddonsList?.map((addon, index) => {
                            return (
                                addon?.addons_id === 16 && addon?.status === 1 &&

                                <div className='MenuItem'>
                                    <ListItemButton onClick={() => handleAccountDashboard(true)}>
                                        <h6>
                                            <FaCalculator />  Accounting Modules
                                            <span>
                                                <FiChevronDown />
                                            </span>
                                        </h6>
                                    </ListItemButton>

                                    <Collapse in={openAccountDashboard} timeout='auto' unmountOnExit>
                                        <List component='div' disablePadding>
                                            <Link href={'/account-dashboard'}

                                                className={router.pathname === "/account-dashboard" ? "active" : ""}
                                            > Dashboard</Link>
                                        </List>

                                        <List component='div' disablePadding>
                                            <Link href={'/account-report'}

                                                className={router.pathname === "/account-report" ? "active" : ""}
                                            > Report</Link>
                                        </List>
                                    </Collapse>
                                </div>
                                // <div className='MenuItem'>
                                //     <ListItemButton>
                                //         <Link href={payrouter()} className={router.pathname === "/accounting-modules" ? "active" : ""}>
                                //             <FaCalculator />  Accounting Modules
                                //         </Link>
                                //     </ListItemButton>
                                // </div>

                            )
                        })
                            :
                            null
                    }

                    {/* Bkash Merchant Account */}
                    {/* <div className='MenuItem'>
                        <ListItemButton>
                            <Link href={'/bkash-marcent'} className={router.pathname === "/bkash-marcent" ? "active" : ""}>
                                <img src="/images/bkash-marcent.png" alt="" /> Bkash Merchant
                            </Link>
                        </ListItemButton>
                    </div> */}

                    {/* Bkash Merchant Account */}
                    {/* <div className='MenuItem'>
                        <ListItemButton>
                            <Link  href={payrouter()} className={router.pathname === "/accounting-modules" ? "active" : ""}>
                                <FaCalculator />  Accounting Modules
                            </Link>
                        </ListItemButton>
                    </div> */}

                    {/* Offers */}
                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link href={"/subscription"}

                                className={router.pathname === "/subscription" ? "active" : ""}
                            >

                                <HiCurrencyDollar /> Subscription
                            </Link>
                        </ListItemButton>
                    </div>

                    <div className='MenuItem'>
                        <ListItemButton>
                            <Link href={"/billing"}

                                className={router.pathname === "/billing" ? "active" : ""}
                            >

                                <FaRegMoneyBillAlt /> Billing
                            </Link>
                        </ListItemButton>
                    </div>


                </div>

            </section>
        </>
    );
};

export default Sidebar;

