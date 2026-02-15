import { Box } from "@mui/material";
import style from "./style.module.css";
import { id } from "date-fns/locale";
import { useState } from "react";
import { Colors } from "../ColorPicker/Colors";

export const ColorCustomize = ({background, setBackground}) => {

  return (
    <section className={style.HomeSlider}>
      <div
        className={`boxShadow ${style["padding-x-0"]} ${style.colorSection}`}
      >
        <Box>
          <div>
            <h1 className={style.header}>Multipage Color Customization</h1>
            <div className={style.inner}>
              <div>
                <Colors background={background} setBackground={setBackground}/>
              </div>
              <div>
                <h1>
                  <div className={style.icon}>
                    <svg viewBox="0 0 25 24" fill="none">
                      <path
                        d="M19.75 3V7M17.75 5H21.75M19.75 17V21M17.75 19H21.75M10.75 5L9.28001 8.72721C9.0921 9.20367 8.99814 9.4419 8.85427 9.64278C8.72675 9.82084 8.57084 9.97675 8.39278 10.1043C8.1919 10.2481 7.95367 10.3421 7.47721 10.53L3.75 12L7.47721 13.47C7.95367 13.6579 8.1919 13.7519 8.39278 13.8957C8.57084 14.0233 8.72675 14.1792 8.85427 14.3572C8.99814 14.5581 9.0921 14.7963 9.28001 15.2728L10.75 19L12.22 15.2728C12.4079 14.7963 12.5019 14.5581 12.6457 14.3572C12.7733 14.1792 12.9292 14.0233 13.1072 13.8957C13.3081 13.7519 13.5463 13.6579 14.0228 13.47L17.75 12L14.0228 10.53C13.5463 10.3421 13.3081 10.2481 13.1072 10.1043C12.9292 9.97675 12.7733 9.82084 12.6457 9.64278C12.5019 9.4419 12.4079 9.20367 12.22 8.72721L10.75 5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  If you click the "reset" button the "footer form color" and
                  the "checkout form color" will be removed.
                </h1>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </section>
  );
};

export default ColorCustomize;
