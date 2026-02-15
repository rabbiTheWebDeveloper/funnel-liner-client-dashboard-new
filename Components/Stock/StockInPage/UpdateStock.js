import { Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../../hook/useToast";

import { headers } from "../../../pages/api/";
import Spinner from "../../commonSection/Spinner/Spinner";
import style from "./style.module.css";
import useLoading from "../../../hook/useLoading";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";
const UpdateStock = ({ productId, open, onClosePopup, fetchStockProducts }) => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const showToast = useToast();
  const [stock, setStock] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchSingleProduct = useCallback(async () => {
    await axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.STOCK_IN.GET_STOCK_IN_PRODUCT}/${productId}`,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        setStock(response.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  useEffect(() => {
    fetchSingleProduct();
  }, [fetchSingleProduct]);

  const onSubmit = (data) => {
    startLoading();
    data.product_id = stock.id;
    axios
      .post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.STOCK_IN.UPDATE_STOCK_IN_PRODUCT}`, data, {
        headers: headers,
      })
      .then(function (response) {
        if (response.data.success) {
          showToast("Stock Update Successfully!", "success");
          onClosePopup();
          fetchStockProducts()
        }
      })
      .catch(function (error) {
        stopLoading();
        showToast("Something went wrong", "error");
      });
    reset();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="updateModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="header">
            <div className="left">
              <i className="flaticon-edit"></i>
              <h4>Update Stock</h4>
              {/* <p>Update Your Stock, Increase And Decrease Your Stock</p> */}
            </div>

            <div className="right" onClick={onClosePopup}>
              <i className="flaticon-close-1"></i>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="updateModalForm">
              <div className="customInput">
                <div className={style.uploadImage}>
                  <img src={stock?.main_image || stock?.wp_product_image_url} alt={stock?.product_name} />
                  <h6>{stock?.product_name}</h6>
                </div>
              </div>

              <div className="customInput">
                <h4>
                  Current Stock:<span>{stock.product_qty}</span>
                </h4>
                <label>Stock Update:</label>
                <input
                  type="text"
                  {...register("stock_quantity", { required: true })}
                />
                {errors.stock_quantity && (
                  <p className="error">Stock Quantity field is required</p>
                )}
              </div>
            </div>

            <div className="duelButton">
              {isLoading ? (
                <>
                  <Button disabled type="submit">
                    <Spinner /> Update
                  </Button>
                </>
              ) : (
                <Button type="submit"> Update</Button>
              )}
              <Button type="reset" className="red">
                Reset
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default UpdateStock;
