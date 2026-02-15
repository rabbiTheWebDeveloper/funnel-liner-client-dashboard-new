import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import axios from "axios";

const AsyncSearchBar = ({ setOrders, handleFilterStatusChange, setEnableGlobalSearch }) => {
  const [searchedData, setSearchedData] = useState([]);

  const CustomPaymentMethodOption = ({ data, selectOption }) => {
    return (
      <div className="custom_section_wrapper">
        <p onClick={() => selectOption(data)}> #{data.order_no}, {OrderStatusConverter(data.order_status)}, {data.customer_name}</p>
      </div>
    );
  };

  const loadOptions = async (inputValue) => {
    if (inputValue.length) {
      const searchDataArray = []
      const searchResponse = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.ORDER_GLOBAL_SEARCH}?search=${inputValue}`, { headers })
      if (searchResponse?.data.success) {
        setSearchedData(searchResponse?.data?.data)
        searchResponse?.data?.data?.forEach(item => {
          searchDataArray.push({ value: item?.id, order_no: item?.order_no, order_status: item.order_status, customer_name: item?.customer_name })
        });
        return searchDataArray
      }
    }
  };

  const OrderStatusConverter = (order_status) => {
    if (order_status === "pending") {
      return <span style={{ color: "#894BCA" }}>Pending</span>
    }
    if (order_status === "confirmed") {
      return <span style={{ color: "#894BCA" }}>Confirmed</span>
    }
    if (order_status === "shipped") {
      return <span style={{ color: "#894BCA" }}>Shipped</span>
    }
    if (order_status === "delivered") {
      return <span style={{ color: "#894BCA" }}>Delivered</span>
    }
    if (order_status === "cancelled") {
      return <span style={{ color: "red" }}>Cancelled</span>
    }
    if (order_status === "returned") {
      return <span style={{ color: "red" }}>Returned</span>
    }
    if (order_status === "follow_up") {
      return <span style={{ color: "#894BCA" }}>Follow Up</span>
    }
    if (order_status === "hold_on") {
      return <span style={{ color: "#894BCA" }}>Hold On</span>
    }
    if (order_status === "trashed") {
      return <span style={{ color: "red" }}>Trashed</span>
    }
  }

  const handleChange = (value) => {
    const filterOrder = searchedData.filter((item) => item?.id === value?.value);
    setOrders(filterOrder)
    handleFilterStatusChange(filterOrder[0].order_status)
    setEnableGlobalSearch(true)
  };

  return (
    <>
      <AsyncSelect loadOptions={loadOptions} defaultOptions onChange={(value) => handleChange(value)} hideSelectedOptions={false} components={{ Option: CustomPaymentMethodOption }} />
    </>
  );
};

export default AsyncSearchBar;