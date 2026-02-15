import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
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
import Image from "next/image";
import moment from "moment";
import {
  Visibility,
  People,
  CalendarToday,
  Close,
  FilterList,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import searchAnimation from "../../../public/search.gif";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import { headers, shopId } from "../../../pages/api";

const VisitorStats = () => {
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
      (item) => item.date === moment().subtract(1, "days").format("YYYY-MM-DD")
    );

    if (!yesterdayData) return null;

    return {
      total: {
        value: todayData.total_visitors - yesterdayData.total_visitors,
        percent: (
          ((todayData.total_visitors - yesterdayData.total_visitors) /
            yesterdayData.total_visitors) *
          100
        ).toFixed(1),
      },
      unique: {
        value: todayData.unique_visitors - yesterdayData.unique_visitors,
        percent: (
          ((todayData.unique_visitors - yesterdayData.unique_visitors) /
            yesterdayData.unique_visitors) *
          100
        ).toFixed(1),
      },
      landing: {
        value:
          todayData.total_landing_page_visitors -
          yesterdayData.total_landing_page_visitors,
        percent: (
          ((todayData.total_landing_page_visitors -
            yesterdayData.total_landing_page_visitors) /
            yesterdayData.total_landing_page_visitors) *
          100
        ).toFixed(1),
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
    <Box sx={{ p: 0 }} >
      {/* Today Stats Card */}
      <Card sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: 3,
        background: 'linear-gradient(180deg, #f3e5f5, #e1bee7)',
      }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Visibility sx={{ mr: 1, color: "grey.700" }} /> Visitors Today
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              startIcon={<CalendarToday />}
              sx={{
                background: "linear-gradient(45deg, #a481e1 30%, #8b5cf6 90%)",
                color: "white",
              }}
            >
              View History
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Image src={searchAnimation} alt="Loading" width={40} height={40} />
            </Box>
          ) : todayData ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <VisitorStatCard
                title="Total Visitors"
                value={todayData.total_visitors}
                trend={trendData?.total}
              />
              <VisitorStatCard
                title="Unique Visitors"
                value={todayData.unique_visitors}
                trend={trendData?.unique}
              />
              <VisitorStatCard
                title="Landing Page Visitors"
                value={todayData.total_landing_page_visitors}
                trend={trendData?.landing}
              />
            </Box>
          ) : (
            <Typography variant="body1" sx={{ py: 2, textAlign: "center" }}>
              No data available
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Modal for History (No changes needed) */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 1000,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CalendarToday sx={{ mr: 1 }} /> Visitors History
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Filter Section */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <FilterList color="action" />
            <PopupState variant="popover" popupId="filter-menu">
              {(popupState) => (
                <>
                  <Button {...bindTrigger(popupState)} variant="outlined">
                    {filter.charAt(0).toUpperCase() + filter.slice(1)} ▼
                  </Button>
                  <Menu {...bindMenu(popupState)} TransitionComponent={Fade}>
                    {[
                      "today",
                      "yesterday",
                      "weekly",
                      "monthly",
                      "all",
                      "custom",
                    ].map((f) => (
                      <MenuItem
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          popupState.close();
                        }}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </PopupState>

            {/* Custom Date Filter */}
            {filter === "custom" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <Typography variant="body2">to</Typography>
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Box>
            )}
          </Box>

          {/* History Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table sx={{ minWidth: 650 }} aria-label="visitor history table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.100" }}>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Total Visitors</TableCell>
                    <TableCell align="right">Unique Visitors</TableCell>
                    <TableCell align="right">Landing Page Visitors</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell component="th" scope="row">
                          {moment(item.date).format("MMM DD, YYYY")}
                        </TableCell>
                        <TableCell align="right">
                          {item.total_visitors}
                        </TableCell>
                        <TableCell align="right">
                          {item.unique_visitors}
                        </TableCell>
                        <TableCell align="right">
                          {item.total_landing_page_visitors}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="textSecondary">
                          No data available for the selected filter
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default VisitorStats;