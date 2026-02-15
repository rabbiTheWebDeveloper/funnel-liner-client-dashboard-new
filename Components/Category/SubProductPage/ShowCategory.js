import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { headers } from "../../../pages/api";

const ShowCategory = ({ id, isOpen, closePopup }) => {
    const [products, setProducts] = useState()
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/categories/" + id, {
        headers: headers,
      })
      .then(function (response) {
        // handle success
        setProducts(response.data.data);
      });
  }, [id]);

  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="viewModal"
      >
        <Box className="modalBox">
          <div className="modalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-view"></i>
                <h4>View Category</h4>
              </div>

              <div className="right" onClick={closePopup}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>

            <div className="table">
              <table>
                <tr>
                  <th>Category Name</th>
                  <td>{products?.name}</td>

                  <th>Category Image</th>
                  <td>
                    <img src={products?.category_image} alt="" />
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ShowCategory;
