import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import ProductUpdate from "./ProductUpdate";
import ShowProduct from "./ShowProduct";
import useConfirmationDialog from "../../../hook/useConfirmationDialog";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import SmallLoader from "../../SmallLoader/SmallLoader";
import { useRouter } from "next/router";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import useDebounce from "../../../hook/useDebounce";
import DownloadOptionProduct from "./DownloadOptionProduct";

const Product = ({ busInfo }) => {
  const router = useRouter();
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [productSearchValue, setProductSearchValue] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [category, setCategory] = useState([]);
  //confirmation alert
  const handleConfirmationDialog = useConfirmationDialog(
    "Delete Product?",
    "Are you sure you want to delete?",
    "Yes, delete"
  );
  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.BASE_URL + "/client/products",
        {
          headers: headers,
          params: { page: currentPage, per_page: perPage },
        }
      );
      setProducts(response.data.data);
      setTotalPage(response.data?.last_page);
      setIsLoading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.api_status === "401"
      ) {
        handleUnauthorizedError();
      } else {
        console.error("Error fetching products:", error);
      }
    }
  };
  const fetchProductSearch = async term => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.BASE_URL + "/client/products-for-search",
        {
          headers: headers,
          params: { search: term },
        }
      );
      setProducts(response.data.data);
      setTotalPage(response.data?.last_page);
      setIsLoading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.api_status === "401"
      ) {
        handleUnauthorizedError();
      } else {
        console.error("Error fetching products:", error);
      }
    }
  };

  const handleUnauthorizedError = () => {
    // Clear token and user data
    Cookies.remove("token");
    localStorage.clear("token");
    Cookies.remove("user");
    localStorage.clear("user");

    // Redirect to login page
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchProduct();
  }, [currentPage, perPage]);

  const deleteProduct = async id => {
    const confirmed = await handleConfirmationDialog();
    if (confirmed) {
      setIsLoading(true);
      axios
        .delete(process.env.NEXT_PUBLIC_API_URL + "/client/products/" + id, {
          headers: headers,
        })
        .then(function (result) {
          if (result.data.success) {
            setProducts(pd => {
              const filter = products.filter(prod => {
                return prod.id !== id;
              });
              return [...filter];
            });
            showToast("Product delete successfully!", "success");
          } else {
            showToast("Something went wrong!", "error");
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("err", err);
          setIsLoading(false);
        });
    }
  };

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productModalViewId, setProductModalViewId] = useState(null);
  const [ProductEditModalID, setProductEditModalID] = useState(null);
  const handleOpenModal = (id, modal) => {
    if (modal === "edit") {
      setProductEditModalID(id);
      setEditModalOpen(true);
    }
    if (modal === "view") {
      setProductModalViewId(id);
      setViewModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setProductModalViewId(null);
    setProductEditModalID(null);
    setViewModalOpen(false);
    setEditModalOpen(false);
  };

  const hanldeFetchCategories = () => {
    if (editModalOpen || viewModalOpen) {
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/client/categories", {
          headers: headers,
        })
        .then(function (response) {
          let categories = response.data.data;
          setCategory(categories);
        })
        .catch(function (error) {});
    }
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
    // setCount(1);
  };
  useEffect(() => {
    hanldeFetchCategories();
  }, [editModalOpen, viewModalOpen]);

  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const doSearch = useDebounce(term => {
    if (term) {
      fetchProductSearch(term);
    } else {
      fetchProduct();
    }
  }, 500);

  function handleChangeSearch(e) {
    const value = e.target.value;
    doSearch(value);
  }

  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order">
        {isLoading && (
          <div className="orderSection_preloader">
            {" "}
            <SmallLoader />{" "}
          </div>
        )}

        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Product List"}
          subTitle={"Find Your Product"}
          handleChange={handleChangeSearch}
          search={true}
          order={false}
          setSearch={setProductSearchValue}
          videoLink={{
            video:
              "https://www.youtube.com/embed/u6C2KvB5Kzs?si=Qv2g-PI-ebPmsATK",
            title:
              "How to add your products & categories step by step in FunnelLiner",
          }}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown">
                  <DownloadOptionProduct orders={products} />
                </div>

                <Link href="/add-product" className="CreateNewBtn">
                  <i className="flaticon-plus"></i> Add Product
                </Link>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Image</th>

                      <th>Product Name</th>
                      <th>Product Code</th>
                      <th>Selling Price (BDT)</th>
                      <th>Quantity</th>
                      <th>Visitor </th>
                      <th>Status</th>
                      <th>Added On</th>
                      <th>Shipping Cost</th>
                      <th>Source</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  {isLoading ? (
                    <tr>
                      <td colSpan={13}>
                        <Box sx={{ width: 40 }}>
                          {[...Array(15)].map((_, index) => (
                            <Skeleton width="100%" key={index} height={28} />
                          ))}
                        </Box>
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    <>
                      <tbody>
                        {!!products &&
                          products?.map((product, index) => {
                            return (
                              <tr key={product.id}>
                                <td>
                                  {index + 1 + currentPage * perPage - perPage}
                                </td>
                                <td>
                                  <img
                                    src={
                                      product?.wp_product_id
                                        ? product?.wp_product_image_url
                                        : product?.main_image
                                    }
                                    alt={product?.product_name}
                                  />
                                </td>

                                <td>
                                  <Tooltip
                                    title={product?.product_name}
                                    placement="top-start"
                                  >
                                    <span>
                                      {product?.product_name.length < 15 ? (
                                        <span>{product?.product_name}</span>
                                      ) : (
                                        <span>
                                          {product?.product_name?.slice(0, 15)}
                                          ...
                                        </span>
                                      )}
                                    </span>
                                  </Tooltip>
                                </td>
                                <td>{product.product_code}</td>
                                <td>{product.price}</td>

                                <td>
                                  {product?.product_qty >= 0 ? (
                                    product?.product_qty
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      stock out {product?.product_qty}
                                    </span>
                                  )}
                                </td>
                                <td>{product?.total_visit}</td>
                                <td>
                                  {product?.status ? "Active" : "Inactive"}
                                </td>
                                <td>
                                  {moment(product?.created_at).format("LL")}
                                </td>
                                <td>
                                  {product?.delivery_charge !== "paid" ? (
                                    <p>
                                      <span>Delivery Free</span>
                                    </p>
                                  ) : (
                                    <>
                                      <p>
                                        In{" "}
                                        {busInfo?.default_delivery_location
                                          ? busInfo?.default_delivery_location +
                                            "-"
                                          : "Dhaka -"}{" "}
                                        <span>{product?.inside_dhaka}TK</span>
                                      </p>
                                      <p>
                                        Out In{" "}
                                        {busInfo?.default_delivery_location
                                          ? busInfo?.default_delivery_location +
                                            "-"
                                          : "Dhaka -"}{" "}
                                        -{" "}
                                        <span>{product?.outside_dhaka}TK</span>
                                      </p>
                                      {product?.sub_area_charge ? (
                                        <p>
                                          Sub Area Charge -{" "}
                                          <span>
                                            {product?.sub_area_charge}TK
                                          </span>
                                        </p>
                                      ) : null}
                                    </>
                                  )}
                                </td>
                                <td>{product?.wp_product_id ? "WooCommerce" : "Funnelliner"}</td>
                                <td className="EditViewDelete">
                                  <div className="action">
                                    <Button
                                      className="viewActionBtn"
                                      onClick={() =>
                                        router.push(
                                          `/product-view?id=${product?.id}`
                                        )
                                      }
                                    >
                                      <i className="flaticon-view"></i>
                                    </Button>
                                    {product.id === productModalViewId && (
                                      <ShowProduct
                                        id={product.id}
                                        modalOpen={viewModalOpen}
                                        handleCloseModal={handleCloseModal}
                                        product={product}
                                      />
                                    )}

                                    <Button
                                      className="updateActionBtn"
                                      onClick={() =>
                                        router.push(
                                          `/edit-product?id=${product?.id}`
                                        )
                                      }
                                    >
                                      <i className="flaticon-edit"></i>
                                    </Button>
                                    {product.id === ProductEditModalID && (
                                      <ProductUpdate
                                        id={product.id}
                                        category={category}
                                        modalOpen={editModalOpen}
                                        handleCloseModal={handleCloseModal}
                                        product={product}
                                        fetchProduct={fetchProduct}
                                        busInfo={busInfo}
                                      />
                                    )}

                                    <Button
                                      className="deleteActionBtn"
                                      onClick={() => deleteProduct(product.id)}
                                    >
                                      <i className="flaticon-delete"></i>
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
                              <p>Not Found</p>

                              <Button className="CreateNewBtn">
                                <Link href="/add-product">Add Products</Link>
                              </Button>
                            </div>
                          </div>
                        </section>
                      </td>
                    </tr>
                  )}
                </table>
              </div>
            </div>
            <Box
              style={{
                display: "flex",
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
              <div
                className="DropDown Download "
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px" }}>Rows per page</span>
                <div id="per-page-select_order">
                  <FormControl
                    variant="outlined"
                    style={{ width: "100px", marginLeft: "10px" }}
                  >
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
        </Container>
      </section>
    </>
  );
};

export default Product;
