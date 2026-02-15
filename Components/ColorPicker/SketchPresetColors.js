import React from "react";

import style from "./style.module.css";
import Swatch from "./Swatch";

export const SketchPresetColors = ({
  colors,
  onClick = () => {},
  onSwatchHover,
}) => {
  const handleClick = (hex, e) => {
    onClick(
      {
        hex,
        source: "hex",
      },
      e
    );
  };

  return (
    <div className={`flexbox-fix ${style.colors}`}>
      {colors.map(colorObjOrString => {
        const c =
          typeof colorObjOrString === "string"
            ? { color: colorObjOrString }
            : colorObjOrString;
        const key = `${c.color}${c.title || ""}`;
        return (
          <div key={key} className={style.swatchWrap}>
            <Swatch
              {...c}
              className={style.swatch}
              onClick={handleClick}
              onHover={onSwatchHover}
              focusStyle={{
                boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${c.color}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SketchPresetColors;
