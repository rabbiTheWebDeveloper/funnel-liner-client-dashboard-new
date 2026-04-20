import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import SuperFetch from "../../hook/Axios";
import { headers } from "../../pages/api";
import { useToast } from "../../hook/useToast";

const CarrybeeModal = ({ carrybeeModal, setCarrybeeModal, handleFetch }) => {
  const showToast = useToast();

  const [cities, setCities]   = useState([]);
  const [zones, setZones]     = useState([]);
  const [cityId, setCityId]   = useState("");
  const [zoneId, setZoneId]   = useState("");
  const [loadingZones, setLoadingZones] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ── Fetch cities when modal opens ── */
  useEffect(() => {
    if (!carrybeeModal?.orderID) return;

    SuperFetch.get("/client/courier/carrybee/cities", { headers })
      .then((res) => {
        const data = res?.data?.data?.data?.cities || [];
        console.log("data", data);
        const mapped = Array.isArray(data)
          ? data.map((c) => ({ value: c.id ?? c.city_id, label: c.name ?? c.city_name }))
          : [];
        setCities(mapped);
      })
      .catch(() => showToast("Failed to load Carrybee cities", "error"));

    // reset selections
    setCityId("");
    setZoneId("");
    setZones([]);
  }, [carrybeeModal?.orderID]);

  /* ── Fetch zones when city changes ── */
  useEffect(() => {
    if (!cityId) { setZones([]); setZoneId(""); return; }

    setLoadingZones(true);
    setZoneId("");
    SuperFetch.get(`/client/courier/carrybee/zones?city_id=${cityId}`, { headers })
      .then((res) => {
        const data = res?.data?.data.data.zones || [];
        const mapped = Array.isArray(data)
          ? data.map((z) => ({ value: z.id ?? z.zone_id, label: z.name ?? z.zone_name }))
          : [];
        setZones(mapped);
      })
      .catch(() => showToast("Failed to load Carrybee zones", "error"))
      .finally(() => setLoadingZones(false));
  }, [cityId]);

  /* ── Submit order ── */
  const handleSubmit = () => {
    if (!cityId || !zoneId) {
      showToast("Please select both city and zone", "error");
      return;
    }
    setSubmitting(true);
    SuperFetch.post(
      "/client/courier/send-order",
      {
        order_id: carrybeeModal?.orderID,
        provider: "carrybee",
        city_id: cityId,
        zone_id: zoneId,
      },
      { headers }
    )
      .then((res) => {
        handleFetch();
        setCarrybeeModal({ ...carrybeeModal, open: false });
        showToast("Order sent to Carrybee successfully", "success");
      })
      .catch(() => {
        handleFetch();
        setCarrybeeModal({ ...carrybeeModal, open: false });
        showToast("Something went wrong", "error");
      })
      .finally(() => setSubmitting(false));
  };

  const handleClose = () => setCarrybeeModal({ ...carrybeeModal, open: false });

  return (
    <Modal
      open={!!carrybeeModal?.open}
      onClose={handleClose}
      aria-labelledby="carrybee-modal-title"
      className="viewModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          {/* ── Header ── */}
          <div className="header">
            <div className="left">
              <img
                src="/images/carrybee-logo.png"
                alt="Carrybee"
                style={{ width: 28, height: "auto", marginRight: 8 }}
              />
              <h4>Send via Carrybee</h4>
            </div>
            <div className="right" onClick={handleClose}>
              <i className="flaticon-close-1" />
            </div>
          </div>

          {/* ── City selector ── */}
          {cities.length > 0 ? (
            <div className="customInput" style={{ marginTop: 20 }}>
              <label>
                Select City <span>*</span>
              </label>
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <Select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="" disabled>
                    <em>Choose a city…</em>
                  </MenuItem>
                  {cities.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : (
            <Stack spacing={2} direction="row" alignItems="center" sx={{ mt: 3 }}>
              <CircularProgress size={24} sx={{ color: "#f5a623" }} />
              <span style={{ fontSize: 13, color: "#74788d" }}>Loading cities…</span>
            </Stack>
          )}

          {/* ── Zone selector ── */}
          {cityId && (
            <div className="customInput" style={{ marginTop: 16 }}>
              <label>
                Select Zone <span>*</span>
              </label>
              {loadingZones ? (
                <Stack spacing={2} direction="row" alignItems="center" sx={{ mt: 1 }}>
                  <CircularProgress size={22} sx={{ color: "#f5a623" }} />
                  <span style={{ fontSize: 13, color: "#74788d" }}>Loading zones…</span>
                </Stack>
              ) : (
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <Select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: "10px" }}
                  >
                    <MenuItem value="" disabled>
                      <em>Choose a zone…</em>
                    </MenuItem>
                    {zones.map((z) => (
                      <MenuItem key={z.value} value={z.value}>
                        {z.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          )}

          {/* ── Submit ── */}
          <Button
            className="small_main_button"
            onClick={handleSubmit}
            disabled={submitting || !cityId || !zoneId}
            sx={{
              mt: 3,
              background: "linear-gradient(135deg, #f5a623, #f7c06a)",
              color: "#3a2000",
              fontWeight: 700,
              borderRadius: "10px",
              width: "100%",
              "&:hover": { opacity: 0.88 },
              "&.Mui-disabled": { opacity: 0.5, cursor: "not-allowed" },
            }}
          >
            {submitting ? (
              <CircularProgress size={18} sx={{ color: "#3a2000", mr: 1 }} />
            ) : null}
            Confirm & Send
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CarrybeeModal;
