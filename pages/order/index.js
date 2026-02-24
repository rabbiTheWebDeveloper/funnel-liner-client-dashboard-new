import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  OutlinedInput,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import axios from "axios";
import { enGB } from "date-fns/locale";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DateRangePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import Swal from "sweetalert2";
import OrderModal from "../../Components/OrderPage/Modal";
import Note from "../../Components/OrderPage/Note";
import OrderUpdateModal from "../../Components/OrderPage/OrderUpdateModal";
import SuperFetch from "../../hook/Axios";
import withAuth from "../../hook/PrivateRoute";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactSelect from "react-select";
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import CourierModal from "../../Components/CourierPage/CourierModal";
import SmallLoader from "../../Components/SmallLoader/SmallLoader";
import CopyIcon from "../../Components/UI/CopyIcon/CopyIcon";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import Capitalized, { courierStatusFormate } from "../../constant/capitalized";
import useLoading from "../../hook/useLoading";
import { useToast } from "../../hook/useToast";
import { headers } from "../api";
import ViewModal from "../../Components/OrderPage/ViewModal";
import _ from "lodash";
import RedxCourierModel from "../../Components/OrderPage/RedxCourierModel";
import { calculateDeliveryPercentage } from "../../utlit/orders";
import Image from "next/image";
import searchAnimation from "../../public/search.gif";
import DownloadOption from "./_component/DownloadOption";
import {
  followUpOrderFilterOption,
  confirmedOrderFilterOption,
  cancelledOnStatus,
  orderType,
  removeTextFromNumber,
  holdOnStatus,
  followUpStatus,
  FilterDateInput,
  BootstrapButton,
  formatDateToBST,
  pendingStatus,
  multiStatus,
} from "../../constant/order";

