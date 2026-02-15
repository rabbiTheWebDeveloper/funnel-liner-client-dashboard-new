import {
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Skeleton,
    Stack,
    Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";
import { headers } from "../../../pages/api";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const Inventory = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [productSearchValue, setProductSearchValue] = useState("");
    const [filterProducts, setFilterProducts] = useState([]);
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    API_ENDPOINTS.BASE_URL + "/client/stocks/inventory/list",
                    {
                        headers: headers,
                        params: { page: currentPage, perPage: perPage },
                    }
                );
                if (isMounted) {
                    setProducts(response.data?.data);
                    setTotalPage(response.data?.last_page);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [currentPage, perPage]);

    const handleChangeSearchBox = () => {
        const filtered = products?.filter(
            item =>
                item?.id?.toString().includes(productSearchValue) ||
                item?.product_name
                    ?.toLowerCase()
                    .includes(productSearchValue.toLowerCase()) ||
                item?.product_code
                    ?.toLowerCase()
                    .includes(productSearchValue.toLowerCase())
        );
        setFilterProducts(filtered);
    };
    useEffect(() => {
        handleChangeSearchBox();
    }, [productSearchValue]);
    const handleChange = (event, value) => {
        setCurrentPage(value);
    };
    const handlePerPageChange = event => {
        const perPageValue = parseInt(event.target.value);
        setPerPage(perPageValue);
        setCurrentPage(1);
    };
    return (
        <>
            <section className="TopSellingProducts DashboardSetting Order">
                {/* header */}
                <HeaderDescription
                    setSearch={setProductSearchValue}
                    headerIcon={"flaticon-in-stock-1"}
                    title={"Inventory"}
                    subTitle={"Shop Products List"}
                    search={true}
                    order={false}
                />

                <Container maxWidth="sm">
                    {/* DashboardSettingTabs */}
                    <div className="DashboardSettingTabs WebsiteSettingPage">
                        <div className="Pending">
                            <div className="MoveToComplete d_flex d_justify">
                                {/* <div className="DropDown Download">
                                </div> */}
                            </div>
                            <div className="Table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Image</th>
                                            <th>Product Name</th>
                                            <th>Product Code</th>
                                            <th>Quantity</th>
                                            <th>Selling Price (BDT)</th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={13}>
                                                <Box sx={{ width: 40 }}>
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                </Box>
                                            </td>
                                        </tr>
                                    ) : products.length > 0 ? (
                                        <>
                                            <tbody>
                                                {productSearchValue === "" &&
                                                    products?.map((product, index) => {
                                                        return (
                                                            <tr key={product?.id}>
                                                                <td>
                                                                    {index + 1 + currentPage * perPage - perPage}
                                                                </td>
                                                                <td>
                                                                    <img src={product?.main_image || product?.wp_product_image_url} alt={product?.product_name} />
                                                                </td>
                                                                <td>{product?.product_name}</td>
                                                                <td>{product?.product_code}</td>

                                                                <td>
                                                                    <Tooltip
                                                                        title={
                                                                            product?.variations?.length > 0
                                                                                ? product?.variations?.map(
                                                                                    (item, index) => {
                                                                                        return (
                                                                                            <ul key={item.id}>
                                                                                                <li>
                                                                                                    {" "}
                                                                                                    {index + 1} .{item?.variant}{" "}
                                                                                                    -{item?.quantity}
                                                                                                </li>
                                                                                            </ul>
                                                                                        );
                                                                                    }
                                                                                )
                                                                                : "N/A"
                                                                        }
                                                                        placement="top-start"
                                                                    >
                                                                        {product?.product_qty > 0 ? (
                                                                            product?.product_qty
                                                                        ) : (
                                                                            <span style={{ color: "red" }}>
                                                                                stock out{product?.product_qty}
                                                                            </span>
                                                                        )}
                                                                    </Tooltip>

                                                                    {/* {product?.product_qty > 0 ? product?.product_qty : <span style={{ color: 'red' }}>stock out-{product?.product_qty}</span>} */}
                                                                </td>
                                                                <td>{product?.price}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                {/* filter */}
                                                {productSearchValue &&
                                                    filterProducts?.map((product, index) => {
                                                        return (
                                                            <tr key={product?.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <img src={product?.main_image || product?.wp_product_image_url} alt={product?.product_name} />
                                                                </td>
                                                                <td>{product?.product_name}</td>
                                                                <td>{product?.product_code}</td>
                                                                <td>{product?.price}</td>
                                                                <td>
                                                                    <Tooltip
                                                                        title={
                                                                            product?.variations?.length > 0
                                                                                ? product?.variations?.map(
                                                                                    (item, index) => {
                                                                                        return (
                                                                                            <ul key={item.id}>
                                                                                                <li>
                                                                                                    {" "}
                                                                                                    {index + 1} .{item?.variant}{" "}
                                                                                                    -{item?.quantity}
                                                                                                </li>
                                                                                            </ul>
                                                                                        );
                                                                                    }
                                                                                )
                                                                                : "N/A"
                                                                        }
                                                                        placement="top-start"
                                                                    >
                                                                        rtr
                                                                        {product?.product_qty > 0 ? (
                                                                            product?.product_qty
                                                                        ) : (
                                                                            <span style={{ color: "red" }}>
                                                                                stock out{product?.product_qty}
                                                                            </span>
                                                                        )}
                                                                    </Tooltip>
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
                                                            <img src="/images/empty.png" alt="" />
                                                        </div>
                                                        <div className="text">
                                                            <p>Not found</p>
                                                        </div>
                                                    </div>
                                                </section>
                                            </td>
                                        </tr>
                                    )}
                                </table>
                            </div>
                            <Box
                                style={{
                                    display: productSearchValue === "" ? "flex" : "none",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <div></div>
                                <Stack spacing={2}>
                                    <Pagination
                                        count={totalPage}
                                        page={currentPage}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Stack>
                                <div className="DropDown Download " style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "14px" }}>Rows per page</span>
                                    <div id="per-page-select_order">
                                        <FormControl variant="outlined" style={{ width: "100px", marginLeft: "10px" }} >
                                            <Select
                                                id="per-page-select"
                                                value={perPage}
                                                onChange={handlePerPageChange}
                                            >
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={20}>20</MenuItem>
                                                <MenuItem value={30}>30</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                </div>
                            </Box>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default Inventory;
