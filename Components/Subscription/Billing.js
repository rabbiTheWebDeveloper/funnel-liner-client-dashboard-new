import { Button, Container, Modal, Box } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-nice-dates/build/style.css";
import { headers } from "../../pages/api";
import SuperFetch from "../../hook/Axios";
import { useToast } from "../../hook/useToast";
import { useRouter } from "next/router";

const today = new Date().toISOString().slice(0, 10);

const Billing = ({ orderUpdate, billingList }) => {
  const showToast = useToast();
  const router = useRouter();
  const [isShowBillingPopup, setIsShowBillingPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState(0);
  const [invoiceNum, setInvoiceNum] = useState('');

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

  const makePayment = async paymentMethod => {
    setSelectedPayment(paymentMethod);
    const params = {
      amount: subscriptionAmount,
      order_type: "package",
      invoice_num: invoiceNum
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
      if (response.status === 200) {
        router.push(response.data).then(r => r);
      }
    } catch (err) {
      showToast(err?.message, "error");
    }
    setIsShowBillingPopup(false);
  };

  return (
    <div>
      <section className="DashboardSetting Order">
        {/* header */}
        {/* <HeaderDescription
          headerIcon={"flaticon-wallet"}
          title={"Billing"}
          subTitle={"Billing List"}
          search={false}
        /> */}

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
                                  marginRight: '10px'
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
  );
};
// export default index;
export default Billing;