const OrderPage = ({ myAddonsList, busInfo }) => {
  const showToast = useToast();
  const router = useRouter();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [enableGlobalSearch, setEnableGlobalSearch] = useState(false);
  const [active, setDefault] = useState("all");
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [orders, setOrders] = useState([]);
  const [apiResponse, setApiResponse] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [callCount, setCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [redxModal, setRedxModal] = useState({
    open: false,
    orderID: "",
    provider: "",
  });
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectCourier, setSelectCourier] = useState(null);
  const [selectCourierStatus, setSelectCourierStatus] = useState(null);
  const [advancedPaymentConfig, setAdvancedPaymentConfig] = useState(false);
  const [holdOnConfig, setHoldOnConfig] = useState(false);
  const [shippingDateConfig, setShippingDateConfig] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [fetchApi, setFetch] = useState(false);
  const [order, setOrder] = useState({});
  const [viewOrderModal, setViewOrderModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [search, setSearch] = useState(null);
  const [followUpChange, setFollowUpInputChange] = useState("");
  const [courierModal, setCourierModal] = useState(false);
  const [courierList, setCourierList] = useState({});
  const [cities, setCities] = useState();
  const [followUpDate, setFollowUpDate] = useState();
  const [pendingOrderCount, setPendingOrderCount] = useState([]);
  const [perPage, setPerPage] = useState(10);
  //order note functionality
  const [isOpenOrderNoteModal, setIsOpenOrderNoteModal] = useState(false);
  const [orderIdOfModal, setOrderIdOfModal] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [anchorEls, setAnchorEls] = useState(Array(3).fill(null));
  const [onChangeOrderNoteData, setOnChangeOrderNoteData] = useState({
    orderId: null,
    note: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const pendingStatusData = holdOnConfig
    ? [...pendingStatus, { item: "Hold On", value: "hold_on" }]
    : pendingStatus;

  const followUpStatusData = holdOnConfig
    ? [...followUpStatus, { item: "Hold On", value: "hold_on" }]
    : followUpStatus;

  const cancelledOnStatusData = holdOnConfig
    ? [...cancelledOnStatus, { item: "Hold On", value: "hold_on" }]
    : cancelledOnStatus;

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleCloseOrderUpdateModal = () => {
    setModalOpenUpdate(false);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
    setCount(1);
  };

  const formatDate = date => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  const dateValue =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "";

  const handleSelected = value => {
    setFollowUpInputChange(value);
    setOpenDialog(false);
    if (value === "custom") {
      setShowPicker(true);
    } else {
      setShowPicker(false);
    }
    setSelectedValue(value);
  };

  const handleCloseViewModal = () => {
    setViewOrderModalOpen(false);
  };

  const handleCourierTypeChange = e => {
    setSelectCourier(e.target.value);
  };
  const handleFilterStatusChange = value => {
    setSelectCourier(null);
    setSelectCourierStatus(null);
    setFollowUpInputChange(null);
    setSelectedValue(null);
    setDefault(value);
    setCurrentPage(1);
    setShowPicker(false);
    setStartDate();
    setEndDate();
    setEnableGlobalSearch(false);
    setPerPage(10);
    setCurrentPage(1);
    // setTotalPage(0)
  };
  const handleCourierModalOpen = () => {
    setCourierModal(true);
  };
  const handleCourierModalClose = () => {
    setCourierModal(false);
  };

  const params = {
    type:
      active === "all" && startDate && endDate ? "all_order_filter" : active,
    page: currentPage,
    perPage: perPage,
    date: selectedValue,
    provider: selectCourier,
    courier_status: selectCourierStatus,
    // search: search,

    start_date:
      active === "all"
        ? formatDateToBST(startDate)
        : formatDateToBST(startDate),
    end_date:
      active === "all" ? formatDateToBST(endDate) : formatDateToBST(endDate),

    filter_date: selectedValue,
  };
  // if (active === "all" && startDate && endDate) delete params.type;
  if (active === "all" && startDate && endDate) delete params.page;
  if (active === "all" && startDate && endDate) delete params.perPage;
  if (startDate && endDate) params.filter_date = "custom";
  const handleStatusChange = (event, id) => {
    const params = {
      order_id: id,
      status: event.target.value,
    };

    if (event.target.value === "cancelled") {
      Swal.fire({
        iconHtml: '<img src="/images/delete.png">',
        customClass: {
          icon: "no-border",
          border: "0",
        },
        text: "Are you sure you want to cancel this order?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#894BCA",
        cancelButtonColor: "#d33",
        confirmButtonText: "yes, cancel it!",
      }).then(result => {
        if (result.isConfirmed) {
          startLoading();

          SuperFetch.post("/client/orders/status/update", params, {
            headers: headers,
          })
            .then(res => {
              handleFetch();
              toast.success(res.data?.message, { position: "top-right" });
            })
            .catch(error => {
              if (error.response?.data?.msg?.status[0]) {
                handleFetch();
                toast.error(error.response?.data?.msg?.status[0], {
                  position: "top-right",
                });
              }
              toast.error("Internal Server Error", { position: "top-right" });
            });
          setTimeout(() => {
            setFetch(true);

            stopLoading();
          }, 1000);
        }
      });
    } else {
      SuperFetch.post("/client/orders/status/update", params, {
        headers: headers,
      })
        .then(res => {
          handleFetch();
          toast.success(res.data?.message, { position: "top-right" });
        })
        .catch(error => {
          if (error.response?.data?.msg?.status[0]) {
            handleFetch();
            toast.error(error.response?.data?.msg?.status[0], {
              position: "top-right",
            });
          }
          toast.error("Internal Server Error", { position: "top-right" });
        });
      setTimeout(() => {
        setFetch(true);

        stopLoading();
      }, 1000);
    }
  };

  const handleAdvancedPayment = (event, id) => {
    if (event.key === "Enter" && event.target.value > 0) {
      // debugger
      SuperFetch.post(
        `/client/order/advance-payment/${id}/update`,
        { advanced: event.target.value },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });
          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (event.key === "Enter" && event.target.value === "") {
      SuperFetch.post(
        `/client/order/advance-payment/${id}/update`,
        { advanced: "0" },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });
          setFetch(true);
          handleFetch();
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    }
  };

  const handleDiscount = (event, id, type) => {
    if (event.key === "Enter" && event.target.value > 0) {
      SuperFetch.post(
        `/client/order/discount/${id}/update`,
        {
          discount: event.target.value,
          type: type,
        },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });

          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (
      event.key === "Enter" &&
      event.target.value.endsWith("%") === true
    ) {
      SuperFetch.post(
        `/client/order/discount/${id}/update`,
        {
          discount: event.target.value,
          type: type,
        },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });

          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (event.key === "Enter" && event.target.value === "") {
      SuperFetch.post(
        `/client/order/discount/${id}/update`,
        {
          discount: "0",
          type: type,
        },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });

          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (event.key === "Enter") {
      // If the entered value is not a valid number or percentage, show an error toast message
      toast.error(
        "Invalid discount value. Please enter a valid number or percentage (e.g., 10 or 10%).",
        { position: "top-right" }
      );
    }
  };

  const handleFetch = () => {
    setFetch(true);
  };
  const handleOrderUpdate = id => {
    SuperFetch.get(`/client/orders/${id}`, { headers: headers })
      .then(res => {
        setModalOpenUpdate(true);
        setOrder(res.data.data);
        handleFetch();
      })
      .catch(error => {
        toast.error("Something went wrong please wait for some time", {
          position: "top-right",
        });
      });
  };

  const handleFetchOrderGlobalSearch = useCallback(async () => {
    const searchParams = {
      search: search,
    };
    setApiResponse(false);
    try {
      const OrderGlobalSearchResponse = await axios.get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.ORDER_GLOBAL_SEARCH}`,
        {
          headers: headers,
          params: searchParams,
        }
      );
      setOrders(OrderGlobalSearchResponse?.data?.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setApiResponse(true);
    }
  }, [search]);

  useEffect(() => {
    if (search?.length > 0) {
      handleFetchOrderGlobalSearch();
    } else {
      setFetch(true);
    }
  }, [search, handleFetchOrderGlobalSearch]);
  useEffect(() => {
    if (enableGlobalSearch === false && active !== "trashed") {
      SuperFetch.get("/client/orders", { params: params, headers: headers })
        .then(res => {
          if (res.data.success) {
            setOrders(res.data?.data);
            setTotalPage(res.data?.last_page);
            setFetch(false);
            setApiResponse(true);
          }
        })
        .catch(e => {});
      if (modalOpenUpdate || modalOpen) {
        SuperFetch.get("/client/products-for-search", {
          headers: headers,
        }).then(res => {
          if (res.data.success) {
            setProducts(res.data?.data);
          }
        });
      }
      if (callCount === 0) {
        if (active === "pending") {
          SuperFetch.get(API_ENDPOINTS.ORDERS.ORDER_ADVANCE_PAYMENT_CONFIG, {
            headers: headers,
          }).then(res => {
            if (res?.data?.success) {
              setAdvancedPaymentConfig(res.data?.data?.advanced_payment);
            }
          });
        }

        SuperFetch.get(API_ENDPOINTS.ORDERS.ORDER_HOLD_ON_CONFIG, {
          headers: headers,
        }).then(res => {
          if (res?.data?.success) {
            setHoldOnConfig(res.data?.data?.hold_on);
          }
        });
        if (active === "confirmed") {
          SuperFetch.get(`${API_ENDPOINTS.ORDERS.ORDER_SHIPPING_DATE_CONFIG}`, {
            headers: headers,
          }).then(res => {
            if (res.data.success) {
              setShippingDateConfig(res?.data?.data?.shipped_date_status);
            }
          });
        }
      }

      setFetch(false);
    }
  }, [
    followUpChange,
    active,
    currentPage,
    fetchApi,
    selectCourier,
    selectCourierStatus,
    update,
    startDate,
    endDate,
    modalOpenUpdate,
    modalOpen,
    perPage,
  ]);

  const onChangeDate = (orderId, type) => {
    if (followUpDate === undefined) {
      showToast("Please select valid Date", "error");
      return;
    }
    const postBody = {
      date: `${followUpDate.$y}-${followUpDate.$M + 1}-${followUpDate.$D}`,
      type: type,
    };
    axios
      .post(
        API_ENDPOINTS.BASE_URL + `/client/order/date/${orderId}/update`,
        postBody,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        if (response.status === 200) {
          handleFetch();
          toast.success(response.data.message, {
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          });
        }
      });
  };

  const [courierViewValue, setCourierViewValue] = useState("");

  const courierSubmit = (event, id) => {
    setCourierViewValue(event.target.value);
    startLoading();
    if (event.target.value === "pathao") {
      SuperFetch.get("/client/courier/pathao/city-list", {
        headers: headers,
        order_id: id,
        provider: event.target.value,
      }).then(res => {
        if (res?.data?.success) {
          setCities(res.data?.data);
          setOrderId(id);
          handleCourierModalOpen();
          // orderUpdate();
          setCourierViewValue("");
        } else {
          showToast(res?.data?.message, "error");
        }
        stopLoading();
      });
    } else if (event.target.value === "steadfast") {
      SuperFetch.post(
        "/client/courier/send-order",
        {
          order_id: [id],
          provider: event.target.value,
        },
        { headers: headers }
      ).then(res => {
        showToast("Order Send Courier Provider Successfully", "success");
        handleFetch();
        stopLoading();

        setCourierViewValue("");
      });
    } else if (event.target.value === "redx") {
      setRedxModal({
        ...redxModal,
        open: true,
        orderID: id,
        provider: event.target.value,
      });
      stopLoading();
      setCourierViewValue("");
    } else if (event.target.value === "office") {
      SuperFetch.post(
        "/client/orders/status/update",
        {
          order_id: id,
          status: "delivered",
        },
        { headers: headers }
      ).then(res => {
        showToast("Office Delivery successfully", "success");
        handleFetch();
        stopLoading();

        setCourierViewValue("");
      });
    } else if (event.target.value === "redriect-courier") {
      router.push("/courier");
    }
  };

  useEffect(() => {
    if (active === "confirmed") {
      SuperFetch.get("/client/courier/list", { headers: headers }).then(
        function (response) {
          setCourierList(response?.data.data);
        }
      );
    }
  }, [active]);

  // Dropdown

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick1 = (event, index) => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = event.currentTarget;
    setAnchorEls(newAnchorEls);
  };
  const handleClose1 = index => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = null;
    setAnchorEls(newAnchorEls);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      const orderIds = orders.map(order => order.id);
      setSelectedOrders(orderIds);
    }
    setSelectAll(!selectAll);
  };
  const handleOrderSelection = orderId => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  const multiSelectOrdersCouriers = courierProvider => {
    SuperFetch.post(
      "/client/courier/send-order",
      {
        order_id: [...selectedOrders],
        provider: courierProvider,
        request_type: "bulk",
      },
      { headers: headers }
    ).then(res => {
      showToast("Order Send Courier Provider Successfully", "success");
      setSelectedOrders([]);
      handleFetch();
      stopLoading();
    });
  };

  const handleOpenOrderNoteModal = orderId => {
    setIsOpenOrderNoteModal(true);
    setOrderIdOfModal(orderId);
  };
  const handleCloseOrderNoteModal = () => {
    setIsOpenOrderNoteModal(false);
  };
  const getNoteDefaultValue = note => {
    if (note !== null && note?.length <= 43) {
      return note;
    } else if (note !== null && note?.length >= 44) {
      return `${note.slice(0, 44)}..`;
    } else {
      return "Add Note";
    }
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const countNonNullFields = (invoiceNote, courierNote) => {
    if (
      invoiceNote !== null &&
      courierNote !== null &&
      courierNote !== "0" &&
      invoiceNote !== "0"
    ) {
      return 2;
    } else if (
      (invoiceNote !== null && invoiceNote !== "0") ||
      (courierNote !== null && courierNote !== "0")
    ) {
      return 1;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    setSelectedOrders([]);
    setSelectAll(false);
  }, [active]);

  const courierReDriect = () => {
    router.push("/courier");
  };

  const href =
    selectedOrders.length > 0 ? `/invoice-one/${selectedOrders.join("/")}` : "";

  const moveToTrash = id => {
    Swal.fire({
      iconHtml: '<img src="/images/delete.png">',
      customClass: {
        icon: "no-border",
        border: "0",
      },
      text: "Are you sure you want to move this order to trash?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#894BCA",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .get(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.MOVE_ORDER_TRASHED}/${id}`,
            {
              headers: headers,
            }
          )
          .then(function (result) {
            if (result) {
              setOrders(pd => {
                const filter = orders.filter(prod => {
                  return prod.id !== id;
                });
                return [...filter];
              });
              showToast("Your order has been Moved to trash", "success");
            } else {
            }
          })
          .catch(errr => {
            showToast("something went wrong", "error");
          });
      }
    });
  };
  const handleFetchOrderTrash = useCallback(async () => {
    if (active === "trashed") {
      try {
        let data = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.GET_ORDER_TRASHED_LIST}`,
          headers: headers,
          params: params,
        });
        if (data.status) {
          setOrders(data?.data?.data);
          setTotalPage(data?.data.last_page);
        }
      } catch (err) {}
    }
  }, [active, currentPage, perPage]);

  useEffect(() => {
    handleFetchOrderTrash();
  }, [handleFetchOrderTrash]);

  const handleFetchOrderCount = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}/client/order/count`,
        headers: headers,
      });
      setPendingOrderCount(data.data.data);
    } catch (err) {}
  };

  useEffect(() => {
    handleFetchOrderCount();
  }, []);

  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const [dropdownAnchors, setDropdownAnchors] = useState({
    courierMenu: null,
    statusMenu: null,
  });

  // Open dropdown
  const openDropdown = (event, key) => {
    setDropdownAnchors(prev => ({
      ...prev,
      [key]: event.currentTarget,
    }));
  };

  // Close dropdown
  const closeDropdown = key => {
    setDropdownAnchors(prev => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleMultiStatusChange = (event, id) => {
    const params = {
      order_ids: Array.isArray(id) ? id : [id],
      status: event.target.value,
    };

    const updateStatus = () => {
      startLoading();

      SuperFetch.post("/client/multiple-orders/status/update", params, {
        headers,
      })
        .then(res => {
          handleFetch();
          toast.success(res.data?.message, { position: "top-right" });
        })
        .catch(error => {
          const errorMsg = error.response?.data?.msg?.status?.[0];
          toast.error(errorMsg || "Internal Server Error", {
            position: "top-right",
          });
        })
        .finally(() => {
          setFetch(true);
          stopLoading();
        });
    };

    if (params.status === "cancelled") {
      Swal.fire({
        iconHtml: '<img src="/images/delete.png">',
        customClass: { icon: "no-border" },
        text: "Are you sure you want to cancel this order?",
        showCancelButton: true,
        confirmButtonColor: "#894BCA",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
      }).then(result => {
        if (result.isConfirmed) {
          updateStatus();
        }
      });
    } else {
      updateStatus();
    }
  };
// Make sure courierList is an array before calling filter
const activeCouriers = Array.isArray(courierList) 
  ? courierList.filter(item => item.status === "active")
  : [];
  const hasSteadfast = activeCouriers?.some(
    item => item.provider === "steadfast"
  );

  const hasRedx = activeCouriers?.some(item => item.provider === "redx");
  return (
    <div>
      <section className="DashboardSetting Order">
        {isLoading && (
          <div className="orderSection_preloader">
            <SmallLoader />
          </div>
        )}
        {/* header */}
        <HeaderDescription
          videoLink={{
            video:
              "https://www.youtube.com/embed/Z5bjNcweC8s?si=AYJvJWfJehFenQRO",
            title: "Effective Order Management tutorial",
          }}
          setSearch={setSearch}
          setOrders={setOrders}
          handleFilterStatusChange={handleFilterStatusChange}
          setEnableGlobalSearch={setEnableGlobalSearch}
          headerIcon={"flaticon-sent"}
          title={"Orders"}
          subTitle={"Order List"}
          search={false}
          order={true}
        />

        <Container maxWidth="sm">
          <div className="OrderTabs">
            <div
              className="CommonTab"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%", typography: "body1" }}>
                <BootstrapButton
                  className={active === "all" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("all")}
                >
                  All
                  <h6>
                    {pendingOrderCount?.allOrderCount > 0
                      ? pendingOrderCount?.allOrderCount
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "pending" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("pending")}
                >
                  Pending
                  <h6>
                    {pendingOrderCount?.pending > 0
                      ? pendingOrderCount?.pending
                      : "0"}
                  </h6>
                </BootstrapButton>
                {Array.isArray(myAddonsList) &&
                  myAddonsList?.some(
                    addon => addon?.addons_id === 13 && addon?.status === 1
                  ) && (
                    <BootstrapButton
                      className={active === "unverified" ? "filterActive" : ""}
                      onClick={e => handleFilterStatusChange("unverified")}
                    >
                      Unverified
                      <h6>
                        {pendingOrderCount?.unverified > 0
                          ? pendingOrderCount?.unverified
                          : "0"}
                      </h6>
                    </BootstrapButton>
                  )}

                <BootstrapButton
                  className={active === "confirmed" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("confirmed")}
                >
                  Confirmed
                  <h6>
                    {pendingOrderCount?.confirmed > 0
                      ? pendingOrderCount?.confirmed
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "shipped" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("shipped")}
                >
                  Shipped
                  <h6>
                    {pendingOrderCount?.shipped > 0
                      ? pendingOrderCount?.shipped
                      : "0"}
                  </h6>
                </BootstrapButton>

                <BootstrapButton
                  className={active === "delivered" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("delivered")}
                >
                  Delivered
                  <h6>
                    {pendingOrderCount?.delivered > 0
                      ? pendingOrderCount?.delivered
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "cancelled" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("cancelled")}
                >
                  Cancelled
                  <h6>
                    {pendingOrderCount?.cancelled > 0
                      ? pendingOrderCount?.cancelled
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "returned" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("returned")}
                >
                  Returned
                  <h6>
                    {pendingOrderCount?.returned > 0
                      ? pendingOrderCount?.returned
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "follow_up" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("follow_up")}
                >
                  Follow Up
                  <h6>
                    {pendingOrderCount?.follow_up > 0
                      ? pendingOrderCount?.follow_up
                      : "0"}
                  </h6>
                </BootstrapButton>
                {holdOnConfig ? (
                  <BootstrapButton
                    className={active === "hold_on" ? "filterActive" : ""}
                    onClick={e => handleFilterStatusChange("hold_on")}
                  >
                    Hold On
                    <h6>
                      {pendingOrderCount?.hold_on > 0
                        ? pendingOrderCount?.hold_on
                        : "0"}
                    </h6>
                  </BootstrapButton>
                ) : undefined}
                <BootstrapButton
                  className={active === "trashed" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("trashed")}
                >
                  Order Trash
                  <h6>
                    {pendingOrderCount?.trash > 0
                      ? pendingOrderCount?.trash
                      : "0"}
                  </h6>
                </BootstrapButton>
                {busInfo?.incompleted_order ? (
                  <BootstrapButton
                    className={active === "incomplete" ? "filterActive" : ""}
                    onClick={e => handleFilterStatusChange("incomplete")}
                  >
                    In Complete Order
                    <h6>
                      {pendingOrderCount?.incomplete > 0
                        ? pendingOrderCount?.incomplete
                        : "0"}
                    </h6>
                  </BootstrapButton>
                ) : null}
              </Box>
              {active === "all" ||
              active === "pending" ||
              active === "unverified" ||
              active === "confirmed" ||
              active === "shipped" ||
              active === "delivered" ||
              active === "cancelled" ||
              active === "returned" ||
              active === "follow_up" ||
              active === "hold_on" ? (
                <div className="custom_date_picer_width">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    focus={focus}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    locale={enGB}
                    modifiersClassNames={{ open: "-open" }}
                  >
                    {({ startDateInputProps, endDateInputProps }) => (
                      <div className="date-range">
                        <FilterDateInput
                          className="input"
                          {...endDateInputProps}
                          {...startDateInputProps}
                          value={dateValue}
                          placeholder="Select date range"
                        />
                      </div>
                    )}
                  </DateRangePicker>
                </div>
              ) : null}
            </div>

            {/* {active === "all" || active === "pending" ? ( */}
            <div
              className="duelSelect"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {active === "all" || active === "pending" ? (
                <Button className="CreateNewBtn" onClick={handleOpenModal}>
                  Create New Order <i className="flaticon-plus"></i>
                </Button>
              ) : (
                <div></div>
              )}
              <DownloadOption
                orders={orders}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </div>
            {/* ) : null} */}
            {active === "shipped" && (
              <div className="duelSelect d_flex">
                {/* new Design */}
                <select
                  name=""
                  defaultValue=""
                  displayEmpty
                  onChange={handleCourierTypeChange}
                >
                  <option value="" disabled>
                    Select Courier Provider
                  </option>
                  <option value="steadfast"> Steadfast Courier</option>
                  <option value="pathao">Pathao Courier</option>
                </select>
              </div>
            )}

            {/* active === "confirmed" || */}
            {active === "confirmed" || active === "follow_up" ? (
              <div className="duelSelect d_flex">
                <div className="react_Select_custom_date_select">
                  {shippingDateConfig ? (
                    active === "confirmed" ? (
                      <ReactSelect
                        options={confirmedOrderFilterOption}
                        onChange={event => handleSelected(event.value)}
                        placeholder="Find Your Shipping Order"
                      />
                    ) : null
                  ) : null}

                  {active === "follow_up" ? (
                    <ReactSelect
                      options={followUpOrderFilterOption}
                      onChange={event => handleSelected(event.value)}
                      placeholder="Find Your Follow Up Order"
                    />
                  ) : null}
                </div>
                <div>
                  {showPicker ? (
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      focus={focus}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                      locale={enGB}
                      modifiersClassNames={{ open: "-open" }}
                    >
                      {({ startDateInputProps, endDateInputProps }) => (
                        <div className="date-range">
                          <FilterDateInput
                            className="input"
                            {...endDateInputProps}
                            {...startDateInputProps}
                            value={dateValue}
                            placeholder="Select date range"
                          />
                        </div>
                      )}
                    </DateRangePicker>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="d-flex ">
            {active === "confirmed" && selectedOrders.length > 0 && (
              <div className="AllDelete d_flex">
                <Button className="bg">
                  {selectedOrders.length} Selected Item
                </Button>
                <div className="Status">
                  <div className="commonDropdown">
                    <Button
                      id="fade-button-0"
                      aria-controls={anchorEls[0] ? "fade-menu-0" : undefined}
                      aria-haspopup="true"
                      aria-expanded={anchorEls[0] ? "true" : undefined}
                      onClick={event => handleClick1(event, 0)}
                    >
                      Select Courier
                      <i className="flaticon-arrow-down-sign-to-navigate"></i>
                    </Button>
                    <Menu
                      id="fade-menu-0"
                      className="commonDropdownUl"
                      MenuListProps={{
                        "aria-labelledby": "fade-button-0",
                      }}
                      anchorEl={anchorEls[0]}
                      open={Boolean(anchorEls[0])}
                      onClose={() => handleClose1(0)}
                    >
                      {activeCouriers.length > 0 ? (
                        <>
                          {hasSteadfast && (
                            <MenuItem
                              onClick={() => {
                                multiSelectOrdersCouriers("steadfast");
                                handleClose();
                              }}
                            >
                              <img
                                src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                                alt=""
                                style={{ width: "20px", margin: "5px" }}
                              />
                              SteadFast
                            </MenuItem>
                          )}

                          {hasRedx && (
                            <MenuItem
                              onClick={() => {
                                multiSelectOrdersCouriers("redx");
                                handleClose();
                              }}
                            >
                              <img
                                src="https://redx.com.bd/images/favicon.png"
                                alt=""
                                style={{ width: "20px", margin: "5px" }}
                              />
                              Redx
                            </MenuItem>
                          )}
                        </>
                      ) : (
                        <MenuItem
                          onClick={() => {
                            courierReDriect();
                            handleClose();
                          }}
                        >
                          Add Courier
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                </div>
                <Link href={href}>
                  <Button className="bg">
                    Invoice Print <i class="flaticon-printer"></i>
                  </Button>
                </Link>

                <div className="Status">
                  <div className="commonDropdown">
                    <Button
                      id="status-button"
                      aria-controls={
                        dropdownAnchors.statusMenu ? "status-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={Boolean(dropdownAnchors.statusMenu)}
                      onClick={e => openDropdown(e, "statusMenu")}
                    >
                      Select Status
                      <i className="flaticon-arrow-down-sign-to-navigate"></i>
                    </Button>

                    <Menu
                      id="status-menu"
                      className="commonDropdownUl"
                      MenuListProps={{
                        "aria-labelledby": "status-button",
                      }}
                      anchorEl={dropdownAnchors.statusMenu}
                      open={Boolean(dropdownAnchors.statusMenu)}
                      onClose={() => closeDropdown("statusMenu")}
                    >
                      {multiStatus.map((item, index) => (
                        <MenuItem
                          key={item.value}
                          value={item.value}
                          selected={item.value === order?.order_status}
                          onClick={() => {
                            handleMultiStatusChange(
                              { target: { value: item.value } },
                              selectedOrders
                            );
                            closeDropdown("statusMenu"); // optional: close menu after select
                          }}
                        >
                          {item.item}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className=" OrderTabs CommonTab">
            <Box sx={{ width: "100%", typography: "body1" }}>
              {selectCourier === "steadfast" && (
                <BootstrapButton className={"filterActive"}>
                  <img
                    src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                    alt=""
                    style={{
                      width: "20px",
                      height: "auto",
                      margin: "5px",
                    }}
                  />
                  Steadfast
                  <h6>
                    {pendingOrderCount?.steadfast > 0
                      ? pendingOrderCount?.steadfast
                      : "0"}
                  </h6>
                </BootstrapButton>
              )}
              {selectCourier === "pathao" && (
                <BootstrapButton className={"filterActive"}>
                  <img
                    src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                    alt=""
                    style={{
                      width: "20px", // Adjust the width as desired
                      height: "auto", // Set height to 'auto' to maintain aspect ratio
                      margin: "5px", // Adjust the margin value as desired
                    }}
                  />
                  Pathao
                  <h6>
                    {pendingOrderCount?.pathao > 0
                      ? pendingOrderCount?.pathao
                      : "0"}
                  </h6>
                </BootstrapButton>
              )}
            </Box>
          </div>

          <div className=" OrderTabs CommonTab">
            <Box sx={{ width: "100%", typography: "body1" }}>
              {selectCourier === "steadfast" &&
                Object?.entries(pendingOrderCount?.steadfast_status || {}).map(
                  ([field, value]) => {
                    return (
                      <BootstrapButton
                        key={field}
                        onClick={() => {
                          setSelectCourierStatus(field);
                          // handleFilterStatusCOurier(field);
                        }}
                        className={"filterActive"}
                      >
                        {courierStatusFormate(field)}
                        <h6>{value}</h6>
                      </BootstrapButton>
                    );
                  }
                )}
              {selectCourier === "pathao" &&
                Object?.entries(pendingOrderCount?.pathao_status || {}).map(
                  ([field, value]) => {
                    return (
                      <BootstrapButton
                        key={field}
                        onClick={() => {
                          setSelectCourierStatus(field);
                          // handleFilterStatusCOurier(field);
                        }}
                        className={"filterActive"}
                      >
                        {courierStatusFormate(field)}
                        <h6>{value}</h6>
                      </BootstrapButton>
                    );
                  }
                )}
            </Box>
          </div>

          <div className="DataTableContent">
            <div className="DataTable">
              {/* DataTableRow */}
              <div className="DataTableRow">
                <div className="DataTableColum">
                  {active === "confirmed" && (
                    <Checkbox
                      {...label}
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  )}
                </div>

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

                <div className="DataTableColum Address">
                  <h3>Delivery Score</h3>
                </div>

                {/* <div className="DataTableColum">
                  <h3>Order Source</h3>
                </div> */}
                {active !== "shipped" && (
                  <div className="DataTableColum">
                    <h3>Discount</h3>
                  </div>
                )}
                {active !== "shipped" && (
                  <div className="DataTableColum">
                    <h3>Total Price</h3>
                  </div>
                )}

                {active !== "shipped" && advancedPaymentConfig && (
                  <div className="DataTableColum">
                    <h3>Advanced</h3>
                  </div>
                )}
                {active === "shipped" && (
                  <div className="DataTableColum Address">
                    <h3>Payment Info</h3>
                  </div>
                )}
                {active !== "shipped" && (
                  <div className="DataTableColum">
                    <h3>Due</h3>
                  </div>
                )}
                {active === "confirmed" && (
                  <>
                    <div className="DataTableColum">
                      <h3>Invoice</h3>
                    </div>
                    <div className="DataTableColum Address">
                      <h3>Select Courier</h3>
                    </div>

                    {/* <th width={20}>Select Courier</th> */}
                  </>
                )}
                {/* || active === "confirmed" */}
                {(shippingDateConfig && active === "confirmed") ||
                active === "follow_up" ? (
                  <div className="DataTableColum">
                    <h3>
                      {active === "confirmed"
                        ? "Shipping Date"
                        : "Follow Up Date"}
                    </h3>
                  </div>
                ) : null}
                {active === "shipped" && (
                  <>
                    <div className="DataTableColum">
                      <h3>Courier Provider</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Courier Status</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Courier ID</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Tracking Link</h3>
                    </div>
                  </>
                )}
                {active === "delivered" || active === "returned" ? (
                  <React.Fragment>
                    <div className="DataTableColum">
                      <h3>Courier ID</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Tracking Link</h3>
                    </div>
                  </React.Fragment>
                ) : null}
                {(active === "pending" ||
                  active === "follow_up" ||
                  active === "all" ||
                  active === "hold_on" ||
                  active === "cancelled") && (
                  <div className={`DataTableColum `}>
                    <h3>Status</h3>
                  </div>
                )}
                {active === "delivered" && (
                  <div className="DataTableColum">
                    <h3>Delivery Providers</h3>
                  </div>
                )}
                <div className="DataTableColum">
                  <h3>Notes</h3>
                </div>

                {(active === "pending" ||
                  active === "unverified" ||
                  active === "all" ||
                  active === "follow_up" ||
                  active === "shipped" ||
                  active === "confirmed" ||
                  active === "hold_on" ||
                  active === "delivered" ||
                  active === "cancelled" ||
                  active === "returned") && (
                  <div className="DataTableColum">
                    <h3>Action</h3>
                  </div>
                )}
              </div>

              {/* DataTableRow */}
              {/* item */}

              {apiResponse ? (
                orders?.length > 0 ? (
                  orders.map((order, index) => {
                    return (
                      <div className="DataTableRow" key={index}>
                        <div className="DataTableColum">
                          {active === "confirmed" && (
                            <Checkbox
                              {...label}
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleOrderSelection(order.id)}
                            />
                          )}
                        </div>

                        <div className="DataTableColum">
                          <div className="number">
                            {index + 1 + currentPage * perPage - perPage}
                          </div>
                        </div>

                        <div className="DataTableColum">
                          <Link href={`/order-details?id=${order?.id}`}>
                            <div className="orderColor">
                              <Tooltip
                                title={order?.order_no}
                                placement="top-start"
                              >
                                <span>
                                  {order?.order_no?.length < 12 ? (
                                    <span>#{order?.order_no}</span>
                                  ) : (
                                    <span>
                                      #{order?.order_no?.slice(0, 13)}
                                      ...
                                    </span>
                                  )}
                                </span>
                              </Tooltip>
                            </div>
                          </Link>
                          <p>{moment(order?.created_at).format("h:mm a")}</p>
                          <p>{moment(order?.created_at).format("DD.MM.YY")}</p>
                          <p
                            className="TotalPrice"
                            style={{ color: orderType(order?.order_type) }}
                          >
                            {Capitalized(order?.order_type)}
                          </p>
                        </div>

                        <div className="DataTableColum Address">
                          <div className="Name">
                            <div className="icon">
                              <i className="flaticon-user"></i>
                            </div>
                            <Tooltip
                              title={order?.customer_name}
                              placement="top-start"
                            >
                              <span>
                                {order?.customer_name?.length < 12 ? (
                                  <span>{order?.customer_name}</span>
                                ) : (
                                  <span>
                                    {order?.customer_name?.slice(0, 13)}
                                    ...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </div>

                          <div className="Name PhoneNumber">
                            <div className="icon">
                              <i className="flaticon-phone-call"></i>
                            </div>
                            <Link href={`tel:${order?.phone}`}>
                              {removeTextFromNumber(order?.phone, "+88")}
                            </Link>
                          </div>

                          <div className="Name">
                            <div className="icon">
                              <i className="flaticon-location"></i>
                            </div>
                            <p>
                              <Tooltip
                                title={order?.address}
                                placement="top-start"
                              >
                                <span>
                                  {order?.address?.length < 15 ? (
                                    <span>{order?.address}</span>
                                  ) : (
                                    <span>
                                      {order?.address?.slice(0, 13)}
                                      ...
                                    </span>
                                  )}
                                </span>
                              </Tooltip>
                            </p>
                          </div>
                          {busInfo?.order_attach_img_perm ? (
                            order?.order_attach_images?.length > 0 ? (
                              <div className="Name">
                                <div className="icon">
                                  <i className="flaticon-link"></i>
                                </div>

                                <AvatarGroup>
                                  {order.order_attach_images &&
                                    order.order_attach_images.map(
                                      (image, index) => {
                                        return (
                                          <Avatar
                                            alt={`Product ${index + 1}`}
                                            src={image}
                                          />
                                        );
                                      }
                                    )}
                                </AvatarGroup>
                              </div>
                            ) : null
                          ) : null}
                        </div>

                        <div className="DataTableColum">
                          <div className="Name">
                            <Tooltip
                              title={
                                order?.order_details[0]?.product
                                  ? order?.order_details?.map((item, index) => {
                                      return (
                                        <ul>
                                          <li>
                                            {" "}
                                            {index + 1} .{item?.product} -
                                            {item?.variant !== null &&
                                              `(${
                                                item?.variant !== null
                                                  ? item?.variations?.variant
                                                  : ""
                                              })`}
                                          </li>
                                        </ul>
                                      );
                                    })
                                  : "N/A"
                              }
                              placement="top-start"
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItem: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {order?.order_details[0]?.product?.length <
                                15 ? (
                                  <span>
                                    {order?.order_details[0]?.product}
                                  </span>
                                ) : (
                                  <span>
                                    {order?.order_details[0]?.product?.slice(
                                      0,
                                      13
                                    )}
                                    ...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </div>
                          <div className="Quantity">
                            {/* variant: */}
                            <span>
                              {order?.order_details[0]?.variant !== null
                                ? order?.order_details[0]?.variations?.variant
                                : null}
                            </span>
                          </div>

                          <div className="Price">
                            <i className="flaticon-taka"></i>
                            {order?.order_details[0]?.variant !== null
                              ? order?.order_details[0]?.variations?.price
                              : order?.order_details[0]?.price}
                            .00
                          </div>

                          <div className="Quantity">
                            Quantity:
                            <span>
                              {order?.order_details?.reduce(
                                (prevVal, currentVal) => {
                                  return prevVal + currentVal?.quantity;
                                },
                                0
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="DataTableColum Address">
                          {order?.fraud_info?.fraud_processing ? (
                            <Image
                              src={searchAnimation}
                              alt="Search Animation"
                              width={40}
                              height={40}
                            />
                          ) : (
                            // <SearchIcon/>
                            <>
                              <div className="Name">
                                <div>Return :</div>
                                <span style={{ color: "red" }}>
                                  {" "}
                                  {order?.fraud_info?.fraud_return}
                                </span>
                              </div>
                              <div className="Name PhoneNumber">
                                <div style={{ color: "black" }}>
                                  Delivery  :
                                </div>
                                {order?.fraud_info?.fraud_delivery}
                              </div>

                              <div className="Name">
                                <div>Entry :</div>
                                <p>{order?.fraud_info?.fraud_entry}</p>
                              </div>
                              <div className="Name">
                                <div>Success :</div>
                                <p
                                  style={
                                    calculateDeliveryPercentage(
                                      parseInt(
                                        order?.fraud_info?.fraud_delivery
                                      ),
                                      parseInt(order?.fraud_info?.fraud_return),
                                      parseInt(order?.fraud_info?.fraud_entry)
                                    ) < 70 &&
                                    calculateDeliveryPercentage(
                                      parseInt(
                                        order?.fraud_info?.fraud_delivery
                                      ),
                                      parseInt(order?.fraud_info?.fraud_return),
                                      parseInt(order?.fraud_info?.fraud_entry)
                                    ) > 0
                                      ? { color: "red" }
                                      : { color: "green" }
                                  }
                                >
                                  {calculateDeliveryPercentage(
                                    parseInt(order?.fraud_info?.fraud_delivery),
                                    parseInt(order?.fraud_info?.fraud_return),
                                    parseInt(order?.fraud_info?.fraud_entry)
                                  )}
                                  %
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        {/* <div className="DataTableColum">
                        <div
                          className="TotalPrice"
                          style={{ color: orderType(order?.order_type) }}
                        >
                          {Capitalized(order?.order_type)}
                        </div>
                      </div> */}

                        {/* {active === 'pending' ?
                            <input key={order.id} type="text" defaultValue={order?.discount}
                                onKeyDown={(event => handleDiscount(event, order?.id, order?.order_status))} />
                            :
                            <span>{order?.discount}</span>
                        } */}

                        {active !== "shipped" && (
                          <div className="DataTableColum">
                            <div className="Discount">
                              {active === "pending" ? (
                                <>
                                  <div className="inputTaka">
                                    <i className="flaticon-taka"></i>
                                  </div>
                                  <input
                                    key={order.id}
                                    type="text"
                                    defaultValue={
                                      order.discount_type === "percent"
                                        ? order?.discount + "%"
                                        : order?.discount
                                    }
                                    onKeyDown={event =>
                                      handleDiscount(
                                        event,
                                        order?.id,
                                        order?.order_status
                                      )
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  <i className="flaticon-taka"></i>
                                  {order?.discount_type === "percent"
                                    ? order?.discount + "%"
                                    : order?.discount}
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {active !== "shipped" && (
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              <i className="flaticon-taka"></i>
                              {order?.grand_total}
                            </div>
                          </div>
                        )}

                        {active !== "shipped" && advancedPaymentConfig && (
                          <>
                            {active === "pending" ? (
                              <div className="DataTableColum">
                                <div className="Discount">
                                  <div className="inputTaka">
                                    <i className="flaticon-taka"></i>
                                  </div>
                                  <input
                                    key={order.id}
                                    type="text"
                                    defaultValue={order?.advanced}
                                    onKeyDown={event =>
                                      handleAdvancedPayment(event, order?.id)
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="DataTableColum">
                                <div className="TotalPrice">
                                  <i className="flaticon-taka"></i>
                                  {order?.advanced}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {active === "shipped" && (
                          <div className="DataTableColum Address PaymentInfo">
                            <div className="TotalPrice">
                              <span>Price</span> :
                              <i
                                className="flaticon-taka"
                                style={{ marginRight: "-4px" }}
                              ></i>
                              {order?.grand_total}
                            </div>

                            <div className="TotalPrice">
                              <span> Dis.</span> :{" "}
                              <i
                                className="flaticon-taka"
                                style={{ marginRight: "-4px" }}
                              ></i>
                              {order?.discount}
                            </div>

                            <div className="TotalPrice">
                              <span>Adv.</span> :
                              <i
                                className="flaticon-taka"
                                style={{ marginRight: "-4px" }}
                              ></i>{" "}
                              {order?.advanced}
                            </div>
                            <div className="TotalPrice">
                              <span>Due.</span> :
                              <i
                                className="flaticon-taka"
                                style={{ marginRight: "-4px" }}
                              ></i>{" "}
                              {order?.due}
                            </div>
                          </div>
                        )}
                        {active !== "shipped" ? (
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              <i className="flaticon-taka"></i>
                              {order?.due}
                            </div>
                          </div>
                        ) : null}

                        {active === "confirmed" && (
                          <>
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                <Button className="invoice">
                                  <Link
                                    target="_blank"
                                    href={"/invoice-one/" + order?.id}
                                    rel="noopener noreferrer"
                                  >
                                    <i className="flaticon-printer" /> Print
                                  </Link>
                                </Button>
                              </div>
                            </div>
                            <div
                              className="DataTableColum Address"
                              key={order.id}
                            >
                              <div className="Status">
                                <div className="commonDropdown">
                                  <FormControl
                                    sx={{ m: 1, width: 150 }}
                                    key={order.id}
                                  >
                                    <Select
                                      value={courierViewValue}
                                      displayEmpty
                                      defaultValue={selectedStatus}
                                      onChange={event =>
                                        courierSubmit(event, order?.id)
                                      }
                                      input={<OutlinedInput />}
                                      inputProps={{
                                        "aria-label": "Without label",
                                      }}
                                    >
                                      <MenuItem value="">
                                        <em>Select Status</em>
                                      </MenuItem>
                                      <MenuItem key={"office"} value={"office"}>
                                        <i
                                          style={{
                                            width: "20px",
                                            height: "auto",
                                            margin: "5px",
                                          }}
                                          className="flaticon-people"
                                        ></i>
                                        Office Delivery
                                      </MenuItem>
                                      {courierList.length > 0 ? (
                                        courierList.map(item => {
                                          return (
                                            <MenuItem
                                              key={item?.id}
                                              value={item?.provider}
                                            >
                                              {item?.provider ===
                                              "steadfast" ? (
                                                <>
                                                  <img
                                                    src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                                                    alt=""
                                                    style={{
                                                      width: "20px",
                                                      height: "auto",
                                                      margin: "5px",
                                                    }}
                                                  />
                                                  SteadFast
                                                </>
                                              ) : item?.provider ===
                                                "pathao" ? (
                                                <>
                                                  <img
                                                    src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                                                    alt=""
                                                    style={{
                                                      width: "20px",
                                                      height: "auto",
                                                      margin: "5px",
                                                    }}
                                                  />
                                                  Pathao
                                                </>
                                              ) : item?.provider === "redx" ? (
                                                <>
                                                  <img
                                                    src="https://redx.com.bd//images/favicon.png"
                                                    alt=""
                                                    style={{
                                                      width: "20px",
                                                      height: "auto",
                                                      margin: "5px",
                                                    }}
                                                  />
                                                  Redx
                                                </>
                                              ) : null}
                                            </MenuItem>
                                          );
                                        })
                                      ) : (
                                        <MenuItem
                                          key={"redriect-courier"}
                                          value={"redriect-courier"}
                                        >
                                          <i
                                            style={{
                                              width: "20px",
                                              height: "auto",
                                              margin: "5px",
                                            }}
                                            className="flaticon-courier"
                                          ></i>
                                          Add Courier
                                        </MenuItem>
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {active === "follow_up" && (
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              <MobileDatePicker
                                defaultValue={dayjs(order?.follow_up_date)}
                                sx={{
                                  "& .MuiInputBase-input": {
                                    fontSize: "11px",
                                    padding: "0",
                                  },
                                }}
                                key={order?.id}
                                onChange={e => setFollowUpDate(dayjs(e))}
                                onAccept={() =>
                                  onChangeDate(order?.id, "follow_up")
                                }
                              />
                            </div>
                          </div>
                        )}

                        {shippingDateConfig ? (
                          active === "confirmed" ? (
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                <MobileDatePicker
                                  defaultValue={
                                    order?.confirmed_date !== null
                                      ? dayjs(order?.confirmed_date)
                                      : dayjs(
                                          moment(order?.updated_at).format(
                                            "YYYY-MM-DD"
                                          )
                                        )
                                  }
                                  sx={{
                                    "& .MuiInputBase-input": {
                                      fontSize: "11px",
                                      padding: "0",
                                    },
                                  }}
                                  key={order?.id}
                                  onChange={e => setFollowUpDate(dayjs(e))}
                                  onAccept={() =>
                                    onChangeDate(order?.id, "confirmed")
                                  }
                                />
                              </div>
                            </div>
                          ) : null
                        ) : null}
                        {active === "shipped" && (
                          <>
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                {/* <i className='flaticon-taka'></i> */}
                                {order?.courier_provider === "steadfast" ? (
                                  <>
                                    <img
                                      src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                                      alt=""
                                      style={{
                                        width: "20px", // Adjust the width as desired
                                        height: "auto", // Set height to 'auto' to maintain aspect ratio
                                        margin: "5px", // Adjust the margin value as desired
                                      }}
                                    />
                                    SteadFast
                                  </>
                                ) : order?.courier_provider === "pathao" ? (
                                  <>
                                    <img
                                      src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                                      alt=""
                                      style={{
                                        width: "20px", // Adjust the width as desired
                                        height: "auto", // Set height to 'auto' to maintain aspect ratio
                                        margin: "5px", // Adjust the margin value as desired
                                      }}
                                    />
                                    Pathao
                                  </>
                                ) : order?.courier_provider === "redx" ? (
                                  <>
                                    <img
                                      src="https://redx.com.bd//images/favicon.png"
                                      alt=""
                                      style={{
                                        width: "20px", // Adjust the width as desired
                                        height: "auto", // Set height to 'auto' to maintain aspect ratio
                                        margin: "5px", // Adjust the margin value as desired
                                      }}
                                    />
                                    Redx
                                  </>
                                ) : (
                                  <div
                                    className="TrackingId"
                                    style={{ textAlign: "center" }}
                                  >
                                    N/A
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                {courierStatusFormate(order?.courier_status)}
                              </div>
                            </div>
                            <div className="DataTableColum">
                              <div className="TotalPrice ">
                                {order?.consignment_id ? (
                                  <div className="TrackingId">
                                    <Tooltip
                                      title={order?.consignment_id}
                                      placement="top-start"
                                    >
                                      <span>
                                        {order?.consignment_id?.length < 30 ? (
                                          <span>{order?.consignment_id}</span>
                                        ) : (
                                          <span>
                                            {order?.consignment_id?.slice(
                                              0,
                                              30
                                            )}
                                            ..
                                          </span>
                                        )}
                                      </span>
                                    </Tooltip>

                                    {/* {order?.consignment_id} */}
                                    {order?.consignment_id ? (
                                      <CopyIcon url={order?.consignment_id} />
                                    ) : null}
                                  </div>
                                ) : (
                                  <div
                                    className="TrackingId"
                                    style={{ textAlign: "center" }}
                                  >
                                    N/A
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                {/* <i className='flaticon-taka'></i> */}

                                {order?.courier_provider === "steadfast" ? (
                                  <Link
                                    href={`https://steadfast.com.bd/t/${order?.tracking_code}`}
                                    className="TrackingId"
                                    target="_blank"
                                  >
                                    {order?.tracking_code}
                                  </Link>
                                ) : order?.courier_provider === "pathao" ? (
                                  <Link
                                    href={`https://merchant.pathao.com/tracking?consignment_id=${order?.tracking_code}&phone=${order?.phone}`}
                                    className="TrackingId"
                                    target="_blank"
                                  >
                                    {order?.tracking_code}
                                  </Link>
                                ) : order?.courier_provider === "redx" ? (
                                  <Link
                                    href={`https://redx.com.bd/track-parcel/?trackingId=${order?.tracking_code}`}
                                    className="TrackingId"
                                    target="_blank"
                                  >
                                    {order?.tracking_code}
                                  </Link>
                                ) : (
                                  <div
                                    className="TrackingId"
                                    style={{ textAlign: "center" }}
                                  >
                                    N/A
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        {active === "delivered" || active === "returned" ? (
                          <React.Fragment>
                            <div className="DataTableColum">
                              <div className="TotalPrice ">
                                {order?.consignment_id ? (
                                  <div className="TrackingId">
                                    <Tooltip
                                      title={order?.consignment_id}
                                      placement="top-start"
                                    >
                                      <span>
                                        {order?.consignment_id?.length < 30 ? (
                                          <span>{order?.consignment_id}</span>
                                        ) : (
                                          <span>
                                            {order?.consignment_id?.slice(
                                              0,
                                              30
                                            )}
                                            ..
                                          </span>
                                        )}
                                      </span>
                                    </Tooltip>
                                    {order?.consignment_id ? (
                                      <CopyIcon url={order?.consignment_id} />
                                    ) : null}
                                  </div>
                                ) : (
                                  <div
                                    className="TrackingId"
                                    style={{ textAlign: "center" }}
                                  >
                                    N/A
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                {order?.tracking_code ? (
                                  order?.courier_provider === "steadfast" ? (
                                    <Link
                                      href={`https://steadfast.com.bd/t/${order?.tracking_code}`}
                                      className="TrackingId"
                                      target="_blank"
                                    >
                                      {order?.tracking_code}
                                    </Link>
                                  ) : order?.courier_provider === "pathao" ? (
                                    <Link
                                      href={`https://merchant.pathao.com/tracking?consignment_id=${order?.tracking_code}&phone=${order?.phone}`}
                                      className="TrackingId"
                                      target="_blank"
                                    >
                                      {order?.tracking_code}
                                    </Link>
                                  ) : order?.courier_provider === "redx" ? (
                                    <Link
                                      href={`https://redx.com.bd/track-parcel/?trackingId=${order?.tracking_code}`}
                                      className="TrackingId"
                                      target="_blank"
                                    >
                                      {order?.tracking_code}
                                    </Link>
                                  ) : (
                                    <div
                                      className="TrackingId"
                                      style={{ textAlign: "center" }}
                                    >
                                      N/A
                                    </div>
                                  )
                                ) : (
                                  <div
                                    className="TrackingId"
                                    style={{ textAlign: "center" }}
                                  >
                                    N/A
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        ) : null}

                        {((active === "pending" ||
                          active === "follow_up" ||
                          active === "follow_up" ||
                          active === "hold_on" ||
                          active === "cancelled") && (
                          <div className="DataTableColum Address">
                            <div className="Status ">
                              <FormControl sx={{ m: 1, width: 150 }}>
                                <Select
                                  displayEmpty
                                  value={order?.order_status}
                                  onChange={event =>
                                    handleStatusChange(event, order?.id)
                                  }
                                  input={<OutlinedInput />}
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  <MenuItem disabled value="">
                                    <em>Select Status</em>
                                  </MenuItem>
                                  {active === "pending" &&
                                    pendingStatusData.map((item, index) => (
                                      <MenuItem
                                        key={index}
                                        value={item.value}
                                        selected={
                                          item.value === order?.order_status
                                        }
                                      >
                                        {item.item}
                                      </MenuItem>
                                    ))}

                                  {active === "follow_up" &&
                                    followUpStatusData.map((status, index) => (
                                      <MenuItem
                                        key={index}
                                        value={status.value}
                                        selected={
                                          status.value === order?.order_status
                                        }
                                      >
                                        {status.item}
                                      </MenuItem>
                                    ))}

                                  {active === "hold_on" &&
                                    holdOnStatus.map((status, index) => (
                                      <MenuItem
                                        key={index}
                                        value={status.value}
                                        selected={
                                          status.value === order?.order_status
                                        }
                                      >
                                        {status.item}
                                      </MenuItem>
                                    ))}
                                  {active === "cancelled" &&
                                    cancelledOnStatusData.map(
                                      (status, index) => (
                                        <MenuItem
                                          key={index}
                                          value={status.value}
                                          selected={
                                            status.value === order?.order_status
                                          }
                                        >
                                          {status.item}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        )) ||
                          (active === "all" && (
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                {courierStatusFormate(order?.order_status)}
                              </div>
                            </div>
                          ))}
                        {active === "delivered" && (
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              {/* <i className='flaticon-taka'></i> */}
                              {order.courier_provider !== null ? (
                                order.courier_provider === "steadfast" ? (
                                  <>
                                    <img
                                      src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                                      alt=""
                                      style={{
                                        width: "20px",
                                        height: "auto",
                                        margin: "5px",
                                      }}
                                    />
                                    SteadFast
                                  </>
                                ) : order.courier_provider === "pathao" ? (
                                  <>
                                    <img
                                      src="https://funnelliner-bucket.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                                      alt=""
                                      style={{
                                        width: "20px",
                                        height: "auto",
                                        margin: "5px",
                                      }}
                                    />
                                    Pathao
                                  </>
                                ) : order.courier_provider === "redx" ? (
                                  <>
                                    <img
                                      src="https://redx.com.bd//images/favicon.png"
                                      alt=""
                                      style={{
                                        width: "20px",
                                        height: "auto",
                                        margin: "5px",
                                      }}
                                    />
                                    Redx
                                  </>
                                ) : null
                              ) : (
                                "Office Delivery"
                              )}
                            </div>
                          </div>
                        )}

                        <div key={order?.id} className="DataTableColum">
                          <div
                            className="Note"
                            style={{
                              display: "flex",
                              alignItem: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              key={order?.id}
                              onClick={() =>
                                handleOpenOrderNoteModal(
                                  order?.id,
                                  order?.order_note
                                )
                              }
                            >
                              {getNoteDefaultValue(order?.order_note)}

                              {countNonNullFields(
                                order?.invoice_note,
                                order?.courier_note
                              ) > 0 && (
                                <h6>
                                  {countNonNullFields(
                                    order?.invoice_note,
                                    order?.courier_note
                                  )}
                                  <i class="flaticon-plus"></i>
                                </h6>
                              )}
                            </Button>
                            <Note
                              orderNote={order}
                              isOpenOrderNoteModal={isOpenOrderNoteModal}
                              handleCloseOrderNoteModal={
                                handleCloseOrderNoteModal
                              }
                              onChangeOrderNoteData={onChangeOrderNoteData}
                              orderIdOfModal={orderIdOfModal}
                              orderNo={order?.id}
                              status={order?.order_status}
                              handleFetch={handleFetch}
                              startLoading={startLoading}
                              stopLoading={stopLoading}
                            />
                          </div>
                        </div>
                        {active !== "trashed" ? (
                          <div className="DataTableColum">
                            <div className="Action">
                              <div className="commonDropdown">
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-menu"
                                >
                                  {popupState => (
                                    <>
                                      <Button {...bindTrigger(popupState)}>
                                        <BsThreeDotsVertical />
                                      </Button>
                                      <Menu
                                        id="fade-menu"
                                        className="commonDropdownUl"
                                        MenuListProps={{
                                          "aria-labelledby": "fade-button",
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        {...bindMenu(popupState)}
                                      >
                                        <MenuItem
                                          className="viewActionBtn"
                                          onClick={() => {
                                            router.push(
                                              `/order-details?id=${order?.id}`
                                            );
                                            popupState.close();
                                          }}
                                        >
                                          <i
                                            className="flaticon-view"
                                            style={{
                                              width: "20px",
                                              height: "auto",
                                              margin: "5px",
                                            }}
                                          />
                                          View
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            handleOrderUpdate(order?.id);
                                            setOrderId(order?.id);
                                            setOrderStatus(order?.status);
                                          }}
                                        >
                                          <i
                                            className="flaticon-edit"
                                            style={{
                                              width: "20px",
                                              height: "auto",
                                              margin: "5px",
                                            }}
                                          />
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            moveToTrash(order?.id);
                                            popupState.close();
                                          }}
                                        >
                                          <i
                                            className="flaticon-delete"
                                            style={{
                                              width: "20px",
                                              height: "auto",
                                              margin: "5px",
                                            }}
                                          />
                                          Move to Trash
                                        </MenuItem>
                                      </Menu>
                                    </>
                                  )}
                                </PopupState>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <table>
                    <tr>
                      <td colSpan={14}>
                        <section className="MiddleSection">
                          <div className="MiddleSectionContent">
                            <div className="img">
                              <img src="/images/empty.png" alt="" />
                            </div>

                            <div className="text">
                              <p>Not Found</p>
                            </div>
                          </div>
                        </section>
                      </td>
                    </tr>
                  </table>
                )
              ) : (
                <Box sx={{ width: "100%" }} spacing={2}>
                  {[...Array(15)].map((_, index) => (
                    <Skeleton key={index} />
                  ))}
                  <Skeleton />
                </Box>
              )}
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
                  {/* <InputLabel id="per-page-label">Items per page</InputLabel> */}
                  <Select
                    // labelId="per-page-label"
                    id="per-page-select"
                    value={perPage}
                    onChange={handlePerPageChange}
                    // label="Items per page"
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
        </Container>
      </section>
      <OrderModal
        imagePermetions={busInfo?.order_attach_img_perm}
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        products={products}
        handleFetch={handleFetch}
      />
      <ViewModal
        imagePermetions={busInfo?.order_attach_img_perm}
        key={order.id}
        order={order}
        handleCloseViewModal={handleCloseViewModal}
        status={orderStatus}
        viewModalOpen={viewOrderModal}
        handleFetch={handleFetch}
      />
      <OrderUpdateModal
        imagePermetions={busInfo?.order_attach_img_perm}
        key={order.id}
        order={order}
        products={products}
        orderId={orderId}
        modalOpenUpdate={modalOpenUpdate}
        handleCloseOrderUpdateModal={handleCloseOrderUpdateModal}
        handleFetch={handleFetch}
      />
      {cities && (
        <CourierModal
          handleCourierModalOpen={courierModal}
          handleCourierModalClose={handleCourierModalClose}
          city={cities}
          order_id={orderId}
        />
      )}
      {cities && (
        <CourierModal
          handleCourierModalOpen={courierModal}
          handleCourierModalClose={handleCourierModalClose}
          city={cities}
          order_id={orderId}
        />
      )}
      {redxModal.open && (
        <RedxCourierModel
          redxModal={redxModal}
          setRedxModal={setRedxModal}
          handleFetch={handleFetch}
        />
      )}
    </div>
  );
};
// export default index;
export default withAuth(OrderPage, {
  isProtectedRoute: true,
});
