import { cls } from "../lib/utils";
import { Grid, Box, Typography } from "@mui/material";
import styles from "../global.module.css";
import SalesTargetForm from "../components/sales-target-form/SalesTargetForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "../components/ui/button/button";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import useSalesTarget from "../../../hook/dashboard/useSalesTarget";
import { useEffect } from "react";
import moment from "moment";

const calculatePercentage = achievement => {
  const numberValue = parseFloat(
    typeof achievement === "string"
      ? achievement.replace(/,/g, "")
      : achievement
  );

  if (isNaN(numberValue)) return 0; // prevent NaN issues

  const percent = Math.min(numberValue, 100);
  return Number(percent.toFixed(2)); // ensure clean numeric return
};

const getColorByPercentage = (percentage, isTarget = false) => {
  const alpha = isTarget ? "/ 0.15" : "";
  if (percentage < 30) return `hsl(var(--destructive) ${alpha})`; // red
  if (percentage < 60) return `hsl(var(--warning) ${alpha})`; // orange
  if (percentage < 80) return `hsl(var(--success) ${alpha})`; // green
  return `hsl(var(--primary) ${alpha})`; // primary color
};
export const SalesTargetSection = () => {
  const { salesTarget, fetchSalesTarget } = useSalesTarget();

  // Daily achievement percentage
  const dailyPercentage = (186 / 980) * 100;
  const monthlyPercentage = (9000 / 980) * 100;
  const customPercentage = (186 / 380) * 100;

  useEffect(() => {
    fetchSalesTarget();
  }, [fetchSalesTarget]);
  // console.log(salesTarget);
  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box className={cls(styles["flex-between"])} sx={{ width: 1 }}>
          <h1>Sales Target</h1>
          <Box
            sx={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}
            className={styles["mobile-col"]}
          >
            <Link href="/sales-reports">
              <Button variant="outline" style={{ boxShadow: "none" }}>
                <span
                  style={{
                    borderBottom: "1px dotted hsl(var(--muted-foreground))",
                    lineHeight: "1",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  View Reports
                </span>
              </Button>
            </Link>
            <SalesTargetForm
              salesTarget={salesTarget}
              fetchSalesTarget={fetchSalesTarget}
            />
          </Box>
        </Box>
      </div>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={4} lg={4}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>
                  {salesTarget.daily_completed}%
                </h1>
              </div>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(
                      salesTarget?.daily_completed
                        ? salesTarget?.daily_completed
                        : "00.00",
                      true
                    ),
                    position: "absolute",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={
                    salesTarget?.daily_completed
                      ? salesTarget?.daily_completed
                      : "00.00"
                  }
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(
                      salesTarget?.daily_completed
                        ? salesTarget?.daily_completed
                        : "00.00"
                    ),
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    {`${Math.round(
                      salesTarget?.daily_completed
                        ? salesTarget?.daily_completed
                        : "00.00"
                    )}%`}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(
                          salesTarget?.daily_completed
                            ? salesTarget?.daily_completed
                            : "00.00"
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      {salesTarget?.amounts?.daily_total
                        ? salesTarget?.amounts?.daily_total
                            ?.toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "00"}
                      ৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(
                          dailyPercentage,
                          true
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      {Object.keys(salesTarget).length > 0
                        ? salesTarget.daily
                            ?.toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "00"}
                      ৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={12} sm={4} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Weekly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>{salesTarget.weekly_completed}%</h1>
              </div>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(62, true),
                    position: 'absolute',
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={62}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(62),
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    62%
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(62),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      250৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(62, true),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      1000৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid> */}

        <Grid item xs={12} sm={4} lg={4}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>
                  {calculatePercentage(
                    salesTarget?.monthly_completed
                      ? salesTarget?.monthly_completed
                      : "00.00"
                  )}
                  %
                </h1>
              </div>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(
                      calculatePercentage(
                        calculatePercentage(
                          salesTarget?.monthly_completed
                            ? salesTarget?.monthly_completed
                            : "00.00"
                        )
                          ? salesTarget?.monthly_completed
                          : "00.00"
                      ),
                      true
                    ),
                    position: "absolute",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={
                    calculatePercentage(
                      calculatePercentage(
                        salesTarget?.monthly_completed
                          ? salesTarget?.monthly_completed
                          : "00.00"
                      )
                        ? calculatePercentage(
                            salesTarget?.monthly_completed
                              ? salesTarget?.monthly_completed
                              : "00.00"
                          )
                        : "00.00"
                    ) > 100
                      ? 100
                      : calculatePercentage(
                          calculatePercentage(
                            salesTarget?.monthly_completed
                              ? salesTarget?.monthly_completed
                              : "00.00"
                          )
                            ? calculatePercentage(
                                salesTarget?.monthly_completed
                                  ? salesTarget?.monthly_completed
                                  : "00.00"
                              )
                            : "00.00"
                        )
                  }
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(
                      calculatePercentage(
                        calculatePercentage(
                          salesTarget?.monthly_completed
                            ? salesTarget?.monthly_completed
                            : "00.00"
                        )
                          ? calculatePercentage(
                              salesTarget?.monthly_completed
                                ? salesTarget?.monthly_completed
                                : "00.00"
                            )
                          : "00.00"
                      )
                    ),
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    {`${Math.round(
                      calculatePercentage(
                        salesTarget?.monthly_completed
                          ? salesTarget?.monthly_completed
                          : "00.00"
                      )
                    )}%`}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(
                          calculatePercentage(
                            salesTarget?.monthly_completed
                              ? salesTarget?.monthly_completed
                              : "00.00"
                          )
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      {salesTarget?.amounts?.monthly_total
                        ? salesTarget?.amounts?.monthly_total
                            ?.toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "00"}{" "}
                      ৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(
                          calculatePercentage(
                            salesTarget?.monthly_completed
                              ? salesTarget?.monthly_completed
                              : "00.00"
                          ),
                          true
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      {Object.keys(salesTarget).length > 0
                        ? salesTarget.monthly
                            ?.toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "00"}{" "}
                      ৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4} lg={4}>
          <Card className={styles.dashboard_card}>
            <CardHeader
              className={styles["flex-between"]}
              style={{ flexDirection: "row" }}
            >
              <CardTitle>Custom Date</CardTitle>
              <h1 className={styles.card_title}>
                {" "}
                {salesTarget?.from_date && (
                  <span>
                    (
                    {salesTarget?.from_date
                      ? moment(salesTarget?.from_date).format("DD-MM-YYYY")
                      : ""}{" "}
                    -{" "}
                    {salesTarget?.to_date
                      ? moment(salesTarget?.to_date).format("DD-MM-YYYY")
                      : ""}
                    ){" "}
                  </span>
                )}
              </h1>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>
                  {calculatePercentage(
                    salesTarget?.custom_completed
                      ? salesTarget?.custom_completed
                      : "00.00"
                  )}{" "}
                  %
                </h1>
              </div>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(
                      calculatePercentage(
                        salesTarget?.custom_completed
                          ? salesTarget?.custom_completed
                          : "00.00"
                      ),
                      true
                    ),
                    position: "absolute",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={customPercentage}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(
                      calculatePercentage(
                        salesTarget?.custom_completed
                          ? salesTarget?.custom_completed
                          : "00.00"
                      )
                    ),
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    {calculatePercentage(
                      salesTarget?.custom_completed
                        ? salesTarget?.custom_completed
                        : "00.00"
                    )}
                    %
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(
                          calculatePercentage(
                            salesTarget?.custom_completed
                              ? salesTarget?.custom_completed
                              : "00.00"
                          )
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      {salesTarget?.amounts?.custom_total
                        ? salesTarget?.amounts?.custom_total
                            ?.toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "00"}{" "}
                      ৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Box
                      sx={{
                        height: "12px",
                        width: "12px",
                        minWidth: "12px",
                        borderRadius: "4px",
                        backgroundColor: getColorByPercentage(
                          calculatePercentage(
                            salesTarget?.custom_completed
                              ? salesTarget?.custom_completed
                              : "00.00"
                          ),
                          true
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      {Object.keys(salesTarget).length > 0
                        ? salesTarget.custom
                            ?.toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "00"}{" "}
                      ৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};
