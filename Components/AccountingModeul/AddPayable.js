import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const AddPayable = ({
  handleCloseSuggestNote1,
  openSuggestNote1,
  fetchCaseInPayableData,
  type,
  fetchCaseOutPayableData,
  closeAllModal,
  setSelectedPayableCategory,
  addValue
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addPayable = async data => {
    data.type = type;
    
    const addPayableRes = await axios.post(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.CREATE_PAYOR_METHOD}`,
      data,
      {
        headers: headers,
      }
    );

    if (addPayableRes?.data?.success) {
      addValue([{ value: addPayableRes?.data?.data?.id, label: addPayableRes?.data?.data?.name }])
    // addValue(addPayableRes?.data?.data?.id)
      if (type === "CashIn") {
        fetchCaseInPayableData();
      } else {
        fetchCaseOutPayableData();
      }
      handleCloseSuggestNote1();
    } else {
      Swal.fire({
        icon: "error",
        title: addPayableRes?.data?.msg,
      });
      closeAllModal();
    }
    reset();
  };

  return (
    <div className="NoteHover">
      <Modal
        open={openSuggestNote1}
        onClose={handleCloseSuggestNote1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="tableModal"
      >
        <Box>
          <form onSubmit={handleSubmit(addPayable)}>
            <div className="tableModalContent">
              <div className="header">
                <div className="left">
                  <i className="flaticon-edit"></i>
                  <h4>Please Enter Your Payable/Payor</h4>
                </div>
                <div className="right" onClick={handleCloseSuggestNote1}>
                  <i className="flaticon-close-1"></i>
                </div>
              </div>
              <div className="tableModalForm">
                <div className="customInput">
                  <label>Payable/Payor</label>
                  <input
                    type="text"
                    placeholder="Enter Your Category/Ledger"
                    {...register("name", { required: true, maxLength: 20 })}
                  />
                  {errors.name && <span>This field is required</span>}
                </div>
              </div>
              <div className="duelButton">
                <Button type="submit">Add Payable/Payor</Button>
                {/* <Button className="red">Reset</Button> */}
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddPayable;
