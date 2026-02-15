import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { headers } from "../../../pages/api";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const ShowSubCategory = ({ id, isOpen, closePopup, categories }) => {
  const [subCategory, setSubCategory] = useState();

  useEffect(() => {
    axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORY}/${id}`,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        setSubCategory(response.data.data);
      });
  }, [id]);

  // Get parent category name by id
  const getParentCategoryName = (parentId) => {
    const parent = categories?.find((cat) => cat.id === parentId);
    return parent ? parent.name : "N/A";
  };

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
                <h4>View Sub Category</h4>
              </div>

              <div className="right" onClick={closePopup}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>

            <div className="table">
              <table>
                <tr>
                  <th>Sub Category Name</th>
                  <td>{subCategory?.name}</td>

                  <th>Parent Category</th>
                  <td>{getParentCategoryName(subCategory?.parent_id)}</td>
                </tr>
                <tr>
                  <th>Sub Category Image</th>
                  <td>
                    <img src={subCategory?.category_image} alt="" />
                  </td>

                  <th>Status</th>
                  <td>{subCategory?.status ? "Active" : "Inactive"}</td>
                </tr>
              </table>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ShowSubCategory;
