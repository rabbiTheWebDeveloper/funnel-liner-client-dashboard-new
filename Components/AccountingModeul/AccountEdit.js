import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { default as AsyncSelect } from "react-select";
import Swal from "sweetalert2";

import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const AccountEdit = ({
  editData,
  handleFetch,
  balanceFetch,
  paymentMethodList,
  categoryList,
  reciverList,
  payableList,
  closeEditModal,
  openEditModal,
  LedgerList,
  handleFetchMutiSearch,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [update, setUpdate] = useState(false);
  const [inputValue, setInputValue] = useState(editData?.ledger_id || "");
  const [inputValue1, setInputValue1] = useState(editData?.payor_id || "");
  const [paymentMethodValue, setPaymentMethodValue] = useState(editData?.payment_id || "");
  const [paymentMethodName, setPaymentMethodName] = useState(editData?.payment_type || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSelectChange = selectedOption => {
    setInputValue(selectedOption.value);
  };
  const handleSelectChange1 = selectedOption => {
    setInputValue1(selectedOption.value);
  };

  const handlePaymentMethodType = selectedOption => {
    setPaymentMethodValue(selectedOption.value)
    setPaymentMethodName(selectedOption.label)
  }

  const cashForm = async data => {
    data.payor_id = inputValue1 === "" ? editData?.payor_id : inputValue1;
    data.ledger_id = inputValue === "" ? editData?.ledger_id : inputValue;
    data.payment_id = paymentMethodValue === "" ? editData?.payment_id : paymentMethodValue;
    data.payment_type = paymentMethodName === "" ? editData?.payment_id : paymentMethodName;;
    data.status = editData?.status;

    const editRes = await axios.post(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.UPDATE_PAYMENT}` +
        editData?.id,
      data,
      {
        headers: headers,
      }
    );
    if (editRes?.data?.success) {
      Swal.fire("Information update  Add!", editRes.data.msg, "success");
      handleFetchMutiSearch();
    } else {
      Swal.fire({
        icon: "error",
        title: editRes?.data?.msg,
      });
    }
    reset();
    closeEditModal();
  };

  return (
    <div className="AccountCashIn AccountEdit">
      <Modal
        open={openEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="updateModal"
      >
        <Box className="modalBox">
          <div className="modalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-edit"></i>
                <h4>Edit Entry</h4>
              </div>

              <div className="right" onClick={closeEditModal}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>

            <form onSubmit={handleSubmit(cashForm)}>
              <div className="updateModalForm">
                <div className="customInput">
                  <label>
                    Amount <span>*</span>
                  </label>
                  <input
                    defaultValue={editData?.amount}
                    type="type"
                    {...register("amount", { required: true, maxLength: 20 })}
                  />
                  {errors.amount && (
                    <p className="error">This field is required</p>
                  )}
                </div>

                <div className="customInput">
                  <label>Payable/Payor </label>

                  <AsyncSelect
                    defaultValue={payableList.find(
                      item => item.value == editData?.payor_id
                    )}
                    placeholder="Select an option..."
                    options={payableList}
                    onChange={handleSelectChange1}
                  />
                </div>

                <div className="customInput">
                  <label>Category/Ledger</label>
                  <AsyncSelect
                    defaultValue={LedgerList.find(
                      item => item.value == editData?.ledger_id
                    )}
                    placeholder="Select an option..."
                    options={LedgerList}
                    onChange={handleSelectChange}
                  />
                </div>

                <div className="customInput">
                <label>Payment Method </label>
                  <AsyncSelect
                    defaultValue={paymentMethodList.find(
                      item => item.value == editData?.payment_id
                    )}
                    placeholder="Select an option..."
                    options={paymentMethodList}
                    onChange={handlePaymentMethodType}
                  />
                </div>

                {/* <div className="customInput">
                  <label>Payment Method </label>
                  <select
                    name=""
                    {...register("payment_type")}
                    defaultValue={editData?.payment_type}
                  >
                    {Array.isArray(paymentMethodList)
                      ? paymentMethodList.map((payment, index) => {
                          return (
                            <option key={index} value={payment?.value}>
                              {payment.label}
                            </option>
                          );
                        })
                      : null}
                  </select>
                  {errors.payment_type && <span>This field is required</span>}
                </div> */}

                <div className="customInput">
                  <label>Description</label>
                  <input
                    defaultValue={editData?.description}
                    type="text"
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="duelButton">
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AccountEdit;
