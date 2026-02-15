import { Container, Grid } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import Pagination from "../../UI/CustomPagination";
import axios from "axios";
import { headers } from "../../../pages/api";

const AllNotification = ({ busInfo }) => {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = busInfo;
  const notification = () => {

    const params = {
      page: currentPage,
      perPage: perPage,
    }
    const orderBody = {
      notify_id: id,
      type: "order",
      // page: currentPage,
      // perPage: perPage,
    };
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + `/client/notifications-show`,
        orderBody,
        {
          headers: headers,
          params: params,
        }
      )
      .then(function (res) {
        setData(res.data.data);
        setTotalPage(res.data?.last_page);
      })
      .catch(error => {});
  };

  useEffect(() => {
    notification();
  }, [id,   perPage,  currentPage,]);

  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <div className={style.AllNotification}>
        <Container maxWidth="sm">
          <Grid item md={12}>
            <div className={style.AllNotificationContent}>
              <div className={style.header}>
                <div className={style.left}>
                  <h4>All Notifications</h4>
                </div>
                {/* <div className={style.right}>
                  <h4>Action</h4>
                </div> */}
              </div>

              {/* AllNotification */}
              <div className={style.AllNotificationList}>
                <ul>
                  {/* item */}
                  {/* <li>
                    <div className={style.left}>
                      <div className={style.img}>
                        <i className="flaticon-notification"></i>
                      </div>
                      <div className={style.text}>
                        <h4>
                          Order code: <span>20230605-11344356</span> has been
                          Delivered
                        </h4>
                        <p>29 July 2020 - 02:26 PM</p>
                      </div>
                    </div>
                    <div className={style.right}>
                      <Button>
                        <i className="flaticon-view"></i>
                      </Button>
                    </div>
                  </li> */}

                  {Array.isArray(data) ? (
                    data.map((item, key) => {
                      return (
                        <li>
                          <div className={style.left}>
                            <div className={style.img}>
                              <i className="flaticon-notification"></i>
                            </div>
                            <div className={style.text}>
                              <h4>
                                {/* Order code: <span>20230605-11344356</span> has been
                                  Delivered */}

                                {item?.data?.message}
                              </h4>
                              <p>
                                {item?.read != null && (
                                  <p>
                                    Seen :
                                    {item?.read?.slice(0, 10) >= today
                                      ? moment(item?.read).fromNow()
                                      : moment(item?.read).format("DD-MM-YYYY")}
                                  </p>
                                )}
                              </p>
                            </div>
                          </div>
                          {/* <div className={style.right}>
                              <Button>
                                <i className="flaticon-view"></i>
                              </Button>
                            </div> */}
                        </li>
                      );
                    })
                  ) : (
                    <li>
                      <div className={style.left}>
                        <div className={style.text}>
                          <h4>Empty notification</h4>
                        </div>
                      </div>
                    </li>
                  )}

                  {/* item */}
                  <Pagination setPerPage={setPerPage} perPage={perPage}  totalPage={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage}  />
                </ul>
              </div>
            </div>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default AllNotification;
