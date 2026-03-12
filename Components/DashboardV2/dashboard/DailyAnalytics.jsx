import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardIcon,
} from "../components/ui/card/card";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Grid,
  Menu,
  MenuItem,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Chip,
} from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import moment from "moment";
import {
  Visibility,
  People,
  CalendarToday,
  Close,
  FilterList,
  TrendingUp,
  TrendingDown,
  History,
} from "@mui/icons-material";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import { headers, shopId } from "../../../pages/api";
import styles from "../global.module.css";
const DailyAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [todayData, setTodayData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const fetchTodayVisitors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_ENDPOINTS.BASE_URL}/client/shops/${shopId}/visitors/today`,
        { headers: { ...headers } }
      );
      setTodayData(res.data.data);
    } catch (err) {
      console.error("Error fetching today's visitors:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Visitors History
  const fetchHistoryVisitors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_ENDPOINTS.BASE_URL}/client/shops/${shopId}/visitors/history`,
        { headers: { ...headers } }
      );
      setHistoryData(res.data.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filtered history data
  const getFilteredData = () => {
    if (filter === "today") {
      return historyData.filter(
        (item) => item.date === moment().format("YYYY-MM-DD")
      );
    }
    if (filter === "yesterday") {
      return historyData.filter(
        (item) =>
          item.date === moment().subtract(1, "days").format("YYYY-MM-DD")
      );
    }
    if (filter === "weekly") {
      return historyData.filter((item) =>
        moment(item.date).isAfter(moment().subtract(7, "days"))
      );
    }
    if (filter === "monthly") {
      return historyData.filter((item) =>
        moment(item.date).isAfter(moment().subtract(30, "days"))
      );
    }
    if (filter === "custom" && startDate && endDate) {
      return historyData.filter((item) =>
        moment(item.date).isBetween(
          moment(startDate),
          moment(endDate),
          null,
          "[]"
        )
      );
    }
    return historyData;
  };

  useEffect(() => {
    fetchTodayVisitors();
    fetchHistoryVisitors();
  }, []);

  const filteredData = getFilteredData();

  // Calculate trends for today vs yesterday
  const getTrendData = () => {
    if (!todayData || historyData.length < 2) return null;

    const yesterdayData = historyData.find(
      (item) =>
        item.date === moment().subtract(1, "days").format("YYYY-MM-DD")
    );

    if (!yesterdayData) return null;

    const safePercent = (diff, base) =>
      base && base !== 0 ? ((diff / base) * 100).toFixed(1) : "0.0";

    const totalDiff =
      todayData.total_visitors - (yesterdayData.total_visitors || 0);
    const uniqueDiff =
      todayData.unique_visitors - (yesterdayData.unique_visitors || 0);
    const landingDiff =
      todayData.total_landing_page_visitors -
      (yesterdayData.total_landing_page_visitors || 0);

    return {
      total: {
        value: totalDiff,
        percent: safePercent(totalDiff, yesterdayData.total_visitors || 0),
      },
      unique: {
        value: uniqueDiff,
        percent: safePercent(uniqueDiff, yesterdayData.unique_visitors || 0),
      },
      landing: {
        value: landingDiff,
        percent: safePercent(
          landingDiff,
          yesterdayData.total_landing_page_visitors || 0
        ),
      },
    };
  };

  const trendData = getTrendData();

  const VisitorStatCard = ({ title, value, trend }) => (
    <Box sx={{
      p: 2,
      textAlign: 'center',
      borderRight: '1px solid #e0e0e0',
      '&:last-child': {
        borderRight: 'none',
      },
      width: '33.33%',
    }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
      {trend && (
        <Chip
          icon={trend.value >= 0 ? <TrendingUp /> : <TrendingDown />}
          label={`${trend.value >= 0 ? "+" : ""}${trend.percent}%`}
          sx={{
            mt: 1,
            backgroundColor: trend.value >= 0 ? '#4CAF50' : '#F44336',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
          size="small"
        />
      )}
    </Box>
  );

  return (
      <Grid item xs={12} sm={6} lg={2.4}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Daily Visitor Report
                  <CardIcon
                    color="#e1f5fe"
                    onClick={() => setOpenModal(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <History size={20} color="#03a9f4" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>

            
        <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
                >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Total </h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {todayData ? todayData.total_visitors : 0}
                  </h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
                >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Unique </h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {todayData ? todayData.unique_visitors : 0}
                  </h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
                >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Landing Page </h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>
                    {todayData ? todayData.total_landing_page_visitors : 0}
                  </h1>
                </Box>
              </Box>
            </CardContent>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 700,
                  maxHeight: "80vh",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  borderRadius: 2,
                  p: 3,
                  overflow: "auto",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Visitor History</Typography>
                  <IconButton onClick={() => setOpenModal(false)}>
                    <Close />
                  </IconButton>
                </Box>

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Total Visitors</TableCell>
                        <TableCell align="right">Unique Visitors</TableCell>
                        <TableCell align="right">
                          Landing Page Visitors
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((row) => (
                        <TableRow key={row.date}>
                          <TableCell>
                            {moment(row.date).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell align="right">
                            {row.total_visitors}
                          </TableCell>
                          <TableCell align="right">
                            {row.unique_visitors}
                          </TableCell>
                          <TableCell align="right">
                            {row.total_landing_page_visitors}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Modal>
          </Card>
        </Grid>
  );
};

export default DailyAnalytics;