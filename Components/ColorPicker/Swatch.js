import React from "react";

import Checkboard from "./Checkboard";

const ENTER = 13;

import style from "./style.module.css";
import { handleFocus } from "./interaction";

export const Swatch = ({
  color,
  className,
  onClick = () => {},
  onHover,
  title = color,
  children,
  focus,
  focusStyle = {},
}) => {
  const transparent = color === "transparent";

  const handleClick = e => onClick(color, e);
  const handleKeyDown = e => e.keyCode === ENTER && onClick(color, e);
  const handleHover = e => onHover(color, e);

  const optionalEvents = {};
  if (onHover) {
    optionalEvents.onMouseOver = handleHover;
  }

  return (
    <div
      className={`${style.swatches2} ${className} ${
        focus ? style.focused : ""
      }`}
      style={{ background: color }}
      onClick={handleClick}
      title={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...optionalEvents}
    >
      {children}
      {transparent && (
        <Checkboard
          borderRadius={style.swatch.borderRadius}
          boxShadow="inset 0 0 0 1px rgba(0,0,0,0.1)"
        />
      )}
    </div>
  );
};

export default handleFocus(Swatch);
