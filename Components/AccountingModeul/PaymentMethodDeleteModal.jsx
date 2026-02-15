import { Box, Modal } from '@mui/material';

const PaymentMethodDeleteModal = ({ openModal, closeModal, deletePaymentMethodCategory }) => {
  return (
    <div>
      <Modal
        open={openModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="tableModal"
      >
        <Box>
          <div className="tableModalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-edit"></i>
                <h4>Are you sure want to delete?</h4>
              </div>
              <div className="right" onClick={closeModal}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>
            <div className="category_delete_wrapper">
              <div className='confirm_btn' onClick={deletePaymentMethodCategory}>Yes</div>
              <div className='cancel_btn' onClick={closeModal}>No</div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default PaymentMethodDeleteModal;