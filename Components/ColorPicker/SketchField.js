/* eslint-disable no-param-reassign */

import React from "react";
import * as color from "./color";

import style from "./style.module.css";
import EditableInput from "./EditableInput";

export const SketchFields = ({ onChange, rgb, hsl, hex }) => {
  const handleChange = (data, e) => {
    if (data.hex) {
      color.isValidHex(data.hex) &&
        onChange(
          {
            hex: data.hex,
            source: "hex",
          },
          e
        );
    } else if (data.r || data.g || data.b) {
      onChange(
        {
          r: data.r || rgb.r,
          g: data.g || rgb.g,
          b: data.b || rgb.b,
          a: rgb.a,
          source: "rgb",
        },
        e
      );
    } else if (data.a) {
      if (data.a < 0) {
        data.a = 0;
      } else if (data.a > 100) {
        data.a = 100;
      }

      data.a /= 100;
      onChange(
        {
          h: hsl.h,
          s: hsl.s,
          l: hsl.l,
          a: data.a,
          source: "rgb",
        },
        e
      );
    }
  };

  return (
    <div className={`flexbox-fix ${style.fields}`}>
      <div className={style.double}>
        <EditableInput
          style={{ input: style.input, label: style.label }}
          label="hex"
          value={hex.replace("#", "")}
          onChange={handleChange}
        />
      </div>
      <div className={style.single}>
        <EditableInput
          style={{ input: style.input, label: style.label }}
          label="r"
          value={rgb.r}
          onChange={handleChange}
          dragLabel="true"
          dragMax="255"
        />
      </div>
      <div className={style.single}>
        <EditableInput
          style={{ input: style.input, label: style.label }}
          label="g"
          value={rgb.g}
          onChange={handleChange}
          dragLabel="true"
          dragMax="255"
        />
      </div>
      <div className={style.single}>
        <EditableInput
          style={{ input: style.input, label: style.label }}
          label="b"
          value={rgb.b}
          onChange={handleChange}
          dragLabel="true"
          dragMax="255"
        />
      </div>
      <div className={style.alpha2}>
        <EditableInput
          style={{ input: style.input, label: style.label }}
          label="a"
          value={Math.round(rgb.a * 100)}
          onChange={handleChange}
          dragLabel="true"
          dragMax="100"
        />
      </div>
    </div>
  );
};

export default SketchFields;
