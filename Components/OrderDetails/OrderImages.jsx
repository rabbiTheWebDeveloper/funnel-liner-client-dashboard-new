import * as React from "react";
import style from "./style.module.css";
import { Button, Dialog, MobileStepper } from "@mui/material";

const Carousel = ({ images, activeStep, setActiveStep }) => {
  const totalSteps = React.useMemo(() => images.length, [images]);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };


  return (
    <div className={style.Carousel}>
      <div className={style.CarouselInner}>
        <div className={style.CarouselImages}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`${style.CarouselItem} ${
                index === activeStep ? style.activeCarousel : ""
              }`}
            >
              <img
                className={style.CarouselImage}
                src={image}
                alt="product image"
              />
            </div>
          ))}
        </div>

        <div className={style.CarouselControls}>
          <MobileStepper
            steps={totalSteps}
            position="static"
            variant="dots"
            classes={{
              dot: style.CarouselDot,
              dotActive: style.CarouselDotActive,
            }}
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === totalSteps - 1}
                className={style.CarouselButton}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                className={style.CarouselButton}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export const OrderImages = ({ images }) => {
  console.log(images);
  const [showCarousel, setShowCarousel] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  if (!images) return null;

  return (
    <div className={style.OrderImages}>
      <Dialog
        open={showCarousel}
        onClose={() => setShowCarousel(false)}
        classes={{ paper: style.CarouselDialog }}
        maxWidth="false"
      >
        <Carousel
          images={images}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Dialog>
      {images?.map((image, i) => (
        <div
          key={i}
          className={style.img}
          onClick={() => {
            setShowCarousel(true), setActiveStep(i);
          }}
        >
          <div className={style.overlay}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" x2="16.65" y1="21" y2="16.65" />
              <line x1="11" x2="11" y1="8" y2="14" />
              <line x1="8" x2="14" y1="11" y2="11" />
            </svg>
          </div>
          <img src={image} alt="" />
        </div>
      ))}
    </div>
  );
};
