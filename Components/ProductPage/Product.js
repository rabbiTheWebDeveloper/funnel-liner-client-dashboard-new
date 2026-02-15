import { Box, Button, Container, Pagination, Stack } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import useConfirmationDialog from "../../hook/useConfirmationDialog";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";
import ProductUpdate from "./ProductUpdate";
import ShowProduct from "./ShowProduct";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";

const Product = ({ category }) => {
    //confirmation alert
    const handleConfirmationDialog = useConfirmationDialog(
        'Delete Product?',
        "Are you sure you want to delete?",
        "yes"
    )
    //delete success hooks
    const showToast = useToast();

    const [age, setAge] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    // handleClick Move To Completed
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // handleConfirmed
    const [anchorEl2, setAnchorEl2] = useState(null);
    const open2 = Boolean(anchorEl2);
    const handleConfirmed = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleCloseConfirmed = () => {
        setAnchorEl2(null);
    };

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/client/products", { headers: headers })
            .then(function (response) {
                // handle success
                setProducts(response.data.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                if (error.response.data.api_status === "401") {
                    window.location.href = "/login"
                    Cookies.remove("token");
                    localStorage.clear("token");
                    Cookies.remove("user");
                    localStorage.clear("user");

                    window.location.href = "/login"
                }
            });
    }, []);


    const deleteProduct = async (id) => {
        const confirmed = await handleConfirmationDialog();
        if (confirmed) {
            axios
                .delete(process.env.NEXT_PUBLIC_API_URL + "/client/products/" + id, { headers: headers })
                .then(function (result) {
                    if (result.data.success) {
                        setProducts((pd) => {
                            const filter = products.filter((prod) => {
                                return prod.id !== id;
                            });
                            return [...filter];
                        });
                        showToast('Product delete successfully!', 'success')
                    } else {
                        showToast('Something went wrong!', 'error')
                    }
                });
        }

    };

    const indexOfLastProducts = currentPage * perPage;
    const indexOfFirstProducts = indexOfLastProducts - perPage;
    const currentProduct = products.slice(
        indexOfFirstProducts,
        indexOfLastProducts
    );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / perPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber, value) => setCurrentPage(value);
    const [productSearchValue, setProductSearchValue] = useState("")
    const [filterProducts, setFilterProducts] = useState([])
    const handleChangeSearchBox = (e) => {
        setProductSearchValue(e.target.value)
        const filtered = products.filter(item => item?.id?.toString().includes(e.target.value) || item?.product_name?.toLowerCase().includes(e.target.value.toLowerCase()) || item?.product_code?.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilterProducts(filtered)
    }
    return (
        <>
            <section className="TopSellingProducts DashboardSetting Order">

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-product'} title={'Product List'} subTitle={'Find Your Product'} search={false}  order={false} />

                <Container maxWidth="sm">

                    {/* DashboardSettingTabs */}
                    <div className="DashboardSettingTabs WebsiteSettingPage">
                        <div className="Pending">
                            <div className="MoveToComplete d_flex d_justify">
                                <div className="DropDown"></div>

                                <Link  href="/add-product" className="CreateNewBtn">
                                    <i className="flaticon-plus"></i> Add Product 
                                </Link>
                                
                            </div>


                            <div className="Table">
                                <table >
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Image</th>

                                            <th>Product Name</th>
                                            <th>Product Code</th>
                                            <th>Selling Price (BDT)</th>
                                            <th>Quantity</th>
                                            <th>Added On</th>
                                            <th>Shipping Cost</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={13}>
                                                <Box sx={{ width: 40 }}>
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                </Box>
                                            </td>
                                        </tr>
                                    ) : currentProduct.length > 0 ? (
                                        <>
                                            <tbody>
                                                {
                                                    productSearchValue === "" && currentProduct?.map((product, index) => {
                                                        return (
                                                            <tr key={product.id}>
                                                                <td>
                                                                    {index + 1 + currentPage * perPage - perPage}
                                                                </td>
                                                                <td>
                                                                    <img src={product?.main_image?.name} alt="" />
                                                                </td>

                                                                <td>

                                                                    <Tooltip
                                                                        title={product?.product_name}
                                                                        placement='top-start'
                                                                    >
                                                                        <span>
                                                                            {product?.product_name.length < 15 ? (
                                                                                <span>{product?.product_name}</span>

                                                                            ) : (
                                                                                <span>
                                                                                    {product?.product_name?.slice(0, 15)}...
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </Tooltip>
                                                                </td>
                                                                <td>{product.product_code}</td>
                                                                <td>{product.price}</td>

                                                                <td>{product?.product_qty >= 0 ? product?.product_qty : <span style={{ color: 'red' }}>stock out {product?.product_qty}</span>}</td>
                                                                <td>{moment(product.created_at).format("LL")}</td>
                                                                <td>
                                                                    {product?.delivery_charge !== "paid" ? <p><span>Delivery Free</span></p> : <>
                                                                        <p>In Dhaka - <span>{product?.inside_dhaka}TK</span></p>
                                                                        <p>Out Dhaka - <span>{product?.outside_dhaka}TK</span></p>
                                                                    </>}


                                                                </td>


                                                                <td className="EditViewDelete">

                                                                    <div className="action">

                                                                        <Button className='viewActionBtn'>
                                                                            <ShowProduct id={product.id}></ShowProduct>
                                                                        </Button>

                                                                        <Button className='updateActionBtn'>
                                                                            <ProductUpdate id={product.id} category={category}></ProductUpdate>
                                                                        </Button>

                                                                        <Button className='deleteActionBtn' onClick={() => deleteProduct(product.id)}>
                                                                            <i class="flaticon-trash"></i>
                                                                        </Button>

                                                                    </div>

                                                                </td>
                                                            </tr>
                                                        );
                                                    })}


                                                {/* filter product */}
                                                {
                                                    productSearchValue && filterProducts?.map((product, index) => {
                                                        return (
                                                            <tr key={product.id}>
                                                                <td>
                                                                    <td>{index + 1}</td>
                                                                </td>
                                                                <td>
                                                                    <img src={product?.main_image?.name} alt="" />
                                                                </td>

                                                                <td>

                                                                    <Tooltip
                                                                        title={product?.product_name}
                                                                        placement='top-start'
                                                                    >
                                                                        <span>
                                                                            {product?.product_name.length < 15 ? (
                                                                                <span>{product?.product_name}</span>

                                                                            ) : (
                                                                                <span>
                                                                                    {product?.product_name?.slice(0, 15)}...
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </Tooltip>
                                                                </td>
                                                                <td>{product.product_code}</td>
                                                                <td>{product.price}</td>
                                                                <td>{product?.product_qty > 0 ? product?.product_qty : <span style={{ color: 'red' }}>stock out</span>}</td>
                                                                <td>{moment(product.created_at).format("LL")}</td>
                                                                <td>
                                                                    {product?.delivery_charge !== "paid" ? <p><span>Delivery Free</span></p> : <>
                                                                        <p>In Dhaka - <span>{product?.inside_dhaka}TK</span></p>
                                                                        <p>Out Dhaka - <span>{product?.outside_dhaka}TK</span></p>
                                                                    </>}


                                                                </td>
                                                                <td className="EditViewDelete">
                                                                    <Button className="ButtonEdit" href="">

                                                                        <ShowProduct id={product.id}></ShowProduct>
                                                                    </Button>
                                                                    <Button className="ButtonEdit">

                                                                        <ProductUpdate id={product.id} category={category}></ProductUpdate>
                                                                    </Button>
                                                                    <Link
                                                                        href=""
                                                                        onClick={() => deleteProduct(product.id)}
                                                                    >

                                                                        <RiDeleteBin6Line />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}

                                            </tbody>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={10}>
                                                <section className="MiddleSection">
                                                    <div className="MiddleSectionContent">
                                                        <div className="img">
                                                            <img src="/error.svg" alt="" />
                                                        </div>

                                                        <div className="text">
                                                            <p>Not Found</p>

                                                            <Button className="CreateNewBtn"><Link
                                                                href='/add-product'>Add
                                                                Products</Link></Button>
                                                        </div>
                                                    </div>
                                                </section>
                                            </td>
                                        </tr>
                                    )}


                                </table>
                            </div>
                        </div>

                        <div style={{ display: productSearchValue === "" ? "block" : "none" }}>
                            <Box
                                sx={{
                                    margin: "auto",
                                    width: "fit-content",
                                    alignItems: "center",
                                }}
                            >
                                <Stack spacing={2}>

                                    <Pagination
                                        count={pageNumbers.length}
                                        variant="outlined"
                                        page={currentPage}
                                        onChange={paginate}
                                    />
                                </Stack>
                            </Box>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default Product;
