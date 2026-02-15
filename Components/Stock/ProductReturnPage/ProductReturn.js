import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { MdOutlineInventory } from "react-icons/md";
import Swal from "sweetalert2";
import { headers } from "../../../pages/api";

import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";

const ProductReturn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);


  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/stocks/product-return/list", {
        headers: headers,
        params: {
          page: currentPage,
          perPage: perPage,
        },
      })
      .then(function (response) {
        // handle success
        setProducts(response.data.data);
        setTotalPage(response.data?.last_page);
        setIsLoading(false);
      });
  }, [ currentPage, perPage]);


  const [productSearchValue, setProductSearchValue] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const handleChangeSearchBox = (e) => {
    setProductSearchValue(e.target.value);
    const filtered = products.filter(
      (item) =>
        item?.id?.toString().includes(e.target.value) ||
        item?.product_name
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item?.product_code?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterProducts(filtered);
  };

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
          headerIcon={"flaticon-express-delivery"}
          title={"Product Return"}
          subTitle={"Return Product List by Courier"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown"></div>

                <div className="DropDown Download"></div>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th>Order Date</th>
                      <th>Return Date</th>
                      <th>Customer Name</th>
                      <th>Contact No.</th>
                      <th>Address</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Cancellation Note</th>
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
                          products?.map((product) => {
                            return (
                              <tr key={product.id}>
                                <td>
                                  <img src={product.main_image} alt="" />
                                </td>
                                <td>{product?.id}</td>
                                <td>{product?.product_name}</td>
                                <td>{product.product_code}</td>
                                <td>{product.price}</td>
                                <td>
                                  {product?.product_qty > 0 ? (
                                    product?.product_qty
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      stock out
                                    </span>
                                  )}
                                </td>
                                <td className="EditViewDelete">
                                  {/* Modal */}
                                  <UpdateStock
                                    productId={product?.id}
                                  ></UpdateStock>
                                </td>
                              </tr>
                            );
                          })}

                        {productSearchValue &&
                          filterProducts?.map((product) => {
                            return (
                              <tr key={product.id}>
                                <td>
                                  <img src={product.main_image} alt="" />
                                </td>
                                <td>{product?.id}</td>
                                <td>{product?.product_name}</td>
                                <td>{product.product_code}</td>
                                <td>{product.price}</td>
                                <td>
                                  {product?.product_qty > 0 ? (
                                    product?.product_qty
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      stock out
                                    </span>
                                  )}
                                </td>
                                <td className="EditViewDelete">
                                  {/* Modal */}
                                  <UpdateStock
                                    productId={product?.id}
                                  ></UpdateStock>
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
                              <img src="images/empty.png" alt="" />
                            </div>

                            <div className="text">
                              <p>Not Found</p>
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
      </section>
    </>
  );
};

export default ProductReturn;
