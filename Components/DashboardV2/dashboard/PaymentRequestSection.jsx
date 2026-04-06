import { Grid, Box, Button, Chip, LinearProgress, Tooltip } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardIcon,
} from "../components/ui/card/card";
import {
  Wallet,
  Truck,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Banknote,
  BadgeDollarSign,
  HandCoins,
} from "lucide-react";
import styles from "../global.module.css";
import paymentStyles from "./PaymentRequestSection.module.css";
import { cls } from "../lib/utils";
import { useState } from "react";

const courierData = [
  {
    id: "steadfast",
    name: "Steadfast",
    logo: "/images/steadfast.png",
    color: "#E8350F",
    bgColor: "#FEF2F0",
    bgGradient: "linear-gradient(135deg, #FEF2F0 0%, #FDDCD6 100%)",
    totalBalance: 15420,
    pendingAmount: 5200,
    paidAmount: 10220,
    lastPayment: "2026-04-03",
    totalOrders: 342,
    deliveredOrders: 298,
    returnedOrders: 44,
    codCharge: 1540,
    deliveryCharge: 4280,
    paymentRequests: [
      { id: "SF-001", amount: 5200, status: "pending", date: "2026-04-05" },
      { id: "SF-002", amount: 3800, status: "approved", date: "2026-04-02" },
      { id: "SF-003", amount: 6420, status: "paid", date: "2026-03-28" },
    ],
  },
  {
    id: "pathao",
    name: "Pathao",
    logo: "/images/pathao.png",
    color: "#00B140",
    bgColor: "#F0FBF4",
    bgGradient: "linear-gradient(135deg, #F0FBF4 0%, #D4F5E0 100%)",
    totalBalance: 22850,
    pendingAmount: 8500,
    paidAmount: 14350,
    lastPayment: "2026-04-04",
    totalOrders: 518,
    deliveredOrders: 465,
    returnedOrders: 53,
    codCharge: 2285,
    deliveryCharge: 6480,
    paymentRequests: [
      { id: "PT-001", amount: 8500, status: "pending", date: "2026-04-06" },
      { id: "PT-002", amount: 5600, status: "approved", date: "2026-04-01" },
      { id: "PT-003", amount: 8750, status: "paid", date: "2026-03-25" },
    ],
  },
  {
    id: "redx",
    name: "RedX",
    logo: "/images/new-redx-logo.svg",
    color: "#D42027",
    bgColor: "#FDF2F2",
    bgGradient: "linear-gradient(135deg, #FDF2F2 0%, #FCD9DA 100%)",
    totalBalance: 9680,
    pendingAmount: 3200,
    paidAmount: 6480,
    lastPayment: "2026-04-01",
    totalOrders: 186,
    deliveredOrders: 162,
    returnedOrders: 24,
    codCharge: 968,
    deliveryCharge: 2320,
    paymentRequests: [
      { id: "RX-001", amount: 3200, status: "pending", date: "2026-04-04" },
      { id: "RX-002", amount: 2800, status: "paid", date: "2026-03-30" },
      { id: "RX-003", amount: 3680, status: "paid", date: "2026-03-22" },
    ],
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "#F28F1A",
    bg: "#FFF8F0",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "#0052F2",
    bg: "#F0F5FF",
    icon: CheckCircle2,
  },
  paid: {
    label: "Paid",
    color: "#17A600",
    bg: "#F0FBF4",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "#FF1212",
    bg: "#FDF2F2",
    icon: XCircle,
  },
};

const formatCurrency = (value) => `৳${value?.toLocaleString("en-BD") || "0"}`;

