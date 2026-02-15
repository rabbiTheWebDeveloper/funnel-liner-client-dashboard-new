import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { headers } from "../../../pages/api";

import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";
import UpdateStock from "./UpdateStock";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const StockIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchApi, setFetch] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
 

  const fetchStockProducts = useCallback(async () => {
    const params = { page: currentPage, perPage: perPage }
    await axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.STOCK_IN.GET_STOCK_IN_PRODUCTS}`,
        { headers: headers, params: params }
      )
      .then(function (response) {
        setProducts(response.data.data);
        setTotalPage(response.data?.last_page);
        setIsLoading(false);
      });
  }, [ currentPage, fetchApi, perPage]);

  useEffect(() => {
    fetchStockProducts();
  }, [fetchApi, fetchStockProducts, currentPage, perPage]);
  const handleChange = (event, value) => {
    setCurrentPage(value);

  };
  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };
  console.log(currentPage, perPage);
  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order Stock">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-in-stock-1"}
          title={"Stock In"}
          subTitle={"Update your inventory products stock"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown Download"></div>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      {/* <th><Checkbox/></th> */}
                      <th>SL</th>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Product Code</th>
                      <th>Selling Price (BDT)</th>
                      <th>Quantity</th>
                      <th>Action</th>
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
                        {products?.map((product, index) => {
                          return (
                            <tr key={product.id}>
                              <td>
                                {index + 1 + currentPage * perPage - perPage}
                              </td>
                              <td>
                                <img src={product?.main_image || product?.wp_product_image_url} alt={product?.product_name} />
                              </td>
                              <td>{product?.product_name}</td>
                              <td>{product.product_code}</td>
                              <td>{product.price}</td>
                              <td>
                                {product?.product_qty > 0 ? (
                                  product?.product_qty
                                ) : (
                                  <span style={{ color: "red" }}>
                                    stock out {product?.product_qty}{" "}
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="action">
                                  <Button
                                    className="updateActionBtn"
                                    onClick={() => {
                                      setShowEditPopup(true);
                                      setSelectedProductId(product?.id);
                                    }}
                                  >
                                    <div>
                                      {" "}
                                      <i className="flaticon-edit"></i>{" "}
                                    </div>
                                  </Button>
                                </div>
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
                              <p>No Stock In </p>
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
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
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                </div>

                <Stack spacing={2}>
                  <Pagination
                    count={totalPage}
                    page={currentPage}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Stack>
                <div></div>

              </Box>
            </div>
          </div>
        </Container>
        {showEditPopup && (
          <UpdateStock
            productId={selectedProductId}
            open={showEditPopup}
            onClosePopup={() => setShowEditPopup(false)}
            fetchStockProducts={fetchStockProducts}
          />
        )}
      </section>
    </>
  );
};

export default StockIn;
