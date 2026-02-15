import React, { isValidElement, useMemo } from "react";
import * as checkboard from "./checkboardhelpers";
import style from "./style.module.css";

export const Checkboard = ({
  white = "transparent",
  grey = "rgba(0,0,0,.08)",
  size = 8,
  renderers = {},
  borderRadius,
  boxShadow,
  children,
}) => {
  const checkboardPattern = useMemo(() => {
    return `url(${checkboard.get(
      white,
      grey,
      size,
      renderers.canvas
    )}) center left`;
  }, [white, grey, size, renderers.canvas]);

  return isValidElement(children) ? (
    React.cloneElement(children, {
      ...children.props,
      style: { ...children.props.style, ...style.grid },
    })
  ) : (
    <div
      style={{
        borderRadius,
        boxShadow,
        background: checkboardPattern,
      }}
      className={style.grid}
    />
  );
};

export default Checkboard;
