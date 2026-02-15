import { Button, Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import "react-nice-dates/build/style.css";
import Swal from "sweetalert2";
import { headers } from "../../pages/api";
import AccountEdit from "./AccountEdit";
import CashIn from "./CashIn";
import CashOut from "./CashOut";
import FilterCategoryItem from "./FilterCategoryItem";
import FilterPaymentItem from "./FilterPaymentItem";
import FilterReceverItem from "./FilterReceverItem";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import DateWiseFilter from "./DateWiseFilter";
import AccountBalance from "./AccountBalance";

function formatDateToBST(date) {
  return date?.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
}
const AccountDashboard = ({ payment, setPayment, handleFetch }) => {
  const [search, setSearch] = useState("");
  const [dateWiseFilterOption, setDateWiseFilterOption] = useState("today");
  const [caseInPayableData, setCaseInPayableData] = useState([]);
  const [caseInLedgerData, setCaseInLedgerData] = useState([]);
  const [caseInPaymentMethodData, setCaseInPaymentMethodData] = useState([]);
  const [caseOutPayableData, setCaseOutPayableData] = useState([]);
  const [caseOutLedgerData, setCaseOutLedgerData] = useState([]);
  const [caseOutPaymentMethodData, setCaseOutPaymentMethodData] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState();
  const [filterEndDate, setFilterEndDate] = useState();
  const [cashInAndCashOutPayableData, setCashInAndCashOutPayableData] =
    useState([]);
  const [cashInAndCashOutLedgerData, setCashInAndCashOutLedgerData] = useState(
    []
  );
  const [
    cashInAndCashOutPaymentMethodData,
    setCashInAndCashOutPaymentMethodData,
  ] = useState([]);
  const [payable, setPayable] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [paymentItem, setPaymentItem] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [openCaseInModal, setOpenCaseInModal] = useState(false);
  const [openCashOutModal, setOpenCashOutModal] = useState(false);
  const [balance, setBalance] = useState({});

  //   delete
  const deletePayment = id => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(result => {
      if (result.isConfirmed) {
        const fetchDeleteApi = async () => {
          const deleteRes = await axios.get(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.DELETE_ACCOUNT}${id}`,
            {
              headers: headers,
            }
          );
          if (deleteRes?.data?.success) {
            setPayment(pd => {
              const filter = payment.filter(prod => {
                return prod.id !== id;
              });
              return [...filter];
            });
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          } else {
            Swal.fire("Deleted!", "Not Deleted", "error");
          }
        };
        fetchDeleteApi();
      }
    });
  };

  const handleFetchSearch = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.SEARCH_ACCOUNT}${search}`,
        headers: headers,
      });
      setPayment(data?.data?.data);
    } catch (err) {}
  }, [search]);

  const handleFetchMutiSearch = useCallback(async () => {
    const startDateWithOneDayAdded = formatDateToBST(filterStartDate); 
    const endDateWithOneDayAdded = formatDateToBST(filterEndDate);
    
    const params = {
      date: dateWiseFilterOption,
      payor: payable,
      ledger: ledger,
      payment: paymentItem,
      start_date: startDateWithOneDayAdded,
      end_date: endDateWithOneDayAdded,
    };

    if (
      dateWiseFilterOption === "custom" &&
      filterStartDate !== undefined &&
      filterEndDate !== undefined
    ) {
      try {
        let dataRes = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_MULTI_SEARCH}`,
          headers: headers,
          params,
        });

        if (dataRes?.data?.success) {
          setPayment(dataRes?.data?.data?.payments);
          setBalance(dataRes?.data?.data);
          handleFetch();
        }
      } catch (err) {
        // Handle the error here
      }
    } else if (
      dateWiseFilterOption === "today" ||
      dateWiseFilterOption == "yesterday" ||
      dateWiseFilterOption === "weekly" ||
      dateWiseFilterOption === "monthly"
    ) {
      try {
        const params = {
          date: dateWiseFilterOption,
          payor: payable,
          ledger: ledger,
          payment: paymentItem,
        };
        let dataRes = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_MULTI_SEARCH}`,
          headers: headers,
          params,
        });

        if (dataRes?.data?.success) {
          setPayment(dataRes?.data?.data?.payments);
          setBalance(dataRes?.data?.data);
          handleFetch();
        }
      } catch (err) {
        // Handle the error here
      }
    }
  }, [
    dateWiseFilterOption,
    payable,
    ledger,
    paymentItem,
    filterStartDate,
    filterEndDate,
  ]);

  const fetchCaseInPayableData = useCallback(async () => {
    const payableRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_PAYOR_LIST}?type=CashIn`,
      {
        headers: headers,
      }
    );

    if (payableRes?.data?.success === true && payableRes?.data?.data?.length) {
      const newPayableArr = [];
      payableRes?.data?.data?.forEach(item => {
        newPayableArr.push({ value: item?.id, label: item?.name });
      });
      newPayableArr.unshift({
        value: "addPayable",
        label: "+ Add New Payable/Payor",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutPayableData];
      setCaseInPayableData(newPayableArr);
      setCashInAndCashOutPayableData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseInPayableData([
        { value: "addPayable", label: "+ Add New Payable/Payor" },
      ]);
    }
  }, []);

  const fetchCaseInLedgerData = useCallback(async () => {
    const payableRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_LEDGER_LIST}?type=CashIn`,
      {
        headers: headers,
      }
    );

    if (payableRes?.data?.success === true && payableRes?.data?.data?.length) {
      const newPayableArr = [];
      payableRes?.data?.data?.forEach(item => {
        newPayableArr.push({ value: item?.id, label: item?.name });
      });
      newPayableArr.unshift({
        value: "add",
        label: "+ Add New Category/Ledger",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutLedgerData];
      setCaseInLedgerData(newPayableArr);
      setCashInAndCashOutLedgerData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseInLedgerData([
        { value: "add", label: "+ Add New Category/Ledger" },
      ]);
    }
  }, []);

  const fetchCaseInPaymentMethodData = useCallback(async () => {
    const payableRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_PAYMENT_METHOD_LIST}?type=CashIn`,
      {
        headers: headers,
      }
    );

    if (payableRes?.data?.success === true && payableRes?.data?.data?.length) {
      const newPayableArr = [];
      payableRes?.data?.data?.forEach(item => {
        newPayableArr.push({ value: item?.id, label: item?.name });
      });
      newPayableArr.unshift({
        value: "add",
        label: "+ Add New Payment Method",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutPaymentMethodData];
      setCaseInPaymentMethodData(newPayableArr);
      setCashInAndCashOutPaymentMethodData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseInPaymentMethodData([
        { value: "add", label: "+ Add New Payment Method" },
      ]);
    }
  }, []);

  const fetchCaseOutPayableData = useCallback(async () => {
    const payableRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_PAYOR_LIST}?type=CashOut`,
      {
        headers: headers,
      }
    );

    if (payableRes?.data?.success === true && payableRes?.data?.data?.length) {
      const newPayableArr = [];
      payableRes?.data?.data?.forEach(item => {
        newPayableArr.push({ value: item?.id, label: item?.name });
      });
      newPayableArr.unshift({
        value: "addPayable",
        label: "+ Add New Payable/Payor",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutPayableData];
      setCaseOutPayableData(newPayableArr);
      setCashInAndCashOutPayableData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseOutPayableData([
        { value: "addPayable", label: "+ Add New Payable/Payor" },
      ]);
    }
  }, []);

  const fetchCaseOutLedgerData = useCallback(async () => {
    const payableRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_LEDGER_LIST}?type=CashOut`,
      {
        headers: headers,
      }
    );

    if (payableRes?.data?.success === true && payableRes?.data?.data?.length) {
      const newPayableArr = [];
      payableRes?.data?.data?.forEach(item => {
        newPayableArr.push({ value: item?.id, label: item?.name });
      });
      newPayableArr.unshift({
        value: "add",
        label: "+ Add New Category/Ledger",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutLedgerData];
      setCaseOutLedgerData(newPayableArr);
      setCashInAndCashOutLedgerData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseOutLedgerData([
        { value: "add", label: "+ Add New Category/Ledger" },
      ]);
    }
  }, []);

  const fetchCaseOutPaymentMethodData = useCallback(async () => {
    const payableRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.GET_PAYMENT_METHOD_LIST}?type=CashOut`,
      {
        headers: headers,
      }
    );

    if (payableRes?.data?.success === true && payableRes?.data?.data?.length) {
      const newPayableArr = [];
      payableRes?.data?.data?.forEach(item => {
        newPayableArr.push({ value: item?.id, label: item?.name });
      });
      newPayableArr.unshift({
        value: "add",
        label: "+ Add New Payment Method",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutPaymentMethodData];
      setCaseOutPaymentMethodData(newPayableArr);
      setCashInAndCashOutPaymentMethodData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseOutPaymentMethodData([
        { value: "add", label: "+ Add New Payment Method" },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchCaseInLedgerData();
  }, [fetchCaseInLedgerData]);

  useEffect(() => {
    fetchCaseInPayableData();
  }, [fetchCaseInPayableData]);

  useEffect(() => {
    fetchCaseInPaymentMethodData();
  }, [fetchCaseInPaymentMethodData]);

  useEffect(() => {
    fetchCaseOutLedgerData();
  }, [fetchCaseOutLedgerData]);

  useEffect(() => {
    fetchCaseOutPayableData();
  }, [fetchCaseInPayableData]);

  useEffect(() => {
    fetchCaseOutPaymentMethodData();
  }, [fetchCaseInPaymentMethodData]);

  useEffect(() => {
    handleFetchMutiSearch();
  }, [handleFetchMutiSearch]);

  useEffect(() => {
    if (search?.length > 0) {
      handleFetchSearch();
    }
  }, [search]);


  return (
    <>
      <section className="AccountDashboard boxShadow">
        <div className="Selector d_flex">
          <DateWiseFilter
            setDateWiseFilterOption={setDateWiseFilterOption}
            dateWiseFilterOption={dateWiseFilterOption}
            filterStartDate={filterStartDate}
            setFilterStartDate={setFilterStartDate}
            filterEndDate={filterEndDate}
            setFilterEndDate={setFilterEndDate}
          />
        </div>

        <div className="Header">
          <AccountBalance balance={balance} />

          <div className="HeaderItemContent AccountCashIn">
            <Button onClick={() => setOpenCaseInModal(true)}>
              <span>Cash In</span> <img src="/images/money-down.png" alt="" />
            </Button>
          </div>

          <div className="HeaderItemContent AccountCashIn CashOut">
            <Button onClick={() => setOpenCashOutModal(true)}>
              {" "}
              <span>Cash Out</span> <img src="/images/money-up.png" alt="" />{" "}
            </Button>
          </div>
        </div>

        {/* AccountTable */}
        <div className="AccountTable Table">
          <div className="Filter d_flex d_justify">
            <div className="FilterItem">
              <select
                onChange={e => setDateWiseFilterOption(e.target.value)}
                name=""
              >
                <option value="">Select</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="FilterItem">
              <FilterReceverItem
                selectedItem={payable}
                setSelectedItem={setPayable}
                setBalance={setBalance}
                selectReciver={cashInAndCashOutPayableData}
                setPayment={setPayment}
                handleFetch={handleFetch}
              />
            </div>

            <div className="FilterItem">
              <FilterCategoryItem
                selectedItem={ledger}
                setSelectedItem={setLedger}
                setBalance={setBalance}
                selectCatgory={cashInAndCashOutLedgerData}
                setPayment={setPayment}
                handleFetch={handleFetch}
              />
            </div>

            <div className="FilterItem">
              <FilterPaymentItem
                selectedItem={paymentItem}
                setSelectedItem={setPaymentItem}
                setBalance={setBalance}
                selectPayment={cashInAndCashOutPaymentMethodData}
                setPayment={setPayment}
                handleFetch={handleFetch}
              />
            </div>

            <div className="FilterItem">
              <div className="Search">
                <input
                  type="text"
                  placeholder="Search Here..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search?.length ? (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSearch("");
                      handleFetchMutiSearch();
                    }}
                  >
                    <AiOutlineCloseCircle />
                  </div>
                ) : (
                  <AiOutlineSearch />
                )}
              </div>
            </div>
          </div>

          <div className="Table">
            <table>
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Date & Time</th>
                  <th>Description</th>
                  <th>Payable/Payor</th>
                  <th>Category/Ledger</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payment.length > 0 ? (
                  payment.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>#{item?.bill_no}</td>
                        <td>
                          {moment(item?.created_at).format("MMMM DD, YYYY")}
                        </td>

                        <Tooltip
                          title={item?.description}
                          placement="top-start"
                        >
                          <td>
                            {item?.description?.length < 15 ? (
                              <>{item?.description}</>
                            ) : (
                              <>
                                {item?.description?.slice(0, 13)}
                                ...
                              </>
                            )}
                          </td>
                        </Tooltip>
                        {/* <td>{item?.description}</td> */}
                        <td>{item?.payorName}</td>
                        <td>{item?.ledgerName}</td>
                        <td>
                          {item?.payment_type !== null
                            ? item?.payment_type
                            : "N/A"}
                        </td>
                        <td
                          style={
                            item.status !== "CashIn"
                              ? { color: "red" }
                              : { color: "green", fontWeight: 600 }
                          }
                        >
                          {item.status === "CashIn" ? "+" : "-"}
                          {item?.amount
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>

                        <td>
                          {item?.balance
                            ?.toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td>
                          <div className="action">
                            <Button
                              className="updateActionBtn"
                              onClick={() => {
                                setOpenEditModal(true);
                                setSelectedData(item);
                              }}
                            >
                              <i className="flaticon-edit"></i>
                            </Button>

                            <Button
                              onClick={() => deletePayment(item.id)}
                              className="deleteActionBtn"
                            >
                              <i className="flaticon-delete"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={20}>
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
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openEditModal ? (
          <AccountEdit
            data={selectedData}
            handleFetch={handleFetch}
            paymentMethodList={
              selectedData?.status === "CashIn"
                ? caseInPaymentMethodData
                : caseOutPaymentMethodData
            }
            payableList={
              selectedData?.status === "CashIn"
                ? caseInPayableData
                : caseOutPayableData
            }
            LedgerList={
              selectedData?.status === "CashIn"
                ? caseInLedgerData
                : caseOutLedgerData
            }
            handleFetchMutiSearch={handleFetchMutiSearch}
            openEditModal={openEditModal}
            closeEditModal={() => setOpenEditModal(false)}
            editData={selectedData}
          />
        ) : null}

        {openCaseInModal ? (
          <CashIn
            caseInPaymentMethodData={caseInPaymentMethodData}
            caseInPayableData={caseInPayableData}
            caseInLedgerData={caseInLedgerData}
            fetchCaseInPayableData={fetchCaseInPayableData}
            fetchCaseInLedgerData={fetchCaseInLedgerData}
            fetchCaseInPaymentMethodData={fetchCaseInPaymentMethodData}
            closeCaseInModal={() => setOpenCaseInModal(false)}
            openModal={openCaseInModal}
            handleFetchMutiSearch={handleFetchMutiSearch}
          />
        ) : null}

        {openCashOutModal ? (
          <CashOut
            caseOutPayableData={caseOutPayableData}
            caseOutLedgerData={caseOutLedgerData}
            caseOutPaymentMethodData={caseOutPaymentMethodData}
            fetchCaseOutPayableData={fetchCaseOutPayableData}
            fetchCaseOutLedgerData={fetchCaseOutLedgerData}
            fetchCaseOutPaymentMethodData={fetchCaseOutPaymentMethodData}
            closeCashOutModal={() => setOpenCashOutModal(false)}
            openModal={openCashOutModal}
            handleFetchMutiSearch={handleFetchMutiSearch}
          />
        ) : null}
      </section>
    </>
  );
};

export default AccountDashboard;
