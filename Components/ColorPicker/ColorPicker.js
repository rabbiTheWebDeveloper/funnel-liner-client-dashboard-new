import Alpha from "./Alpha";
import Checkboard from "./Checkboard";
import ColorWrap from "./ColorWrap";
import Hue from "./Hue";
import Saturation from "./Saturation";
import SketchFields from "./SketchField";
import SketchPresetColors from "./SketchPresetColors";
import style from "./style.module.css";

export const Sketch = ({
  width = 200,
  rgb,
  hex,
  hsv,
  hsl,
  onChange,
  onReset,
  onSwatchHover,
  disableAlpha = false,
  presetColors = [
    "#D0021B",
    "#F5A623",
    "#F8E71C",
    "#8B572A",
    "#7ED321",
    "#417505",
    "#BD10E0",
    "#9013FE",
    "#4A90E2",
    "#50E3C2",
    "#B8E986",
    "#000000",
    "#4A4A4A",
    "#9B9B9B",
    "#FFFFFF",
  ],
  renderers,
  className = "",
}) => {
  return (
    <div className={`sketch-picker ${style.picker} ${className}`}>
      <div className={style.saturation}>
        <Saturation
          className={style.saturations}
          hsl={hsl}
          hsv={hsv}
          onChange={onChange}
        />
      </div>
      <div className={`flexbox-fix ${style.controls}`}>
        <div className={style.sliders}>
          <div className={style.hue}>
            <Hue style={style.hues} hsl={hsl} onChange={onChange} />
          </div>
          {/* <div className={style.alpha}>
            <Alpha
              className={style.alphas}
              rgb={rgb}
              hsl={hsl}
              renderers={renderers}
              onChange={onChange}
            />
          </div> */}
        </div>
        <div className={style.color}>
          <Checkboard />
          <div
            style={{
              background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`,
            }}
            className={style.activeColor}
          />
        </div>
      </div>

      <SketchFields
        rgb={rgb}
        hsl={hsl}
        hex={hex}
        onChange={onChange}
        disableAlpha={disableAlpha}
      />
      <SketchPresetColors
        colors={presetColors}
        onClick={onChange}
        onSwatchHover={onSwatchHover}
      />
      <div className={style.reset}>
        <button onClick={onReset} className={style.resetButton}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ColorWrap(Sketch);
