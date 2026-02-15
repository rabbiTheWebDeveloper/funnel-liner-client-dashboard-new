import { Box, Modal } from "@mui/material";
import { useState } from "react";


const WelcomePayment = () => {

    const [open, setOpen] = useState(true);

    // Model
    const [openModel, setOpenModel] = useState(true);
    const handleOpenModal = () => setOpenModel(true);
    const handleCloseModal = () => setOpenModel(true);
    return (

        <div className="WelcomeModel">
            <Modal
                open={openModel}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>

                    <div className="WelcomeModelContent">

                        <h3>Congratulations !</h3>
                        <h4>Your registration was successful! !</h4>

                        <div className="Gif d_flex d_justify">

                            <div className="img">
                                <img src="images/gif1.gif" alt="" />
                            </div>

                            <div className="img">
                                <img src="images/gif2.gif" alt="" />
                            </div>

                            <div className="img">
                                <img src="images/gif1.gif" alt="" />
                            </div>

                        </div>

                        <p>Please do the Payment</p>

                    </div>

                </Box>

            </Modal>

        </div>


    );
};

export default WelcomePayment;