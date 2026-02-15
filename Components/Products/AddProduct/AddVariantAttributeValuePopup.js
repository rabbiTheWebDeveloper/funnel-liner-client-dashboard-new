import { Box, Button, Grid, Modal } from "@mui/material";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import style from "./addCategory.module.css";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
import { replaceSpacesWithHyphens } from "../../../utlit/product";

const AddVariantAttributeValue = ({
  fetchVariantValuesOnAttribute,
  openModal,
  closeModal,
  variantAttributeId,
}) => {
  const showToast = useToast();

  const { register, handleSubmit } = useForm();

  const onCategorySubmit = async values => {
    // console.log(replaceSpacesWithHyphens(values?.variant_attribute_value));
    const formData = new FormData();
    formData.append("value", replaceSpacesWithHyphens(values?.variant_attribute_value));
    formData.append("attribute_id", variantAttributeId);

    const createVariantAttributeRes = await axios.post(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.CREATE_VARIANT_ATTRIBUTE_VALUE}`,
      formData,
      { headers: headers }
    );

    if (createVariantAttributeRes?.data?.success) {
      fetchVariantValuesOnAttribute(variantAttributeId);
      showToast("Created Variant Attribute Value", "success");
    } else {
      showToast("Variant Attribute Value Created Failure", "error");
    }

    closeModal();
  };

  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="updateModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="">
            {/* Shop Info */}
            <div className="DashboardFormItem">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <form onSubmit={handleSubmit(onCategorySubmit)}>
                    <div className={style.AddProduct}>
                      <div className={style.header}>
                        <h4>Add Product Variant Attribute Value</h4>
                      </div>
                      <div className={style.FormValidation}>
                        <div className={style.customInput}>
                          <label>
                            Variant Attribute Value <span>*</span>
                          </label>
                          <input
                            type="text"
                            {...register("variant_attribute_value", {
                              required: true,
                            })}
                            placeholder="Variant Attribute Value"
                          />
                        </div>
                      </div>
                      <div className={style.Submit}>
                        <Button type="submit">
                          <i className="flaticon-install"></i> Add Variant
                          Attribute Value
                        </Button>
                      </div>
                    </div>
                  </form>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddVariantAttributeValue;
