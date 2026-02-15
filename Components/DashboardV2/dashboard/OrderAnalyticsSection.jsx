import { Box, Grid } from "@mui/material";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card/card";
import { cls } from "../lib/utils";
import { Phone, User } from "lucide-react";
import { Tooltip } from "recharts";
import { Badge } from "../components/ui/badge/badge";
import styles from "../global.module.css";
import { headers, topSellingProducts } from "../../../pages/api";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
export const OrderAnalyticsSection = () => {
  const [TopSellingProducts, setTopSellingProduct] = useState([]);
  const [recentOrder, setRecentOrder] = useState([]);
  useEffect(() => {
      topSellingProducts().then((result) => {
          setTopSellingProduct(result?.data?.data);
      });
  }, []);


 



  const handleFetchRecentOrder = async () => {
      try {
          let data = await axios({
              method: "get",
              url: `${process.env.NEXT_PUBLIC_API_URL}/client/recent-order/count`,
              headers: headers,
          });
          setRecentOrder(data?.data?.data);
      } catch (err) {

      }
  }

  useEffect(() => {
      handleFetchRecentOrder();
  }, [])

  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box className={cls(styles["flex-between"])} sx={{ width: 1 }}>
          <h1>Order Analytics</h1>
        </Box>
      </div>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Recent Order</CardTitle>
            </CardHeader>
            <CardContent>
              <Box sx={{ overflow: "auto", maxHeight: "30rem" }}>
                <table
                  className={cls(styles.card_table, styles.table_highlight)}
                >
                  <thead>
                    <tr
                      className={cls(
                        styles.card_table_item,
                        styles.card_table_header
                      )}
                    >
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "1rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Order No & Date</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "3.5rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Customer Info</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        <h1 className={styles.card_title}>Product Info</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "1rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Total Price</h1>
                      </th>
                      <th
                        className={cls(
                          styles.card_table_cell,
                          styles.small,
                          styles.right
                        )}
                      >
                        <h1 className={styles.card_title}>Status</h1>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(recentOrder).map((order, ) => (
                      <tr className={styles.card_table_item} key={order.id}>
                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <h1
                              className={styles.card_title}
                              style={{
                                color: "hsl(var(--muted-foreground))",
                              }}
                            >
                              #{order.order_no}
                            </h1>
                            <h1 className={styles.card_title}>{moment(order?.created_at).format('MMMM DD, YYYY')}</h1>
                          </Box>
                        </td>
                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <h1 className={styles.card_title}>
                              <div
                                className={cls(
                                  styles["flex"],
                                  styles["order-customer-info"]
                                )}
                              >
                                <User />
                                {order?.customer_name}
                              </div>
                            </h1>
                            <h1 className={styles.card_title}>
                              <Link
                               href={`tel:${order?.phone}`}
                                className={cls(
                                  styles["flex"],
                                  styles["order-customer-info"]
                                )}
                              >
                                <Phone />
                                {order?.phone}
                              </Link>
                            </h1>
                          </Box>
                        </td>

                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <figure className={styles.top_product_image}>
                              <img
                                src={order?.order_details[0]?.product?.main_image  || order?.order_details[0]?.product?.wp_product_image_url }
                                alt={order?.order_details[0]?.product?.product_name}
                              />
                            </figure>
                            <h1
                              className={cls(
                                styles.card_title,
                                styles["whitespace-nowrap"]
                              )}
                              style={{ paddingRight: "2rem" }}
                            >
                              {order?.order_details[0]?.product?.product_name}
                            </h1>
                          </Box>
                        </td>
                        <td
                          className={cls(styles.card_table_cell, styles.small)}
                        >
                          <h1 className={styles.card_title}>৳ {order?.pricing?.grand_total?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h1>
                        </td>
                        <td
                          className={cls(styles.card_table_cell, styles.right)}
                        >
                          <Badge variant="outline">{order?.order_status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Box sx={{ overflow: "auto", maxHeight: "30rem" }}>
                <table
                  className={cls(styles.card_table, styles.table_highlight)}
                >
                  <thead>
                    <tr
                      className={cls(
                        styles.card_table_item,
                        styles.card_table_header
                      )}
                    >
                      <th
                        className={cls(styles.card_table_cell)}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "1rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Product Info</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "3.5rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Total Sold</h1>
                      </th>

                      <th
                        className={cls(
                          styles.card_table_cell,
                          styles["whitespace-nowrap"]
                        )}
                      >
                        <h1 className={styles.card_title}>Available Stock</h1>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(TopSellingProducts).map((item,) => (
                      <tr className={styles.card_table_item} key={item.id}>
                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <figure className={styles.top_product_image}>
                              <img
                                src={item?.product_main_image ?? '/images/placeholder.png'}
                                alt={item?.product_name}
                              />
                            </figure>
                            <h1
                              className={cls(
                                styles.card_title,
                                styles["whitespace-nowrap"]
                              )}
                              style={{ paddingRight: "2rem" }}
                            >
                              {item?.product_name}
                            </h1>
                          </Box>
                        </td>
                        <td className={styles.card_table_cell}>
                          <Badge>{item?.total_sold}</Badge>
                        </td>
                        <td
                          className={cls(styles.card_table_cell)}
                        >
                          <h1 className={styles.card_title}>{item?.product_qty < 0 ? <span style={{ color: 'red' }}>stock out</span>: item?.product_qty}</h1>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};
