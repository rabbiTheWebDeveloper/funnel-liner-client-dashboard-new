import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment/moment";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import { useGetCategoryQuery } from "../../../redux/features/category/categoryApi";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import ShowCategory from "./ShowCategory";
import UpdateCategory from "./UpdateCategory";
import SmallLoader from "../../SmallLoader/SmallLoader";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import DownloadOptionCategory from "./DownloadOptionCategory";

const SubProduct = () => {
  const showToast = useToast();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoader, setIsPageLoader] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [showViewCategoryPopup, setShowViewCategoryPopup] = useState(false);
  const [showDeleteCategoryPopup, setShowDeleteCategoryPopup] = useState(false);

  const hanldeFetchCategories = useCallback(() => {
    axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}`,
        { headers: headers, params: { page: currentPage, per_page: perPage } }
      )
      .then(function (response) {
        let allProduct = response.data.data;
        setTotalPage(response.data?.last_page);
        setProducts(allProduct);
        setIsLoading(false);
      })
      .catch(function (error) {
        if (error.response.data.api_status === "401") {
          window.location.href = "/login";
          Cookies.remove("token");
          localStorage.clear("token");
          Cookies.remove("user");
          localStorage.clear("user");

          window.location.href = "/login";
        }
      });
  }, [currentPage, perPage]);

  useEffect(() => {
    hanldeFetchCategories();
  }, [hanldeFetchCategories]);

  const deleteProduct = id => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      iconHtml: '<img src="/images/delete.png">',
      customClass: {
        icon: "no-border",
      },
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#894bca",
      confirmButtonText: "Yes, delete",
    }).then(result => {
      if (result.isConfirmed) {
        setIsPageLoader(true);
        axios
          .delete(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.DELETE_CATEGORY}/${id}`,
            {
              headers: headers,
            }
          )
          .then(function (result) {
            // handle success
            if (result) {
              setProducts(pd => {
                const filter = products.filter(prod => {
                  return prod.id !== id;
                });
                showToast("Category has been deleted.");
                return [...filter];
              });
            }
            setIsPageLoader(false);
          })
          .catch(err => {
            setIsPageLoader(false);
          });
      }
    });
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
    // setCount(1);
  };
  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };
  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order">
        {isPageLoader && <SmallLoader />}

        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Category"}
          subTitle={"Shop Category List"}
          search={false}
          order={false}
          videoLink={{
            video:
              "https://www.youtube.com/embed/u6C2KvB5Kzs?si=Qv2g-PI-ebPmsATK",
            title: "How to add your categories step by step in FunnelLiner",
          }}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown">
                  <DownloadOptionCategory categories={products} />
                </div>

                <Link href="/add-category" className="CreateNewBtn">
                  <i className="flaticon-plus"></i> Add Category
                </Link>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Image</th>
                      <th>Category Name</th>
                      <th>Added On</th>
                      <th>Status</th>
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
                    <tbody>
                      {products?.map((product, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {index + 1 + currentPage * perPage - perPage}
                            </td>
                            <td>
                              <img
                                src={
                                  product?.wp_category_image_url
                                    ? product?.wp_category_image_url
                                    : product?.category_image
                                    ? product?.category_image
                                    : "/images/default-category.jpg"
                                }
                                alt=""
                              />
                            </td>
                            <td>{product?.name}</td>

                            <td>{moment(product?.created_at).format("LL")}</td>
                            <td>{product?.status ? "Active" : "Inactive"}</td>

                            <td>
                              <div className="action">
                                <Button
                                  className="viewActionBtn"
                                  onClick={() => {
                                    setShowViewCategoryPopup(true);
                                    setSelectedCategoryId(product?.id);
                                  }}
                                >
                                  {" "}
                                  <i className="flaticon-view"></i>
                                </Button>
                                <Button
                                  className="updateActionBtn"
                                  onClick={() => {
                                    setSelectedCategoryId(product?.id);
                                    setShowDeleteCategoryPopup(true);
                                  }}
                                >
                                  <i className="flaticon-edit"></i>
                                </Button>

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

                              <Link href="/add-category">Add Category</Link>

                              {/* <p>OR</p> */}

                              {/* <Link href='https://dashboard.funnelliner.com/landing-page'>Add New Page</Link> */}
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
          </div>
        </Container>
        {showViewCategoryPopup && (
          <ShowCategory
            id={selectedCategoryId}
            isOpen={showViewCategoryPopup}
            closePopup={() => setShowViewCategoryPopup(false)}
          />
        )}
        {showDeleteCategoryPopup && (
          <UpdateCategory
            id={selectedCategoryId}
            isOpen={showDeleteCategoryPopup}
            closePopup={() => setShowDeleteCategoryPopup(false)}
            hanldeFetchCategories={hanldeFetchCategories}
          />
        )}
      </section>
    </>
  );
};

export default SubProduct;
