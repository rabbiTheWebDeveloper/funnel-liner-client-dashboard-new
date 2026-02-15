import { Box, Button, CircularProgress, Modal, Stack } from "@mui/material";
import SuperFetch from "../../hook/Axios";
import { headers } from "../../pages/api";
import { useEffect, useState } from "react";
import { useToast } from "../../hook/useToast";
import { error } from "next/dist/build/output/log";
import Select from "react-select";
import RedexSelector from "./RedxCourier/Selector";

const RedxCourierModel = ({ redxModal, setRedxModal , handleFetch }) => {
  const [areas, setAreas] = useState([]);
  const [selectArea, setSelectArea] = useState({});
  const showToast = useToast();
  useEffect(() => {
    const handleZone = async city_id => {
      try {
        const res = await SuperFetch.get("/client/courier/redx/area", {
          headers: headers,
        });

        const zones = res?.data?.data?.areas.map(area => {
          return {
            value: area.id,
            label: area.name,
          };
        });
        setAreas(zones);
        console.log(zones);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching zones:", error);
      }
    };

    if (redxModal?.orderID) {
      handleZone();
    }

    // No cleanup needed, so no return statement
  }, [redxModal?.orderID]);

  const handleSubmitPathaoLocation = async () => {
    SuperFetch.post(
      "/client/courier/send-order",
      {
        delivery_area: selectArea.label,
        delivery_area_id: selectArea.value,
        provider: "redx",
        order_id: redxModal?.orderID,
      },
      { headers: headers }
    )
      .then(res => {
        handleFetch();
        setRedxModal({ ...redxModal, open: false });
      
        if (res.data.type === true) {
          showToast("res.data?.message");
        } else {
          showToast(" Order Send Redx Successfully");
        }
      })
      .catch(err => {
        handleFetch();
        setRedxModal({ ...redxModal, open: false });
        showToast("Something went wrong");
        return err;
      });
  };

  return (
    <Modal
      open={redxModal?.open}
      onClose={() => setRedxModal({ ...redxModal, open: false })}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="viewModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="header">
            <div className="left">
              <i className="flaticon-edit" />
              <h4>Select Address</h4>
            </div>

            <div
              className="right"
              onClick={() => setRedxModal({ ...redxModal, open: false })}
            >
              <i className="flaticon-close-1" />
            </div>
          </div>
          {areas.length > 0 ? (
            <div className="customInput">
              <label>
                Select Area<span>*</span>
              </label>

              <RedexSelector data={areas} setSelectArea={setSelectArea} />
            </div>
          ) : (
            <Stack
              sx={{ color: "grey.500" }}
              spacing={2}
              direction="row"
              alignItems="center"
            >
              <CircularProgress color="inherit" />
            </Stack>
          )}

          <Button
            className="small_main_button"
            onClick={handleSubmitPathaoLocation}
          >
            Confirm
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RedxCourierModel;
