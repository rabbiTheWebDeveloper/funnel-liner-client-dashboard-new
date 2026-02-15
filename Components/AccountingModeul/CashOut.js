import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { headers } from "../../pages/api";
import AddCategory from "./AddCategory";
import AddPayable from "./AddPayable";
import AddPayment from "./AddPayment";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { useToast } from "../../hook/useToast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import PayorDeleteModal from "./PayorDeleteModal";
import LedgerDeleteModal from "./LedgerDeleteModal";
import PaymentMethodDeleteModal from "./PaymentMethodDeleteModal";

const CashOut = ({
  fetchCaseOutPayableData,
  fetchCaseOutLedgerData,
  caseOutPayableData,
  caseOutLedgerData,
  caseOutPaymentMethodData,
  fetchCaseOutPaymentMethodData,
  handleFetchMutiSearch,
  closeCashOutModal,
  openModal,
}) => {
  const showToast = useToast();
  const [openSuggestNote, setOpenSuggestNote] = useState(false);
  const [openSuggestNote1, setOpenSuggestNote1] = useState(false);
  const [openSuggestNote2, setOpenSuggestNote2] = useState(false);
  const handleOpenSuggestNote = () => setOpenSuggestNote(true);
  const handleCloseSuggestNote = () => setOpenSuggestNote(false);
  const handleOpenSuggestNote1 = () => setOpenSuggestNote1(true);
  const handleCloseSuggestNote1 = () => setOpenSuggestNote1(false);
  const [inputValue, setInputValue] = useState([]);
  const [inputValue1, setInputValue1] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const [selectDeleteItemId, setSelectDeleteItemId] = useState(null);
  const [openPayorDeleteModal, setOpenPayorDeleteModal] = useState(false);
  const [openLedgerDeleteModal, setOpenLedgerDeleteModal] = useState(false);
  const [openPaymentMethodDeleteModal, setOpenPaymentMethodDeleteModal] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSelectChange = selectedOption => {
    if (selectedOption.value === "add") {
      setInputValue("");
      handleOpenSuggestNote();
    } else {
      setInputValue([
        { value: selectedOption.value, label: selectedOption.label },
      ]);
    }
  };

  const handleSelectChange1 = selectedOption => {
    if (selectedOption.value === "addPayable") {
      handleOpenSuggestNote1();
    } else {
      setInputValue1([
        { value: selectedOption.value, label: selectedOption.label },
      ]);
    }
  };

  const cashForm = useCallback(
    async data => {
      if (inputValue1[0]?.value === "addPayable") {
        showToast("Please select valid Payable option", "error");
      } else if (
        inputValue[0]?.value === "add" ||
        inputValue[0]?.value === ""
      ) {
        showToast("Please select valid Ledger option", "error");
      } else if (paymentType[0]?.value === "add") {
        showToast("Please select valid Payment Method option", "error");
      } else {
        data.payor_id = inputValue1[0]?.value;
        data.ledger_id = inputValue[0]?.value;
        data.payment_type = paymentType[0]?.label;
        data.payment_id = paymentType[0]?.value;

        const cashOutRes = await axios.post(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.CREATE_CASE_OUT}`,
          data,
          {
            headers: headers,
          }
        );
        if (cashOutRes?.data?.success) {
          handleFetchMutiSearch();
          Swal.fire("Cash Out Successfully!", cashOutRes.data.msg, "success");
          reset();
          setInputValue1("");
          setInputValue("");
        } else {
          Swal.fire({
            icon: "error",
            title: error?.cashOutRes?.data?.msg,
          });
        }
        closeCashOutModal();
      }
    },
    [
      inputValue1[0]?.value,
      inputValue[0]?.value,
      paymentType[0]?.label,
      paymentType[0]?.value,
    ]
  );

  const handlePaymentTypeChange = e => {
    if (e?.value === "add") {
      setOpenSuggestNote2(true);
    } else {
      setPaymentType([{ value: e?.value, label: e?.label }]);
    }
  };
  const handleClosePaymentMethod = () => {
    setOpenSuggestNote2(false);
  };

  const deletePayorCategory = async () => {
    const deleteRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.DELETE_PAYOR_CATEGORY}${selectDeleteItemId}`,
      {
        headers: headers,
      }
    );
    if (deleteRes?.data?.success) {
      fetchCaseOutPayableData();
      showToast("Your Payor has been deleted.", "success");
    } else {
      showToast("Not Deleted", "error");
    }
    setOpenPayorDeleteModal(false);
  };

  const deleteLedgerCategory = async () => {
    const deleteRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.DELETE_LEDGER_CATEGORY}${selectDeleteItemId}`,
      {
        headers: headers,
      }
    );
    if (deleteRes?.data?.success) {
      fetchCaseOutLedgerData();
      showToast("Your Ledger has been deleted.", "success");
    } else {
      showToast("Not Deleted", "error");
    }
    setOpenLedgerDeleteModal(false);
  };

  const deletePaymentMethodCategory = async () => {
    const deleteRes = await axios.get(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.DELETE_PAYMENT_TYPE_CATEGORY}${selectDeleteItemId}`,
      {
        headers: headers,
      }
    );
    if (deleteRes?.data?.success) {
      fetchCaseOutPaymentMethodData();
      showToast("Your Payment Method has been deleted.", "success");
    } else {
      showToast("Not Deleted", "error");
    }
    setOpenPaymentMethodDeleteModal(false);
  };

  const CustomPayorOption = ({ data, selectOption }) => {
    return (
      <div className="custom_section_wrapper">
        <div
          className="custom_section_option"
          onClick={() => selectOption(data)}
        >
          {data.label}
        </div>
        {data?.value === "addPayable" ? null : (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectDeleteItemId(data?.value);
              setOpenPayorDeleteModal(true);
            }}
          >
            <AiOutlineCloseCircle size={20} />
          </div>
        )}
      </div>
    );
  };

  const CustomLedgerOption = ({ data, selectOption }) => {
    return (
      <div className="custom_section_wrapper">
        <div
          className="custom_section_option"
          onClick={() => selectOption(data)}
        >
          {data.label}
        </div>
        {data?.value === "add" ? null : (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectDeleteItemId(data?.value);
              setOpenLedgerDeleteModal(true);
            }}
          >
            <AiOutlineCloseCircle size={20} />
          </div>
        )}
      </div>
    );
  };

  const CustomPaymentMethodOption = ({ data, selectOption }) => {
    return (
      <div className="custom_section_wrapper">
        <div
          className="custom_section_option"
          onClick={() => selectOption(data)}
        >
          {data.label}
        </div>
        {data?.value === "add" ? null : (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectDeleteItemId(data?.value);
              setOpenPaymentMethodDeleteModal(true);
            }}
          >
            <AiOutlineCloseCircle size={20} />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="AccountCashIn CashOut">
        <Modal
          open={openModal}
          onClose={closeCashOutModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="CashInModal updateModal"
        >
          <Box className="modalBox">
            <div className="modalContent">
              <div className="header">
                <div className="left">
                  <h3>
                    {" "}
                    <img src="/images/money-bill-minus.png" alt="" /> Cash Out
                    Entry
                  </h3>
                </div>
                <div className="right" onClick={closeCashOutModal}>
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
                      type="type"
                      {...register("amount", { required: true, maxLength: 20 })}
                      placeholder="Amount"
                    />
                    {errors.amount && (
                      <p className="error">This field is required</p>
                    )}
                  </div>
                  <div className="customInput">
                    <label>Payable/Payor </label>
                    <Select
                      options={caseOutPayableData}
                      onChange={handleSelectChange1}
                      menuPosition="fixed"
                      value={inputValue1}
                      components={{ Option: CustomPayorOption }}
                    />
                  </div>

                  <div className="customInput">
                    <label>Category/Ledger</label>

                    <Select
                      options={caseOutLedgerData}
                      onChange={handleSelectChange}
                      menuPosition="fixed"
                      value={inputValue}
                      components={{ Option: CustomLedgerOption }}
                    />
                  </div>

                  <div className="customInput">
                    <label>Payment Method</label>
                    <Select
                      options={caseOutPaymentMethodData}
                      onChange={handlePaymentTypeChange}
                      menuPosition="fixed"
                      value={paymentType}
                      components={{ Option: CustomPaymentMethodOption }}
                    />

                    {errors.payment_type && (
                      <span className="error">This field is required</span>
                    )}
                  </div>

                  <div className="customInput">
                    <label>Description</label>

                    <input
                      type="text"
                      {...register("description")}
                      placeholder="Description"
                    />
                    {errors.description && <span>This field is required</span>}
                  </div>
                </div>

                <div className="duelButton">
                  <Button type="submit">Save</Button>
                  {/* <Button type='reset' className="red">Save & Add New</Button> */}
                  {/* <Button type='reset' className="red">Save & Add New</Button> */}
                </div>
              </form>
            </div>
          </Box>
        </Modal>
      </div>
      {openSuggestNote2 ? (
        <AddPayment
          openSuggestNote1={openSuggestNote2}
          handleClosePaymentMethod={handleClosePaymentMethod}
          type={"CashOut"}
          fetchCaseOutPaymentMethodData={fetchCaseOutPaymentMethodData}
          addValue={setPaymentType}
        />
      ) : null}

      {openSuggestNote ? (
        <AddCategory
          openSuggestNote={openSuggestNote}
          handleCloseSuggestNote={handleCloseSuggestNote}
          type={"CashOut"}
          fetchLedgerData={fetchCaseOutLedgerData}
          addValue={setInputValue}
        />
      ) : null}

      {openSuggestNote1 ? (
        <AddPayable
          openSuggestNote1={openSuggestNote1}
          handleCloseSuggestNote1={handleCloseSuggestNote1}
          type={"CashOut"}
          fetchCaseOutPayableData={fetchCaseOutPayableData}
          closeAllModal={closeCashOutModal}
          addValue={setInputValue1}
        />
      ) : null}

      {openPayorDeleteModal ? (
        <PayorDeleteModal
          openModal={openPayorDeleteModal}
          closeModal={() => setOpenPayorDeleteModal(false)}
          deletePayorCategory={deletePayorCategory}
        />
      ) : null}

      {openLedgerDeleteModal ? (
        <LedgerDeleteModal
          openModal={openLedgerDeleteModal}
          closeModal={() => setOpenLedgerDeleteModal(false)}
          deleteLedgerCategory={deleteLedgerCategory}
        />
      ) : null}

      {openPaymentMethodDeleteModal ? (
        <PaymentMethodDeleteModal
          openModal={openPaymentMethodDeleteModal}
          closeModal={() => setOpenPaymentMethodDeleteModal(false)}
          deletePaymentMethodCategory={deletePaymentMethodCategory}
        />
      ) : null}
    </>
  );
};

export default CashOut;
