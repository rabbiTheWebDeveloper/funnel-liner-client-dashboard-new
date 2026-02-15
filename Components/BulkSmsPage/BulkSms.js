import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SuperFetch from "../../hook/Axios";
import { useToast } from "../../hook/useToast";
import { baseUrl, headers } from "../../pages/api";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import useLoading from "./../../hook/useLoading";
import Spinner from "./../commonSection/Spinner/Spinner";
import BulkSmsStatus from "./BulkSmsStatus";
import SMSTemplate from "./SMSTemplate";
import { sms_price } from "../../constant/bulksms";
import { fetcher } from "../DashboardV2/App/reports/_reports";
import useSWR from "swr";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const names = [
  { value: "delivered", name: "Delivered Order" },
  { value: "cancelled", name: "Cancelled Order" },
  { value: "follow_up", name: "Follow Up Order" },
  { value: "returned", name: "Returned Order" },
];
const BulkSms = ({ busInfo, handelFetchBusInfo }) => {
  const {
    data: smsInfo,
    error,
    mutate,
  } = useSWR(`/client/shop/sms_info`, fetcher);
  const smsData = smsInfo?.data || {};
  console.log("sms info data", smsData);
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const [AllNumber, setAllNumber] = useState([]);
  const [pending, setPending] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [text, setText] = useState("");
  const [paymentValue, setPaymentValue] = useState(0);
  const [openModal, setModalOpen] = useState(false);
  const handleCloseNote = () => setModalOpen(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [smsLength, setSmsLength] = useState(0);
  const bdNumbers = AllNumber?.filter(item =>
    personName.includes(item?.order_status)
  )
    ?.reduce((acc, current) => {
      const existingContact = acc.find(
        contact => contact?.phone === current?.phone
      );
      return existingContact ? acc : [...acc, current];
    }, [])
    ?.map(num => num?.phone)
    ?.map(number => number?.match(/^(\+?0{0,2}88)?(01\d{9})$/)?.[2])
    ?.filter(Boolean);

  const handlePaymentMethodSelect = event => {
    setSelectedPayment(event.target.value);
  };
  const handleChangeContent = e => {
    const smsContent = e.target.value;
    setText(smsContent);
    const banglaRegex = /[\u0980-\u09FF]+/;
    const isBangla = banglaRegex.test(smsContent);
    if (isBangla) {
      setSmsLength(Math.ceil(smsContent.length / 70));
    } else {
      setSmsLength(Math.ceil(smsContent.length / 160));
    }
  };
  const handleFetchSmsUser = async () => {
    try {
      const response = await SuperFetch.get("/client/smsuser", {
        headers: headers,
      });
      const data = response?.data?.data || [];
      const userProduct = data.filter(word => word?.order_status === "pending");

      setAllNumber(data);
      setPending(userProduct);
    } catch (err) {
      // Handle error
    }
  };

  const onSubmit = async data => {
    data.phone = data.phone.replace(/\s*,\s*/g, ",");
    const newddata = {
      phone: data.phone,
      msg: data.msg,
    };

    startLoading();
    if (data.phone.length < 15) {
      SuperFetch.post("/client/send-custom-sms", newddata, {
        headers: headers,
      })
        .then(function (response) {
          stopLoading();
          showToast(response.data.message);
          handelFetchBusInfo();
          mutate(`/client/shop/sms_info`);
        })
        .catch(function (error) {
          stopLoading();
          showToast(error?.msg, "error");
        });
    } else {
      SuperFetch.post("/client/send-custom-sms", newddata, {
        headers: headers,
      })
        .then(function (response) {
          stopLoading();
          showToast(response.data.message);
          handelFetchBusInfo();
          mutate(`/client/shop/sms_info`);
        })
        .catch(function (error) {
          stopLoading();
          showToast(error?.msg, "error");
        });
    }
    reset();
  };

  const handleChangeBulkSMS = async event => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const params = {
    amount: paymentValue,
    order_type: "sms",
  };

  const makePayment = async paymentMethod => {
    setSelectedPayment(paymentMethod);
    setModalOpen(false);

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
  };
  useEffect(() => {
    handleFetchSmsUser();
  }, []);
  return (
    <>
      <section className="DashboardSetting BulkSms">
        {/* header */}
        <HeaderDescription
          videoLink={{
            video:
              "https://www.youtube.com/embed/11ScSqlpuLM?si=ymipw9n4YKk8h9v3J",
            title: "How to use our one click bulk sms feature । Funnel Liner",
          }}
          headerIcon={"flaticon-mail"}
          title={"Bulk SMS"}
          subTitle={
            "Get SMS report, send messages in large range to your clients"
          }
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <div className="commonCart boxShadow cart-1">
                <div className="BulkSmsItem">
                  <div className="header">
                    <h4>
                      <i className="flaticon-stock-market-1"></i> Total SMS Sent
                    </h4>
                  </div>

                  <div className="middle">
                    <h3>
                      <i className="flaticon-mail"></i>
                      {smsData?.sms_sent >= 0 ? smsData?.sms_sent : 0}
                    </h3>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className="commonCart boxShadow cart-2">
                <div className="BulkSmsItem">
                  <div className="header">
                    <h4>
                      <i className="flaticon-stock-market-1"></i> Total SMS Cost
                      (BDT)
                    </h4>
                  </div>

                  <div className="middle">
                    <h3>
                      <i className="flaticon-mail"></i>
                      {smsData?.sms_sent >= 0
                        ? (smsData?.sms_sent * sms_price).toFixed(2)
                        : 0}
                    </h3>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className="commonCart boxShadow cart-3">
                <div className="BulkSmsItem">
                  <div className="header">
                    <h4>
                      <i className="flaticon-stock-market-1"></i> SMS Balance
                    </h4>
                  </div>
                  <div className="middle">
                    <h3>
                      <i className="flaticon-mail"></i>
                      {Number(smsData?.sms_balance).toFixed(2)}
                    </h3>
                  </div>
                  <div className="list">
                    <ul>
                      <li>
                        Non Masking SMS:{" "}
                        <span>
                          {Math.floor(smsData?.sms_balance / sms_price)}
                        </span>{" "}
                      </li>
                      <li>
                        Enter Your Amount
                        <div className="customInput">
                          <input
                            step="100"
                            {...register("tk")}
                            defaultValue="0"
                            type="number"
                            placeholder="Enter Your Amount"
                            onChange={e => setPaymentValue(e?.target?.value)}
                          />
                          {paymentValue < 500 && (
                            <span className="error">
                              Minimum Top Up 500 Taka
                            </span>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="duelButton" style={{ borderTop: "none" }}>
                    <Button
                      onClick={e => setModalOpen(paymentValue >= 500 && true)}
                    >
                      Top Up SMS
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div className="commonCart boxShadow cart-4">
                <div className="BulkSmsItem">
                  <div className="header">
                    <h4>
                      <i className="flaticon-notice-1"></i> Bulk SMS Notice
                      (Non-Masking)
                    </h4>
                  </div>

                  <div className="middle">
                    <h4>
                      {" "}
                      Regular SMS : <span>{sms_price} /sms </span>
                    </h4>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <BulkSmsStatus handelFetchBusInfo={handelFetchBusInfo} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <SMSTemplate />
            </Grid>
          </Grid>
        </Container>
      </section>
      {/* TotalSMSSent */}
      <section className="TotalOrder TotalSMSSent">
        <Container maxWidth="sm">
          <Grid container spacing={3}></Grid>
        </Container>
      </section>
      <section className="BulkSMSSection BulkSmsSend">
        {/* Header  */}
        <HeaderDescription
          headerIcon={"flaticon-sms"}
          title={"SMS Content"}
          subTitle={
            "*160 Characters are counted as 1 SMS in case of English language & 70 in other language."
          }
          subTitle2={
            "*One simple text message containing extended GSM character set (~^{}[]|) is of 70 characters long. Check your SMS count before pushing SMS."
          }
          search={false}
          order={false}
        />
        <Container maxWidth="sm">
          <Grid Container spacing={3}>
            <Grid item xs={12}>
              <div className="BulkSmsSendItem boxShadow">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="BulkSmsItem">
                    <div className="customInput">
                      <label>Customers Phone Number</label>

                      <Select
                        {...register("select data ")}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={personName}
                        onChange={handleChangeBulkSMS}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={selected => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {names.map(name => (
                          <MenuItem key={name.value} value={name.value}>
                            <Checkbox
                              checked={personName.indexOf(name.value) > -1}
                            />
                            <ListItemText primary={name.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </div>

                    <div className="customInput">
                      <label>Enter Mobile Numbers</label>
                      <input
                        type="text"
                        {...register("phone")}
                        defaultValue={bdNumbers?.toString()}
                        placeholder="( example: 01700000000, 01700000000, 01700000000, 01700000000 )"
                      />

                      <h5>Total Number - {bdNumbers.length}</h5>
                    </div>

                    <div className="customInput">
                      <label>Enter SMS Content</label>
                      <textarea
                        name=""
                        rows="4"
                        {...register("msg", { required: true })}
                        onChange={handleChangeContent}
                        // onChange={(e) => {
                        //     const inputText = e.target.value;{
                        //     setText(inputText)

                        // }}
                      ></textarea>
                      <h5>
                        {text.length} -characters ,{smsLength} SMS message(s)
                      </h5>
                    </div>
                  </div>

                  <div className="duelButton">
                    <Button disabled={isLoading} type="submit">
                      {isLoading && (
                        <i>
                          <Spinner />{" "}
                        </i>
                      )}
                      Send Now
                    </Button>
                    <Button type="reset" className="red">
                      Reset
                    </Button>
                  </div>
                </form>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      <Modal
        open={openModal}
        onClose={handleCloseNote}
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

              <div className="right" onClick={handleCloseNote}>
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
                        onChange={handlePaymentMethodSelect}
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
                        onChange={handlePaymentMethodSelect}
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
                                                onChange={handlePaymentMethodSelect}
                                            />
                                            <img src={"/images/payment-img/visa.png"} alt="" />
                                        </label> */}
                  </div>

                  <div className="Review">
                    <h6>Review</h6>
                    <div className="SubscribeAmount">
                      <h4>Subscribe Amount</h4>
                      <h3>
                        <i className="flaticon-taka" />
                        {paymentValue}.00{" "}
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
    </>
  );
};

export default BulkSms;