const StatusBadge = ({ status }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={paymentStyles.statusBadge}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}20`,
      }}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const PaymentRequestSection = () => {
  const [activeCourier, setActiveCourier] = useState("steadfast");

  const selectedCourier = courierData.find((c) => c.id === activeCourier);
  const totalBalance = courierData.reduce(
    (sum, c) => sum + c.totalBalance,
    0
  );
  const totalPending = courierData.reduce(
    (sum, c) => sum + c.pendingAmount,
    0
  );
  const totalPaid = courierData.reduce((sum, c) => sum + c.paidAmount, 0);

  return (
    <>
      {/* Section Header */}
      <div className={styles.section_label}>Payment Request System</div>

      {/* Summary Cards Row */}
      <Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <div className={paymentStyles.summaryCard}>
            <div
              className={paymentStyles.summaryCardInner}
              style={{
                background:
                  "linear-gradient(135deg, #894BCA 0%, #6B2CD1 100%)",
              }}
            >
              <div className={paymentStyles.summaryIconBox}>
                <Wallet size={24} color="#fff" />
              </div>
              <div className={paymentStyles.summaryInfo}>
                <span className={paymentStyles.summaryLabel}>
                  Total Balance
                </span>
                <h2 className={paymentStyles.summaryValue}>
                  {formatCurrency(totalBalance)}
                </h2>
              </div>
              <div className={paymentStyles.summaryGlow}></div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <div className={paymentStyles.summaryCard}>
            <div
              className={paymentStyles.summaryCardInner}
              style={{
                background:
                  "linear-gradient(135deg, #F28F1A 0%, #E87508 100%)",
              }}
            >
              <div className={paymentStyles.summaryIconBox}>
                <Clock size={24} color="#fff" />
              </div>
              <div className={paymentStyles.summaryInfo}>
                <span className={paymentStyles.summaryLabel}>
                  Pending Amount
                </span>
                <h2 className={paymentStyles.summaryValue}>
                  {formatCurrency(totalPending)}
                </h2>
              </div>
              <div className={paymentStyles.summaryGlow}></div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <div className={paymentStyles.summaryCard}>
            <div
              className={paymentStyles.summaryCardInner}
              style={{
                background:
                  "linear-gradient(135deg, #17A600 0%, #0D8A00 100%)",
              }}
            >
              <div className={paymentStyles.summaryIconBox}>
                <CheckCircle2 size={24} color="#fff" />
              </div>
              <div className={paymentStyles.summaryInfo}>
                <span className={paymentStyles.summaryLabel}>Total Paid</span>
                <h2 className={paymentStyles.summaryValue}>
                  {formatCurrency(totalPaid)}
                </h2>
              </div>
              <div className={paymentStyles.summaryGlow}></div>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Courier Tabs */}
      <div className={paymentStyles.courierTabs}>
        {courierData.map((courier) => (
          <button
            key={courier.id}
            className={cls(
              paymentStyles.courierTab,
              activeCourier === courier.id && paymentStyles.courierTabActive
            )}
            onClick={() => setActiveCourier(courier.id)}
            style={{
              "--courier-color": courier.color,
              "--courier-bg": courier.bgColor,
            }}
          >
            <div className={paymentStyles.courierTabLogo}>
              <img src={courier.logo} alt={courier.name} />
            </div>
            <div className={paymentStyles.courierTabInfo}>
              <span className={paymentStyles.courierTabName}>
                {courier.name}
              </span>
              <span className={paymentStyles.courierTabBalance}>
                {formatCurrency(courier.totalBalance)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Courier Detail Cards */}
      {selectedCourier && (
        <Grid container spacing={2} sx={{ mt: 0 }}>
          {/* Balance Overview Card */}
          <Grid item xs={12} lg={4}>
            <Card className={cls(styles.dashboard_card)}>
              <CardHeader>
                <CardTitle>
                  <div
                    className={styles["flex-between"]}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={selectedCourier.logo}
                        alt={selectedCourier.name}
                        style={{
                          width: 24,
                          height: 24,
                          objectFit: "contain",
                        }}
                      />
                      {selectedCourier.name} Balance
                    </Box>
                    <CardIcon color={selectedCourier.bgColor}>
                      <Wallet size={20} color={selectedCourier.color} />
                    </CardIcon>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={paymentStyles.balanceOverview}>
                  {/* Total Balance */}
                  <div className={paymentStyles.balanceMain}>
                    <span className={paymentStyles.balanceLabel}>
                      Available Balance
                    </span>
                    <h2
                      className={paymentStyles.balanceAmount}
                      style={{ color: selectedCourier.color }}
                    >
                      {formatCurrency(selectedCourier.totalBalance)}
                    </h2>
                  </div>

                  {/* Progress Bar */}
                  <div className={paymentStyles.balanceProgress}>
                    <div className={paymentStyles.balanceProgressLabels}>
                      <span>Paid</span>
                      <span>
                        {Math.round(
                          (selectedCourier.paidAmount /
                            (selectedCourier.paidAmount +
                              selectedCourier.pendingAmount)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className={paymentStyles.progressBar}>
                      <div
                        className={paymentStyles.progressBarFill}
                        style={{
                          width: `${
                            (selectedCourier.paidAmount /
                              (selectedCourier.paidAmount +
                                selectedCourier.pendingAmount)) *
                            100
                          }%`,
                          backgroundColor: selectedCourier.color,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stat Grid */}
                  <div className={paymentStyles.balanceStats}>
                    <div className={paymentStyles.balanceStat}>
                      <HandCoins
                        size={16}
                        color="#F28F1A"
                        style={{ flexShrink: 0 }}
                      />
                      <div>
                        <span className={paymentStyles.balanceStatLabel}>
                          Pending
                        </span>
                        <span className={paymentStyles.balanceStatValue}>
                          {formatCurrency(selectedCourier.pendingAmount)}
                        </span>
                      </div>
                    </div>
                    <div className={paymentStyles.balanceStat}>
                      <CheckCircle2
                        size={16}
                        color="#17A600"
                        style={{ flexShrink: 0 }}
                      />
                      <div>
                        <span className={paymentStyles.balanceStatLabel}>
                          Paid
                        </span>
                        <span className={paymentStyles.balanceStatValue}>
                          {formatCurrency(selectedCourier.paidAmount)}
                        </span>
                      </div>
                    </div>
                    <div className={paymentStyles.balanceStat}>
                      <CreditCard
                        size={16}
                        color="#673AB7"
                        style={{ flexShrink: 0 }}
                      />
                      <div>
                        <span className={paymentStyles.balanceStatLabel}>
                          COD Charge
                        </span>
                        <span className={paymentStyles.balanceStatValue}>
                          {formatCurrency(selectedCourier.codCharge)}
                        </span>
                      </div>
                    </div>
                    <div className={paymentStyles.balanceStat}>
                      <Truck
                        size={16}
                        color="#0052F2"
                        style={{ flexShrink: 0 }}
                      />
                      <div>
                        <span className={paymentStyles.balanceStatLabel}>
                          Delivery Charge
                        </span>
                        <span className={paymentStyles.balanceStatValue}>
                          {formatCurrency(selectedCourier.deliveryCharge)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Request Button */}
                  <button
                    className={paymentStyles.paymentRequestBtn}
                    style={{
                      backgroundColor: selectedCourier.color,
                    }}
                  >
                    <BadgeDollarSign size={18} />
                    Request Payment
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Stats Card */}
          <Grid item xs={12} sm={6} lg={4}>
            <Card className={cls(styles.dashboard_card)}>
              <CardHeader>
                <CardTitle>
                  <div
                    className={styles["flex-between"]}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    Order Statistics
                    <CardIcon color={selectedCourier.bgColor}>
                      <Truck size={20} color={selectedCourier.color} />
                    </CardIcon>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={paymentStyles.orderStats}>
                  {/* Big Number */}
                  <div className={paymentStyles.orderStatsBig}>
                    <h1 className={paymentStyles.orderStatsBigNumber}>
                      {selectedCourier.totalOrders}
                    </h1>
                    <span className={paymentStyles.orderStatsBigLabel}>
                      Total Orders
                    </span>
                  </div>

                  {/* Delivered vs Returned */}
                  <div className={paymentStyles.orderStatsBar}>
                    <div className={paymentStyles.orderStatsBarLabels}>
                      <span style={{ color: "#17A600" }}>
                        ✓ Delivered ({selectedCourier.deliveredOrders})
                      </span>
                      <span style={{ color: "#FF1212" }}>
                        ↩ Returned ({selectedCourier.returnedOrders})
                      </span>
                    </div>
                    <div className={paymentStyles.dualProgressBar}>
                      <div
                        className={paymentStyles.dualProgressFill}
                        style={{
                          width: `${
                            (selectedCourier.deliveredOrders /
                              selectedCourier.totalOrders) *
                            100
                          }%`,
                          backgroundColor: "#17A600",
                          borderRadius: "8px 0 0 8px",
                        }}
                      ></div>
                      <div
                        className={paymentStyles.dualProgressFill}
                        style={{
                          width: `${
                            (selectedCourier.returnedOrders /
                              selectedCourier.totalOrders) *
                            100
                          }%`,
                          backgroundColor: "#FF1212",
                          borderRadius: "0 8px 8px 0",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className={paymentStyles.miniStats}>
                    <div className={paymentStyles.miniStat}>
                      <div
                        className={paymentStyles.miniStatDot}
                        style={{ backgroundColor: "#17A600" }}
                      ></div>
                      <div className={paymentStyles.miniStatContent}>
                        <span className={paymentStyles.miniStatLabel}>
                          Delivery Rate
                        </span>
                        <span className={paymentStyles.miniStatValue}>
                          {Math.round(
                            (selectedCourier.deliveredOrders /
                              selectedCourier.totalOrders) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div className={paymentStyles.miniStat}>
                      <div
                        className={paymentStyles.miniStatDot}
                        style={{ backgroundColor: "#FF1212" }}
                      ></div>
                      <div className={paymentStyles.miniStatContent}>
                        <span className={paymentStyles.miniStatLabel}>
                          Return Rate
                        </span>
                        <span className={paymentStyles.miniStatValue}>
                          {Math.round(
                            (selectedCourier.returnedOrders /
                              selectedCourier.totalOrders) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div className={paymentStyles.miniStat}>
                      <div
                        className={paymentStyles.miniStatDot}
                        style={{ backgroundColor: "#F28F1A" }}
                      ></div>
                      <div className={paymentStyles.miniStatContent}>
                        <span className={paymentStyles.miniStatLabel}>
                          Last Payment
                        </span>
                        <span className={paymentStyles.miniStatValue}>
                          {selectedCourier.lastPayment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Requests Card */}
          <Grid item xs={12} sm={6} lg={4}>
            <Card className={cls(styles.dashboard_card)}>
              <CardHeader>
                <CardTitle>
                  <div
                    className={styles["flex-between"]}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    Recent Requests
                    <CardIcon color={selectedCourier.bgColor}>
                      <Banknote size={20} color={selectedCourier.color} />
                    </CardIcon>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={paymentStyles.requestsList}>
                  {selectedCourier.paymentRequests.map((request) => (
                    <div
                      key={request.id}
                      className={paymentStyles.requestItem}
                    >
                      <div className={paymentStyles.requestItemLeft}>
                        <div
                          className={paymentStyles.requestIdBadge}
                          style={{
                            backgroundColor: selectedCourier.bgColor,
                            color: selectedCourier.color,
                          }}
                        >
                          {request.id}
                        </div>
                        <div className={paymentStyles.requestMeta}>
                          <span className={paymentStyles.requestDate}>
                            {request.date}
                          </span>
                        </div>
                      </div>
                      <div className={paymentStyles.requestItemRight}>
                        <span className={paymentStyles.requestAmount}>
                          {formatCurrency(request.amount)}
                        </span>
                        <StatusBadge status={request.status} />
                      </div>
                    </div>
                  ))}

                  {/* View All Link */}
                  <button className={paymentStyles.viewAllBtn}>
                    View All Requests
                    <ChevronRight size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PaymentRequestSection;
