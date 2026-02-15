import { useCallback, useEffect, useState } from "react";
import style from "./style.module.css";
import { Box, Button, Modal, Pagination } from "@mui/material";
import PieChartPage from "../HomePage/PainChart";
import axios from "axios";
import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { DeliveryIcon, EyeIcon, PackageIcon, RefundIcon, ReportIcon, StatisticIcon } from "./Icon";
import Steadfast from "../../public/images/courier/steadfast.png";
import Pathao from "../../public/images/courier/pathao.png";
import RedX from "../../public/images/courier/redx.png";
import Image from "next/image";
import FraudNote from "./FraudNote";




export const FraudActivities = ({orderfraudsReport}) => {
  const [fraudActivId , setFraudActivId] =useState("")
  const [openModal, setOpenModal] = useState(false);
 
  const pieData = [
    {
      name: "Delivered",
      value: orderfraudsReport?.order_delivered || 0,
    },
    {
      name: "Cancelled",
      value: orderfraudsReport?.order_returned || 0,
    },
  ];

  const fraudsList = orderfraudsReport?.frauds || [] ;
  return (
    <section className={style.section}>
      <div className={style.heading}>
        <h1>All Fraud Activities</h1>
      </div>

      <div className={style.sectionContainer}>
        <div className={style.cards}>
          <div className={style.card}>
            <div
              className={style.icon}
              style={{
                backgroundColor: "rgba(233, 248, 252, 1)",
                color: "#00A3FF",
              }}
            >
              <StatisticIcon />
            </div>
            <h2>Statistic</h2>
            <div className={`flex-center ${style.pieChart}`}>
              <PieChartPage
                height={120}
                width={120}
                innerRadius={25}
                outerRadius={50}
                newCannelList={pieData}
                color={["#6B2CD1", "#ffb800"]}
              ></PieChartPage>
            </div>
          </div>
          <div className={style.card}>
            <div className={style.icon}>
              <PackageIcon />
            </div>
            <h1>{orderfraudsReport?.order_placed}</h1>
            <h2>Total Order Placed</h2>
          </div>
          <div className={style.card}>
            <div
              className={style.icon}
              style={{ backgroundColor: "rgba(254, 248, 237, 1)" }}
            >
              <DeliveryIcon />
            </div>
            <h1>{orderfraudsReport?.order_delivered }</h1>
            <h2>Order Delivered</h2>
          </div>
          <div className={style.card}>
            <div className={style.icon} style={{ backgroundColor: "#E9F9F4" }}>
              <RefundIcon/>
            </div>
            <h1>{orderfraudsReport?.order_returned}</h1>
            <h2>Order Returned</h2>
          </div>
          <div className={style.card}>
            <div
              className={style.icon}
              style={{ backgroundColor: "rgba(233, 248, 252, 1)" }}
            >
              <ReportIcon />
            </div>
            <h1>{ orderfraudsReport?.fraud_report}</h1>
            <h2>Fraud Report Count</h2>
          </div>
        </div>

        <div className={`${style.providerWrapper} boxShadow2`}>
          <table className={style.providers}>
            <thead className={style.providerDetails}>
              <tr>
                <th>
                  <h1>Provider</h1>
                </th>
                <th>
                  <h1>Order Placed</h1>
                </th>
                <th>
                  <h1>Order Delivered</h1>
                </th>
                <th>
                  <h1>Order Returned</h1>
                </th>
                <th>
                  <h1>Fraud Count</h1>
                </th>
                <th>
                  <h1>Report</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              {!!fraudsList && fraudsList.map((item, index) => (
                <tr key={item?.id} className={style.providerDetails}>
                  <td className={style.provider}>
                    <figure>
                      <Image src={item.courier ==="steadfast" ? Steadfast : item.courier ==="pathao" ? Pathao : RedX} alt="" />
                    </figure>
                    <h1 className="sr-only">{item.courier}</h1>
                  </td>
                  <td>
                    <h2>{item?.orders}</h2>
                  </td>
                  <td>
                    <h2>{item?.delivered}</h2>
                  </td>
                  <td>
                    <h2>{item?.cancelled}</h2>
                  </td>
                  <td>
                    <h2>{item?.fraud_report}</h2>
                  </td>
                  <td>
                    {item.courier !=="redx" && item.fraud_report > 0 && (
                      <Button
                        className={style.btn}
                        onClick={() => {setOpenModal(true);setFraudActivId(item?.id)}}
                      >
                        <div className={style.icon2}>
                          <EyeIcon />
                        </div>
                        Fraud
                      </Button>
                    )}
                  </td>

                  {/* <Modal
                    open={openModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="updateModal"
                  >
                    <Box className="modalBox">
                      <div className="modalContent fraudCheck">
                        <div className={style.header}>
                          <div>
                            <h4>Fraud Details</h4>
                          </div>
                          <Button
                            className={style.button}
                            onClick={() => setOpenModal(false)}
                          >
                            <i className={`flaticon-close-1 ${style.icon}`}></i>
                          </Button>
                        </div>
                        <div className={style.modalContent}>
                          {item.notes.map((note, index) => (
                            <div key={index} className={style.modalItem}>
                              <div className={style.modalItemHeader}>
                                <div>
                                  <h1>Name: </h1>
                                  {note.name}
                                </div>
                                <div>
                                  <h1>Date: </h1>
                                  {note.date}
                                </div>
                              </div>
                              <p>{note.note}</p>
                            </div>
                          ))}
                        </div>
                        <div className={style.pagination}>
                          <Pagination count={10} color="primary" />
                        </div>
                      </div>
                    </Box>
                  </Modal> */}
                  {/*  */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FraudNote setOpenModal={setOpenModal} openModal={openModal} fraudActivId={fraudActivId}  />
    </section>
  );
};
