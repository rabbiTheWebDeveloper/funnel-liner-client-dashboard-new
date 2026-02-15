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
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import ShowSubCategory from "./ShowSubCategory";
import UpdateSubCategory from "./UpdateSubCategory";
import SmallLoader from "../../SmallLoader/SmallLoader";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import DownloadOptionSubCategory from "./DownloadOptionSubCategory";

const SubCategoryList = () => {
  const showToast = useToast();
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoader, setIsPageLoader] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState();
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  // Fetch all categories (for parent name display)
  const fetchCategories = useCallback(() => {
    axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}`,
        { headers: headers }
      )
      .then(function (response) {
        setCategories(response.data.data || []);
      })
      .catch(function (error) {});
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch sub-categories
  const handleFetchSubCategories = useCallback(() => {
    axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}`,
        {
          headers: headers,
          params: { page: currentPage, perPage: perPage, type: "sub_category" },
        }
      )
      .then(function (response) {
        let allSubCategories = response.data.data;
        setTotalPage(response.data?.last_page);
        setSubCategories(allSubCategories);
        setIsLoading(false);
      })
      .catch(function (error) {
        if (error?.response?.data?.api_status === "401") {
          Cookies.remove("token");
          localStorage.clear("token");
          Cookies.remove("user");
          localStorage.clear("user");
          window.location.href = "/login";
        }
      });
  }, [currentPage, perPage]);

  useEffect(() => {
    handleFetchSubCategories();
  }, [handleFetchSubCategories]);

  const deleteSubCategory = (id) => {
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
    }).then((result) => {
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
            if (result) {
              setSubCategories((pd) => {
                const filter = subCategories.filter((item) => {
                  return item.id !== id;
                });
                showToast("Sub Category has been deleted.");
                return [...filter];
              });
            }
            setIsPageLoader(false);
          })
          .catch((err) => {
            setIsPageLoader(false);
          });
      }
    });
  };

  // Get parent category name by id
  const getParentCategoryName = (parentId) => {
    const parent = categories.find((cat) => cat.id === parentId);
    return parent ? parent.name : "N/A";
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePerPageChange = (event) => {
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
          title={"Sub Category"}
          subTitle={"Shop Sub Category List"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown">
                  <DownloadOptionSubCategory
                    subCategories={subCategories}
                    categories={categories}
                  />
                </div>

                <Link href="/add-sub-category" className="CreateNewBtn">
                  <i className="flaticon-plus"></i> Add Sub Category
                </Link>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Image</th>
                      <th>Sub Category Name</th>
                      <th>Parent Category</th>
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
                  ) : subCategories.length > 0 ? (
                    <tbody>
                      {subCategories?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {index + 1 + currentPage * perPage - perPage}
                            </td>
                            <td>
                              <img
                                src={
                                  item?.wp_category_image_url
                                    ? item?.wp_category_image_url
                                    : item?.category_image
                                    ? item?.category_image
                                    : "/images/default-category.jpg"
                                }
                                alt=""
                              />
                            </td>
                            <td>{item?.name}</td>
                            <td>{getParentCategoryName(item?.parent_id)}</td>
                            <td>{moment(item?.created_at).format("LL")}</td>
                            <td>{item?.status ? "Active" : "Inactive"}</td>

                            <td>
                              <div className="action">
                                <Button
                                  className="viewActionBtn"
                                  onClick={() => {
                                    setShowViewPopup(true);
                                    setSelectedSubCategoryId(item?.id);
                                  }}
                                >
                                  {" "}
                                  <i className="flaticon-view"></i>
                                </Button>
                                <Button
                                  className="updateActionBtn"
                                  onClick={() => {
                                    setSelectedSubCategoryId(item?.id);
                                    setShowUpdatePopup(true);
                                  }}
                                >
                                  <i className="flaticon-edit"></i>
                                </Button>

                                <Button
                                  className="deleteActionBtn"
                                  onClick={() => deleteSubCategory(item.id)}
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

                              <Link href="/add-sub-category">
                                Add Sub Category
                              </Link>
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
        {showViewPopup && (
          <ShowSubCategory
            id={selectedSubCategoryId}
            isOpen={showViewPopup}
            closePopup={() => setShowViewPopup(false)}
            categories={categories}
          />
        )}
        {showUpdatePopup && (
          <UpdateSubCategory
            id={selectedSubCategoryId}
            isOpen={showUpdatePopup}
            closePopup={() => setShowUpdatePopup(false)}
            handleFetchSubCategories={handleFetchSubCategories}
            categories={categories}
          />
        )}
      </section>
    </>
  );
};

export default SubCategoryList;
