import {
  Box,
  Container,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import SuperFetch from "../../hook/Axios";
import { useToast } from "../../hook/useToast";
import { created, headers, nextDueDate, paymentStatus, userId } from "../../pages/api";
import style from "./style.module.css";
import moment from "moment";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const today = new Date().toISOString().slice(0, 10);


const newBill = [{
  "id": 308312053,
  "user_id": 2165,
  "trxid": " ",
  "invoice_num": "9407072912",
  "addons_id": null,
  "type": "package",
  "amount": 3000,
  "response": "{\"merchantId\":\"688100452557375\",\"orderId\":\"Inv20250129159689\",\"paymentRefId\":\"MDEyOTE1NTcxNzU5Ny42ODgxMDA0NTI1NTczNzUuSW52MjAyNTAxMjkxNTk2ODkuMDNkNDY1NDQwYmU1ODNjMjUxOWM=\",\"amount\":\"3000\",\"clientMobileNo\":\"018****6020\",\"merchantMobileNo\":\"01810045255\",\"orderDateTime\":\"2025-01-29 15:57:17.0\",\"issuerPaymentDateTime\":\"2025-01-29 15:58:13.0\",\"issuerPaymentRefNo\":\"73LW7H2F\",\"additionalMerchantInfo\":\"{\\\"amount\\\":\\\"3000\\\",\\\"addons_id\\\":null,\\\"order_type\\\":\\\"package\\\",\\\"user_id\\\":\\\"2165\\\",\\\"invoice_num\\\":\\\"94070729\\\",\\\"tnx_id\\\":\\\"13042\\\"}\",\"status\":\"Success\",\"statusCode\":\"000\",\"cancelIssuerDateTime\":null,\"cancelIssuerRefNo\":null,\"serviceType\":\"REGULAR_ECOM\"}",
  "status": "unpaid",
  "gateway": "",
  "sub_gateway": " ",
  "created_at": "2024-12-21T18:09:35.000000Z",
  "updated_at": "2025-12-21T09:58:13.000000Z",
  "package_id": 3,
  "due_date": "2024-12-22",
  "order_count": 1544,
  "addons": null
}]

const Subscription = ({
  merchant,
  handelFetchBusInfo,
  isApiResponse,
  ...props
}) => {
  const showToast = useToast();
  const router = useRouter();
  const [invoiceNum, setInvoiceNum] = useState("");
  const [isShowBillingPopup, setIsShowBillingPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState(0);
  const [orderCount, setOrderCount] = useState("0");
  const [unpaidBill, setUnpaidBill] = useState([]);
  const [billingList, setBillingList] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(router.query);
  const makePayment = async paymentMethod => {
    setSelectedPayment(paymentMethod);
    const params = {
      amount: subscriptionAmount,
      order_type: "package",
      invoice_num: invoiceNum,
    };

    const paymentEndpoints = {
      ssl: "/client/sslcommerze/pay",
      bkash: "/client/bkash/pay",
      nagad: "/client/nagad/pay",
    };

    try {
      const response = await SuperFetch.get(paymentEndpoints[paymentMethod], {
        params: params,
        headers: headers,
      });
      if (response.status) {
        router.push(response.data).then(r => r);
      }
    } catch (err) {
      showToast(err?.message, "error");
    }
    setIsShowBillingPopup(false);
  };

  const handleFetchBillingList = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.BILLING.GET_BILLING_LIST}`,
        headers: headers,
        params: { page: currentPage, perPage: perPage },
      });
      if (data?.data.success) {
        const unpaidList = data.data?.data?.filter(
          item => item.status === "unpaid"
        );
        setUnpaidBill(unpaidList);
        if(userId===2165){
          const updatedBillingList = [...newBill,...data.data?.data];
          setBillingList(updatedBillingList);
        }else{
          const updatedBillingList = data.data?.data;
          setBillingList(updatedBillingList);
        }
      
       
        setTotalPage(data.data?.last_page);
        setOrderCount(data?.data?.orders);
      }
    } catch (err) {}
  }, [perPage, currentPage]);

  const downloadInvoice = async (id, invoice) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/transaction/pdf/download/${id}`,
        { headers: headers, responseType: "blob" }
      );
      const blob = response.data;
      const objectURL = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectURL;
      downloadLink.download = `${invoice}_invoice.pdf`;
      downloadLink.click();
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  useEffect(() => {
    handleFetchBillingList();

    
  }, [handleFetchBillingList]);

  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
    setCount(1);
  };

  useEffect(() => {
    if (router.query.status === "pay" && unpaidBill[0]?.amount > 0) {
      setIsShowBillingPopup(true);
      setSubscriptionAmount(unpaidBill[0]?.amount);
      setInvoiceNum(unpaidBill[0]?.invoice_num);
    }
  }, [router.query, unpaidBill]);

  // useEffect(() => {
  //   setBillingList(prevBillingList => [...prevBillingList, ...newBill]);
  // }, []);

 

  return (
    <>
      <section className="TopSellingProducts DashboardSetting Courier Subscription">
        <HeaderDescription
          headerIcon={"flaticon-wallet"}
          title={"Billing"}
          subTitle={"Billing List"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          <Grid container spacing={3}>
        
            <Grid item xs={12} sm={6} md={4}>
              <div className="commonCart boxShadow cart-2">
                <div className={style.SubsHeight}>
                  <div className="header">
                    <h4>
                      <i className="flaticon-stock-market-1"></i> Monthly
                      Subscription Fee
                    </h4>
                  </div>

                  <div className="middle">
                    <h2>
                      {/* <i className="flaticon-taka"></i>
                                                2999 */}
                      Depends on your order.
                      <br />
                      Now Your Order is : {orderCount}
                    </h2>
                  </div>
                  <div className="list">
                    <ul>
                      <li>
                        Your Registration Date: <span>{created}</span>{" "}
                      </li>
                      <li>
                        Your Last Payment Date:{" "}
                        <span>
                          {moment(billingList[0]?.created_at).format(
                            "Do MMMM YYYY"
                          )}
                        </span>{" "}
                      </li>
                      <li className="nextPayment">
                        Next Due Date:{" "}
                        <span>
                          {moment(nextDueDate).format("Do MMMM YYYY")}
                        </span>{" "}
                      </li>
                      {unpaidBill.length > 0 &&
                        unpaidBill.map((item, index) => {
                          return (
                            <Button
                              className="bg"
                              onClick={() => {
                                setIsShowBillingPopup(true);
                                setSubscriptionAmount(item?.amount);
                                setInvoiceNum(item?.invoice_num);
                              }}
                              style={{ marginLeft: "10px" }}
                            >
                              Pay Now
                            </Button>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            </Grid>
            {/* } */}
          </Grid>
        </Container>
      </section>
      <div>
        <section className="DashboardSetting Order">
          <Container maxWidth="sm">
            <div className="Table">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Invoice</th>
                    <th>Bill Date</th>
                    <th>Transaction No</th>
                    <th>Gateway</th>
                    <th>Sub Gateway</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Download Invoice</th>
                  </tr>
                </thead>

                <tbody>
                  {billingList.length > 0 ? (
                    billingList.map((order, index) => {
                      return (
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          <td>#{order?.invoice_num}</td>

                          <td>
                            {order?.created_at?.slice(0, 10) >= today
                              ? moment(order?.created_at).fromNow()
                              : moment(order?.created_at).format("DD-MM-YYYY")}
                          </td>

                          <td>{order.trxid}</td>

                          <td>{order?.gateway}</td>
                          <td>{order?.sub_gateway}</td>
                          <td>{order?.type}</td>
                          <td>{order?.amount}</td>
                          <td>
                            {order?.order_count ? order?.order_count : "0"}
                          </td>
                          <td>{order?.status}</td>
                          <td>
                            <div
                            // style={{
                            //   display: "flex",
                            //   alignItems: "center",
                            //   width: '100%',

                            // }}
                            >
                              {order?.status === "unpaid" ? (
                                <Button
                                  onClick={() => {
                                    setIsShowBillingPopup(true);
                                    setSubscriptionAmount(order?.amount);
                                    setInvoiceNum(order?.invoice_num);
                                  }}
                                  style={{
                                    marginRight: "10px",
                                  }}
                                >
                                  Pay Now
                                </Button>
                              ) : null}

                              <Button
                                onClick={() =>
                                  downloadInvoice(order?.id, order?.invoice_num)
                                }
                              >
                                Download Invoice
                                {/* <i className="flaticon-printer /> */}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
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
                  )}
                </tbody>
              </table>
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
            </div>
            {/* <Paginator count={totalPage} page={currentPage} onChange={handleChange} showFirstButton
                        showLastButton variant="outlined" /> */}
          </Container>
        </section>

        {isShowBillingPopup ? (
          <Modal
            open={isShowBillingPopup}
            onClose={() => setIsShowBillingPopup(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="updateModal"
          >
            <Box className="modalBox">
              <div className="modalContent">
                <div className="header">
                  <div className="left">
                    <i className="flaticon-wallet" />
                    <h4>Select Payment Method</h4>
                  </div>

                  <div
                    className="right"
                    onClick={() => setIsShowBillingPopup(false)}
                  >
                    <i className="flaticon-close-1" />
                  </div>
                </div>

                <form action="">
                  <div className="updateModalForm">
                    <div className="SubscriptionModal">
                      <div className="PaymentType">
                        <label className="card">
                          <input
                            name="plan"
                            className="radio"
                            type="radio"
                            checked={selectedPayment === "bkash"}
                            value="bkash"
                            onChange={event =>
                              setSelectedPayment(event.target.value)
                            }
                          />
                          <img src="/images/payment-img/bkash.png" alt="" />
                        </label>

                        <label className="card">
                          <input
                            name="plan"
                            className="radio"
                            type="radio"
                            checked={selectedPayment === "nagad"}
                            value="nagad"
                            onChange={event =>
                              setSelectedPayment(event.target.value)
                            }
                          />
                          <img src="/images/payment-img/nagod.png" alt="" />
                        </label>

                        {/* <label className="card">
                        <input
                          name="plan"
                          className="radio"
                          type="radio"
                          checked={selectedPayment === "ssl"}
                          value="ssl"
                          onChange={event =>
                            setSelectedPayment(event.target.value)
                          }
                        />
                        <img src={"/images/payment-img/visa.png"} alt="" />
                      </label> */}
                      </div>

                      <div className="Review">
                        <h6>Review</h6>
                        <div className="SubscribeAmount">
                          <h4>Package Amount</h4>
                          <h3>
                            <i className="flaticon-taka" />
                            {subscriptionAmount}.00{" "}
                          </h3>
                        </div>
                      </div>

                      <div className="terms-condition">
                        <input type="checkbox" id="checkbox" checked />
                        <label for="checkbox">
                          By pressing “Continue” you agree to the{" "}
                          <Link
                            href="https://funnelliner.com/terms"
                            target="/blank"
                          >
                            Terms and Conditions
                          </Link>{" "}
                        </label>
                      </div>

                      <div className="duelButton">
                        <Button onClick={() => makePayment(selectedPayment)}>
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </Box>
          </Modal>
        ) : null}
      </div>
    </>
  );
};

export default Subscription;
