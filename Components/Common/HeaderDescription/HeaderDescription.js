import { Container, Tooltip } from "@mui/material";
import React, { useState } from "react";
import style from "./style.module.css";
import AsyncSearchBar from "../AsyncSearchBar";
import { Box, Button, Modal } from "@mui/material";

const HeaderDescription = ({
  videoLink,
  headerIcon,
  novideo,
  title,
  subTitle,
  subTitle2,
  search,
  setSearch,
  order,
  setSearchedOrder,
  setOrders,
  handleChange,
  handleFilterStatusChange,
  setEnableGlobalSearch,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <section className={style.HeaderDescription}>
        <Container maxWidth="sm">
          <div className="boxShadow">
            <div className={style.HeaderDescriptionContent}>
              {/* Left */}
              <div className={style.Left}>
                <div className={style.icon}>
                  <i className={headerIcon}></i>
                </div>

                <div className={style.text}>
                  <h4>{title}</h4>
                  <p>{subTitle}</p>
                  <p>{subTitle2}</p>
                </div>
              </div>

              {/* right */}
              <div className={style.Right}>
                {!novideo && (
                  <div className={style.VideoIcon}>
                    <Tooltip title={videoLink?.title} placement="top-start">
                      <Button onClick={handleOpen}>
                        <i className="flaticon-video-camera"></i>
                      </Button>
                    </Tooltip>
                  </div>
                )}
                {search != false && (
                  <div className={style.SearchFilter}>
                    <div className={style.customInput}>
                      <input
                        type="text"
                        placeholder="Search Here..."
                        onKeyUp={e =>{ setSearch(e.target.value); handleChange && handleChange(e)}}
                      />
                    </div>
                  </div>
                )}
                {order != false && (
                  <div className={style.SearchFilter}>
                    <div className={style.customInput}>
                      <AsyncSearchBar
                        setSearchedOrder={setSearchedOrder}
                        setOrders={setOrders}
                        handleFilterStatusChange={handleFilterStatusChange}
                        setEnableGlobalSearch={setEnableGlobalSearch}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="viewModal"
      >
        <Box className="modalBox">
          <div className="modalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-video-camera"></i>
                <h4>Watch Video Tutorial</h4>
              </div>

              <div className="right" onClick={handleClose}>
                <i className="flaticon-close-1"></i>
              </div>
            </div>
            <div className={style.youTubeVideo}>
              {videoLink?.video ? (
                <iframe
                  src={videoLink?.video}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  autoplay
                ></iframe>
              ) : (
                <img src="/images/coming_soon.png" alt="video commming soon " />
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default HeaderDescription;
