import React, { useState } from "react";
import Sketch from "./ColorPicker";

export const Colors = ({background, setBackground}) => {


  const handleChangeComplete = color => {
    setBackground(color.hex);
  };

  const handleReset = () => {
    setBackground("#fff");
  };

  return (
    <Sketch
      color={background}
      onReset={handleReset}
      onChangeComplete={handleChangeComplete}
    />
  );
};

export default Colors;
