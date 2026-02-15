import { Box, Button, Modal, Pagination } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import style from "./style.module.css";
import axios from "axios";
import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const FraudNote = ({ openModal, setOpenModal, fraudActivId }) => {
  const [OrderfraudsNote, setOrderfraudsNote] = useState([]);
  const [loding, setLoding] = useState(false);
  const handleFetchOrdfraudsNote= useCallback(async () => {
    if (fraudActivId) {
      try {
        setLoding(true);
        let data = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}/client/fraud-notes/${fraudActivId}`,
          headers: headers,
        });
        if(data?.data?.data){
          setLoding(false);
          setOrderfraudsNote(data?.data?.data);
        }
      
      } catch (err) {}
    }
  }, [fraudActivId]);
  useEffect(() => {
    handleFetchOrdfraudsNote();
  }, [handleFetchOrdfraudsNote]);
  return (
    <Modal
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
          </div>{
            loding ? <div className="loader">Note Loading...</div>
            :
            <div className={style.modalContent}>
            {!!OrderfraudsNote && OrderfraudsNote.map((note, index) => (
              <div key={index} className={style.modalItem}>
                <div className={style.modalItemHeader}>
                  <div>
                    <h1>Name: </h1>
                    {note.name}
                  </div>
                  <div>
                    <h1>Date: </h1>
                    {note.mark_at}
                  </div>
                </div>
                <p>{note.note}</p>
              </div>
            ))}
          </div>

          }
        
          {/* <div className={style.pagination}>
            <Pagination count={10} color="primary" />
          </div> */}
        </div>
      </Box>
    </Modal>
  );
};

export default FraudNote;
