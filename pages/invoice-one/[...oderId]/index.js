import axios from "axios";
import Cookies from "js-cookie";
import getConfig from "next/config";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { headers, shopId, userId } from "../../api";

import moment from "moment";
import Head from "next/head";
const getTotalProductAmount = (orderDetails = []) => {
  return orderDetails.reduce((total, item) => {
    const price =
      item?.variant && item?.variations
        ? item.variations.price
        : item?.price || 0;

    return total + (item?.quantity || 0) * price;
  }, 0);
};

const InvoicePage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isApiResponse, setIsApiResponse] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [busInfo, setBusInfo] = useState({});
  const router = useRouter();
  const { oderId } = router.query;
  const token = Cookies.get("token");

  useEffect(() => {
    axios
      .get(apiUrl + "/client/settings/business-info", { headers: headers })
      .then(function (response) {
        setBusInfo(response?.data?.data);
      });
  }, [oderId]);

  const params = {
    order_id: oderId,
  };

  const config = {
    headers: {
      "shop-id": shopId,
      "X-Requested-With": "XMLHttpRequest",
      Authorization: `Bearer ${token}`,
      id: userId,
    },
    params: params, // Pass the params here
  };

  useEffect(() => {
    axios
      .get(apiUrl + "/client/order-invoice", config)
      .then(function (response) {
        // handle success
        setInvoices(response?.data?.data);
        setIsApiResponse(true);
      })
      .catch(function (error) {
        // handle error
        console.error(error);
      });
  }, [oderId]);

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 5000);
  }, []);

  const capitalizeWords = str => {
    return (str || "")
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (invoices !== undefined) {
    return (
      <>
        <Head>
          <title>Invoice-3</title>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "\n        :where(h1, h2, h3, h4, h5, h6, p, ) {\n            margin: 0;\n            padding: 0;\n        }\n\n        .invoice-4 {\n            font-family: 'Montserrat', sans-serif;\n            width: 700px;  height: auto; \n \n            margin: 0 auto;\n            padding: 10px 20px;\n            padding-bottom: 0;\n background: #FFF;\n            -webkit-print-color-adjust: exact;\n        display: flex;\n            flex-direction: column;\n }\n\n        .invoice-4 .item{\n            height: 480px;\n        }\n\n        .invoice-4 .bdr{\n            border-top: 2px dashed #DDD;\n  margin: 50px -20px; \n margin-bottom: 60px; \n position:relative\n        } \n\n        .invoice-4 .bdrr{\n display:none }\n\n  .invoice-4 .bdr img{ position: absolute; top: -23px; left: 0px; opacity: .5; height:45px; } \n\n    .header {\n            display: flex;\n            align-items: self-start;\n            justify-content: space-between;\n            border-bottom: 1px solid #ddd;\n            margin: 0 -20px;\n            padding: 0 20px;\n            padding-bottom: 10px;\n            border-collapse: collapse;\n        }\n\n        .header h2 {\n            font-size: 25px;\n            line-height: 35px;\n            font-weight: 700;\n            color: #000;\n        }\n\n        .header h4 {\n            font-size: 13px;\n            line-height: 15px;\n            color: #000;\n            font-weight: 500;\n            margin-top: 5px;\n        }\n\n        .header h4 span {\n            font-weight: 700;\n            color: #000;\n        }\n\n        .logo {\n            text-align: right;\n        }\n\n        .logo img {\n            height: 50px;\n        }\n\n        .table {\n            width: 100%;\n            margin-top: 10px;\n        }\n\n        .table table {\n            width: 100%;\n            border-collapse: collapse;\n        }\n\n        .table table thead tr {\n            border-bottom: 1px solid #ddd;\n        }\n\n        .table table th {\n            font-size: 13px;\n            text-align: center;\n            padding: 5px 20px;\n            color: #000;\n            font-weight: 700;\n        }\n\n        .table table td {\n            text-align: center;\n            padding: 5px 20px;\n            color: #000;\n            font-weight: 500;\n            font-size: 14px;\n            line-height: 16px;\n        }\n\n        .table table tbody tr:nth-child(odd) {\n            background: #CFE2FF;\n        }\n\n        .table table tbody tr:nth-child(even) {\n            background: #f3f3f3;\n        }\n\n\n        .billing {\n            margin-top: 20px;\n            display: flex;\n            align-items: flex-start;\n            justify-content: space-between;\n        }\n\n        .billing .left {\n            width: 43%;\n        }\n\n        .billing .right {\n            width: 47%;\n            text-align: right;\n        }\n\n        .billing h4 {\n            font-size: 14px;\n            line-height: 20px;\n            color: #000;\n            margin-bottom: 5px;\n        }\n\n        .billing p {\n            font-size: 13px;\n            line-height: 20px;\n            color: #000;\n            font-weight: 500;\n            margin-top: 5px;\n            color: #000;\n        }\n\n        .billing p span {\n            font-weight: 700;\n        }\n\n        .billing h5 {\n            font-size: 13px;\n            line-height: 20px;\n            color: #000;\n            font-weight: 500;\n            margin-top: 5px;\n        }\n\n        .billing h5 span {\n            font-weight: 700;\n            color: #000;\n        }\n\n        .billing ul {\n            list-style-type: none;\n            margin: 0;\n            padding: 0;\n        }\n\n        .billing ul li {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 0px;\n            padding: 2px 7px;\n        }\n\n        .billing ul li h3 {\n            font-size: 14px;\n            line-height: 20px;\n            color: #000;\n            font-weight: 700;\n            width: 45%;\n        }\n\n        .billing ul li p {\n            width: 40%;\n            font-size: 14px;\n            font-weight: 500;\n            color: #000;\n            margin-top: 0;\n        }\n\n        .billing ul li:last-child {\n            background: #894bca;\n            margin-bottom: 0;\n            margin-top: 5px;\n        }\n\n        .billing ul li:last-child h3 {\n            color: #fff;\n            font-size: 16px;\n            line-height: 24px;\n        }\n\n        .billing ul li:last-child p {\n            color: #fff;\n            font-size: 16px;\n            line-height: 24px;\n        }\n\n        .footer {\n            background: rgba(255, 0, 0, 0.04);\n            border-top: 2px solid rgba(255, 0, 0, 0.16);\n            margin: 0 -20px;\n            padding: 10px 20px;\n            margin-top: 10px;\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n        }\n\n        .footer h3{\n            font-size: 15px;\n            line-height: 24px;\n            color: #000;\n            font-weight: 700;\n        }\n\n        .footer h5 {\n        \n            font-size: 14px;\n            line-height: 20px;\n            color: #000;\n            font-weight: 500;\n            margin-top: 3px;\n        }\n\n\n    ",
            }}
          />
        </Head>

        <div className="invoice-4">
          {isApiResponse &&
            invoices.length > 0 &&
            invoices.map((invoice, index) => {
              return (
                <>
                  {/* item */}
                  <div className="item">
                    {/* header */}
                    <div className="header">
                      <div className="left">
                        <h2>Invoice</h2>
                        <h4>
                          {" "}
                          <span>Date:</span>
                          {moment().format("MMMM Do, YYYY")}
                        </h4>
                        <h4>
                          {" "}
                          <span>Invoice:</span> #{invoice?.order_no}{" "}
                        </h4>
                        {invoice?.order_status === "shipped" ? (
                          <h4>
                            {" "}
                            <span>Courier Invoice:</span> #
                            {invoice?.courier_info?.consignment_id}{" "}
                          </h4>
                        ) : null}
                      </div>
                      <div className="logo">
                        <img src={busInfo?.shop_logo} alt="" />
                      </div>
                    </div>
                    <div className="table">
                      <table>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Product Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice?.order_details?.map((data, index) => {
                            return (
                              <tr key={data.order_id}>
                                <td>{index + 1}</td>
                                <td>
                                  {data?.variant && data?.variations?.variant
                                    ? data?.product +
                                      " " +
                                      data?.variations?.variant
                                    : data?.product}
                                </td>
                                <td>
                                  {data?.variant !== null
                                    ? data?.variations?.price
                                    : data?.price}
                                </td>
                                <td>{data?.quantity}</td>
                                <td>
                                  {" "}
                                  {data?.variant !== null
                                    ? data?.variations?.price * data?.quantity
                                    : data?.price * data?.quantity}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* billing */}
                    <div className="billing">
                      <div className="left">
                        <h4>Customer Details</h4>
                        <h5>
                          <span>Name: </span> {invoice?.customer_name}
                        </h5>
                        <h5>
                          <span>Mobile:</span>
                          {invoice?.phone}
                        </h5>
                        <h5>
                          <span>Address:</span> {invoice?.address}
                        </h5>
                      </div>

                      <div className="right">
                        <ul>
                          <li>
                            <h3>Subtotal :</h3>
                            <p>
                              {" "}
                              Tk.
                              {invoice?.order_details?.reduce(
                                (prevVal, currentVal) => {
                                  const price =
                                    currentVal?.variant !== null &&
                                    currentVal?.variations !== null
                                      ? currentVal?.variations?.price
                                      : currentVal?.price;
                                  return prevVal + currentVal?.quantity * price;
                                },
                                0
                              )}
                              .00
                            </p>
                          </li>
                          <li>
                            <h3>Discount :</h3>
                            <p>Tk. {invoice?.discount}.00</p>
                          </li>
                          <li>
                            <h3>Advance :</h3>
                            <p>Tk. {invoice?.advanced}.00</p>
                          </li>
                          <li>
                            <h3>Shipping Cost :</h3>

                            <p>Tk. {invoice?.shipping_cost}.00</p>
                          </li>

                          <li>
                            <h3>Total Due :</h3>
                            <p>Tk. {invoice?.due}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p>
                      <span>Note:</span> {invoice?.invoice_note}
                    </p>
                    {/* footer */}
                    <div className="footer">
                      <div className="left">
                        <h3>{capitalizeWords(invoice?.shop_info?.name)}</h3>
                        <h5>Mobile: {busInfo?.phone}</h5>
                        <h5>Email: {busInfo?.email}</h5>
                      </div>
                      <div className="right">
                        <h5>{busInfo?.address}</h5>
                      </div>
                    </div>
                  </div>
                  {/* bdr */}
                  <div className={(index + 1) % 2 === 0 ? "bdrr" : "bdr"}>
                    <img src="/images/cut.png" alt="" />
                  </div>
                </>
              );
            })}
        </div>
      </>
    );
  }
};

export default InvoicePage;
