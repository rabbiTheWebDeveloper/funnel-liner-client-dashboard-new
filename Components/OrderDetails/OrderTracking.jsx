import React, { useCallback, useEffect, useState } from "react";
import style from "./style.module.css";
import CopyIcon from "../UI/CopyIcon/CopyIcon";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import axios from "axios";
import { headers } from "../../pages/api";
import Link from "next/link";
import moment from "moment/moment";
const OrderTracking = ({ orderID, orderTraking }) => {
  const [orderTracking, setOrderTracking] = useState([]);
  const [loding, setLoding] = useState(false);
  const handleFetchOrderTracking = useCallback(async () => {
    if (orderID) {
      try {
        setLoding(true);
        let data = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}/client/order-tracking-timeline/${orderID}`,
          headers: headers,
        });
        if (data?.data.data) {
          setLoding(false);
          setOrderTracking(data?.data?.data);
        }
      } catch (err) {}
    }
  }, [orderID]);
  useEffect(() => {
    handleFetchOrderTracking();
  }, [handleFetchOrderTracking]);
  console.log(orderTracking);
  return (
    <div className={style.inner}>
      <div className={style.details}>
        Tracking Link:{" "}
        <Link
          target="_blank"
          href={`https://funnelliner.com/t/${orderTraking}`}
        >
          https://funnelliner.com/t/{orderTraking}
        </Link>
        <CopyIcon
          className={style.copy}
          url={`https://funnelliner.com/t/${orderTraking}`}
        />
      </div>
      <div className={style.timeline}>
        {orderTracking?.map(item => (
          <div className={style.item} key={item?.note}>
            <div className={style.date}>
              <h1>{moment(item?.created_at).format("MMM DD")}</h1>
              <h2>{moment(item?.created_at).format("h:mm a")}</h2>
            </div>

            <div className={style.visual}>
              <div className={style.line}></div>
              <div className={style.point}></div>
            </div>
            <h1 className={style.title}>
            {item?.note}
            </h1>
            <h1></h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
