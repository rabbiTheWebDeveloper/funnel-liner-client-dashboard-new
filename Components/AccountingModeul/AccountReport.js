import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import Fade from "@mui/material/Fade";
import axios from "axios";
import { enGB } from "date-fns/locale";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { BsCloudArrowDown } from "react-icons/bs";
import { TbCurrencyTaka } from "react-icons/tb";
import { DateRangePicker, END_DATE } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import * as XLSX from "xlsx";
import { headers } from "../../pages/api";
import FilterCategoryItem from "./FilterCategoryItem";
import FilterPaymentItem from "./FilterPaymentItem";
import FilterReceverItem from "./FilterReceverItem";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

function formatDateToBST(date) {
  return date?.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
}

const AccountExcelReport = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [fetchApi, setFetch] = useState(false);
  const [payment, setPayment] = useState([]);
  const [balance, setBalance] = useState({});
  const [update, setUpdate] = useState(false);
  const [filterOption, setOptionFilter] = useState("today");
  const [anchorEl, setAnchorEl] = useState(null);
  const [reciverList, setReciverList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [payable, setPayable] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [paymentItem, setPaymentItem] = useState([]);

  const [caseInPayableData, setCaseInPayableData] = useState([]);
  const [caseInLedgerData, setCaseInLedgerData] = useState([]);
  const [caseInPaymentMethodData, setCaseInPaymentMethodData] = useState([]);
  const [caseOutPayableData, setCaseOutPayableData] = useState([]);
  const [caseOutLedgerData, setCaseOutLedgerData] = useState([]);
  const [caseOutPaymentMethodData, setCaseOutPaymentMethodData] = useState([]);
  const [cashInAndCashOutPayableData, setCashInAndCashOutPayableData] =
    useState([]);
  const [cashInAndCashOutLedgerData, setCashInAndCashOutLedgerData] = useState(
    []
  );
  const [
    cashInAndCashOutPaymentMethodData,
    setCashInAndCashOutPaymentMethodData,
  ] = useState([]);

  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Custom Date
  const formatDate = date => {
    if (!date) return "";
    return date.toLocaleDateString();
  };
  const dateValue =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "";
  const handleFetch = () => {
    setFetch(true);
  };

  const balanceFetch = () => {
    setUpdate(true);
  };
  // const handleBalanceInfo = async () => {
  //     try {
  //         let data = await axios({
  //             method: "get",
  //             url: `${process.env.API_URL}/client/accounts/payment-calculation`,
  //             headers: headers,
  //         });
  //         // setBalance(data?.data?.data);
  //     } catch (err) {

  //     }
  // };

  // useEffect(() => {
  //     handleBalanceInfo();
  //     setUpdate(false)

  // }, [update]);

const handelPdf = () => {
  const doc = new jsPDF();

  doc.autoTable({
    theme: "grid",
    head: [
      [
        "SL.",
        "Bill No",
        "Date & Time",
        "Description",
        "Payable/Receivable",
        "Category/Ledger",
        "Status",
        "Payment Method",
        "Transaction",
        "Balance",
      ],
    ],
    body: payment?.map((item, index) => [
      index + 1,
      item?.bill_no,
      moment(item?.created_at).format("DD-MM-YYYY"),
      item?.description,
      item?.payorName,
      item?.ledgerName,
      item?.payment_type,
      item?.status,
      item?.status === "CashIn"
        ? "+" + item?.amount?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "-" + item?.amount?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      balance?.balance,
    ]),
    didDrawPage: data => {
      const title = "Transaction Report";
      const pageWidth = doc.internal.pageSize.width;
      doc.setFontSize(14);
      doc.text(title, pageWidth / 2, 10, { align: "center" });
    },
  });

  doc.save("data.pdf");
};

  // excel
  const generateExcelFile = data => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return file;
  };
  const downloadExcelFile = async () => {
    const file = generateExcelFile(payment);
    saveAs(file, "data.xlsx");
  };
  //    reciver list

  const handleFetchReciverList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/accounts/payor/list`,
        headers: headers,
      });
      setReciverList(data?.data?.data);
    } catch (err) {}
  };
  useEffect(() => {
    handleFetchReciverList();
  }, []);

  // cetogory list

  const handleFetchCategoryList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/accounts/ledger/list`,
        headers: headers,
      });
      setCategoryList(data?.data?.data);
    } catch (err) {}
  };
  useEffect(() => {
    handleFetchCategoryList();
  }, []);

  // payment list

  const handleFetchPaymentList = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/client/accounts/payment-method-show`,
        headers: headers,
      });
      setPaymentList(data?.data?.data);
    } catch (err) {}
  };
  useEffect(() => {
    handleFetchPaymentList();
  }, []);

  const handleFetchMutiSearch = useCallback(async () => {
    const startDateWithOneDayAdded = formatDateToBST(startDate); 
    const endDateWithOneDayAdded = formatDateToBST(endDate);

    const params = {
      date: filterOption,
      payor: payable,
      ledger: ledger,
      payment: paymentItem,
      start_date: startDateWithOneDayAdded,
      end_date: endDateWithOneDayAdded,
    };

    if (
      filterOption === "custom" &&
      startDate !== undefined &&
      endDate !== undefined
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
    }else if(filterOption === 'today' || filterOption == 'yesterday' || filterOption === 'weekly' || filterOption === 'monthly'){
      const params = {
        date: filterOption,
        payor: payable,
        ledger: ledger,
        payment: paymentItem,
      };
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
    }
  }, [filterOption, payable, ledger, paymentItem, startDate, endDate]);

  useEffect(() => {
    handleFetchMutiSearch();
  }, [handleFetchMutiSearch]);

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
        label: "+ Add New Category/Ledger",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutPaymentMethodData];
      setCaseInPaymentMethodData(newPayableArr);
      setCashInAndCashOutPaymentMethodData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseInPaymentMethodData([
        { value: "add", label: "+ Add New Category/Ledger" },
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
        label: "+ Add New Category/Ledger",
      });
      const allArr = [...newPayableArr, ...cashInAndCashOutPaymentMethodData];
      setCaseOutPaymentMethodData(newPayableArr);
      setCashInAndCashOutPaymentMethodData(allArr);
    }

    if (payableRes?.data?.success === true && !payableRes?.data?.data?.length) {
      setCaseOutPaymentMethodData([
        { value: "add", label: "+ Add New Category/Ledger" },
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

  return (
    <>
      <section className="AccountDashboard AccountPdfReport">
        <div className="Selector">
          <h4>Transactions Report </h4>
        </div>
        <div className="Selector d_flex">
          <Button
            className={filterOption === "today" && "active"}
            onClick={() => setOptionFilter("today")}
          >
            Today
          </Button>
          <Button
            className={filterOption === "yesterday" && "active"}
            onClick={() => setOptionFilter("yesterday")}
          >
            Yesterday
          </Button>
          <Button
            className={filterOption === "weekly" && "active"}
            onClick={() => setOptionFilter("weekly")}
          >
            This Week
          </Button>
          <Button
            className={filterOption === "monthly" && "active"}
            onClick={() => setOptionFilter("monthly")}
          >
            This Month
          </Button>
          <Button
            className={filterOption === "custom" && "active"}
            onClick={() => setOptionFilter("custom")}
          >
            Custom Date
          </Button>

          {filterOption === "custom" ? (
            <div className="FilterItem">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                // format='dd MMM yyyy'
                locale={enGB}
              >
                {({ startDateInputProps, endDateInputProps, focus }) => (
                  <div className="date-range">
                    <span className="date-range_arrow" />
                    <input
                      className={
                        "input" + (focus === END_DATE ? " -focused" : "")
                      }
                      {...endDateInputProps}
                      {...startDateInputProps}
                      placeholder="Custom Date Range"
                      value={dateValue}
                    />
                  </div>
                )}
              </DateRangePicker>
            </div>
          ) : null}
        </div>

        <div className="Header d_flex">
          {/* Item */}
          <div className="HeaderItemContent">
            <div className="HeaderItem d_flex">
              <div className="img">
                <img src="/images/account-plus.png" alt="" />
              </div>

              <div className="text">
                <h5>Cash In</h5>
                <h3>
                  <TbCurrencyTaka />
                  {balance?.cashIn
                    ? balance?.cashIn
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "00"}
                </h3>
              </div>

              <div className="overlay">
                <img src="/images/account-plus-overlay.png" alt="" />
              </div>
            </div>
          </div>

          {/* Item */}
          <div className="HeaderItemContent">
            <div className="HeaderItem Minus d_flex">
              <div className="img">
                <img src="/images/account-minus.png" alt="" />
              </div>

              <div className="text">
                <h5>Cash Out</h5>
                <h3>
                  <TbCurrencyTaka />
                  {balance?.cashOut
                    ? balance?.cashOut
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "00"}
                </h3>
              </div>

              <div className="overlay">
                <img src="/images/account-minus-overlay.png" alt="" />
              </div>
            </div>
          </div>

          {/* Item */}
          <div className="HeaderItemContent">
            <div className="HeaderItem Equal d_flex">
              <div className="img">
                <img src="/images/account-equal.png" alt="" />
              </div>

              <div className="text">
                <h5>Today’s Balance</h5>
                <h3>
                  <TbCurrencyTaka />
                  {balance?.balance
                    ? balance?.balance
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "00"}{" "}
                </h3>
              </div>

              <div className="overlay">
                <img src="/images/account-equal-overlay.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* AccountTable */}

        <div className="AccountTable">
          <div className="Filter d_flex">
            <h3>Accounting Modules</h3>

            <div className="FilterButton FilterItem">
              <Button className="active">All Item</Button>
            </div>

            <div className="FilterItem">
              <FilterReceverItem
                selectReciver={cashInAndCashOutPayableData}
                selectedItem={payable}
                setSelectedItem={setPayable}
                balanceFetch={balanceFetch}
                setBalance={setBalance}
                setPayment={setPayment}
                handleFetch={handleFetch}
              />
            </div>

            <div className="FilterItem">
              <FilterCategoryItem
                selectedItem={ledger}
                setSelectedItem={setLedger}
                balanceFetch={balanceFetch}
                setBalance={setBalance}
                setPayment={setPayment}
                handleFetch={handleFetch}
                selectCatgory={cashInAndCashOutLedgerData}
              />
            </div>

            <div className="FilterItem">
              <FilterPaymentItem
                selectedItem={paymentItem}
                setSelectedItem={setPaymentItem}
                balanceFetch={balanceFetch}
                setBalance={setBalance}
                selectPayment={cashInAndCashOutPaymentMethodData}
                setPayment={setPayment}
                handleFetch={handleFetch}
              />
            </div>
          </div>

          <div className="Table">
            <table>
              <thead>
                <tr>
                  <th>Bill No </th>
                  <th>Date & Time </th>
                  <th>Description</th>
                  <th>Payable/Payor</th>
                  <th>Payable/Receivable</th>
                  <th>Category/Ledger</th>
                  <th>Payment Method</th>
                  <th>Transaction</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                {payment.length > 0 ? (
                  payment.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>#{item?.bill_no}</td>
                        <td>{moment(item?.created_at).calendar()}</td>
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
                        <td>{item?.payorName}</td>
                        <td>{item?.payorName}</td>
                        <td>{item?.ledgerName}</td>
                        <td>
                          {item?.payment_type !== null
                            ? item?.payment_type
                            : null}
                        </td>
                        <td>
                          {item.status === "CashIn"
                            ? "+" +
                              item?.amount
                                ?.toFixed(0)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : "-" +
                              item?.amount
                                ?.toFixed(0)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td>
                          {item?.balance
                            ? item?.balance
                                .toFixed(0)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : "00"}
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
                            <img src="/error.svg" alt="" />
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

            <div className="DownloadPdf">
              <div className="Dropdown">
                <Button
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  Download <BsCloudArrowDown />
                </Button>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem
                    onClick={() => {
                      handelPdf();
                      handleClose();
                    }}
                  >
                    {" "}
                    Download PDF <img src="/images/pdf.png" alt="" />{" "}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      downloadExcelFile();
                      handleClose();
                    }}
                  >
                    {" "}
                    Download Excel <img src="/images/xls.png" alt="" />{" "}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountExcelReport;
