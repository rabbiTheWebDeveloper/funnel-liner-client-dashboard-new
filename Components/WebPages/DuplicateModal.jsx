import React, { useState, useCallback, useEffect } from 'react'
import Modal from "@mui/material/Modal";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { AiOutlineLink } from "react-icons/ai";
import { domain, headers } from "../../pages/api";
import useLoading from "../../hook/useLoading";
import Cookies from "js-cookie";
import { API_ENDPOINTS } from '../../config/ApiEndpoints';
import axios from 'axios'
import Select from "react-select";
import Swal from "sweetalert2";


const LandingPageDuplicateModal = ({ openModal, closeModal, busInfo, id, fetchPages }) => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [pageTittle, setPageTittle] = useState("");
  const domain_request = Cookies.get("domain_request");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [showTitleErrorMsg, setShowTitleErrorMsg] = useState(false);
  const [showProductErrorMsg, setShowProductErrorMsg] = useState(false);

  const getProductsData = useCallback(async () => {
    const productsRes = await axios.get(`${API_ENDPOINTS.BASE_URL}/client/products-for-search`, { headers: headers })
    if (productsRes?.data?.success) {
      if (!productsRes?.data?.data?.length) {
        setProducts([])
      } else {
        const filterProductArr = productsRes?.data?.data?.map(function (item) {
          return { value: item.id, label: item.product_name };
        });
        setProducts(filterProductArr)
      }
    }
  }, [])

  const duplicatePage = async (title, duplicateId, selectProductId) => {
    if (!title?.length) {
      setShowTitleErrorMsg(true);
      return;
    } else if (selectProductId === null) {
      setShowProductErrorMsg(true);
      return;
    } else {
      const params = {
        title,
        product_id: selectProductId
      }
      const duplicatePageRes = await axios
        .post(`${API_ENDPOINTS.BASE_URL}/client/pages/${duplicateId}/duplicate`,
          params,
          {
            headers: headers,
          }
        )

      if (duplicatePageRes?.data?.success) {
        Swal.fire(duplicatePageRes.data.message, duplicatePageRes.data.message, "success");
        fetchPages()
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          footer: '<a href="">Why do I have this issue?</a>',
        });
      }
      closeModal();
    }

  };

  const indentifyLink = (status, domain, pageTittle) => {
    if (status === null) {
      return `https://funnelliner.com/${domain}/p/${pageTittle.toLowerCase().replace(/\s+/g, "-")}`;
    } else if (status === "pending") {
      return `https://funnelliner.com/${domain}/p/${pageTittle.toLowerCase().replace(/\s+/g, "-")}`;
    } else if (status === "connected") {
      return `https://${domain_request}/p/${pageTittle.toLowerCase().replace(/\s+/g, "-")}`;
    }
  };

  useEffect(() => {
    getProductsData()
  }, [getProductsData]);

  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="viewModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="header">
            <div className="left">
              <i className="flaticon-view"></i>
              <h4>Add Page</h4>
              {/* <p>Add pages for your website</p> */}
            </div>

            <div
              className="right"
              onClick={closeModal}
            >
              <i className="flaticon-close-1"></i>
            </div>
          </div>

          <div className="Form">
            <div className="customInput">
              <label>Page Title <span>*</span></label>
              <input
                type="text"
                onChange={(e) => {
                  setPageTittle(e.target.value.trim());
                  setShowTitleErrorMsg(false)
                }}
              />
              {showTitleErrorMsg ? <p style={{ fontSize: '12px', color: 'red' }}>Page title is required</p> : null}
            </div>

            <div className="customInput">
              <p className="PageLink">
                Page Link:{" "}
                <Link
                  href=""
                  className="SocialLink"
                  alt="Copy to clipboard"
                >
                  {indentifyLink(
                    busInfo?.domain_status,
                    domain,
                    pageTittle
                  )}
                  <AiOutlineLink />{" "}
                </Link>
              </p>
              <div className="customInput">
                <label>
                  Product Name <span>*</span>
                </label>
                <div className="Dropdown">
                  {products.length > 0 ? (
                    <Select
                      options={products}
                      onChange={(value) => {
                        setProductId(value?.value)
                        setShowProductErrorMsg(false)
                      }}
                    />
                  ) : (
                    <div className="text">
                      <Button>
                        <Link href="/add-product">
                          Add Products
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
                {showProductErrorMsg ? <p style={{ fontSize: '12px', color: 'red' }}>Product name is required</p> : null}

              </div>

              <div className="duelButton">
                {isLoading ? (
                  <Button
                    type="submit"
                    className="One"
                    disabled
                    id={item.id}
                  >
                    <Spinner />
                    Publish
                  </Button>

                ) : (
                  <Button
                    onClick={() => duplicatePage(pageTittle, id, productId)}
                    type="submit"
                    className="One"
                  >
                    Publish
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default LandingPageDuplicateModal;