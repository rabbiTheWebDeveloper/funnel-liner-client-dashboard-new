import React, { PureComponent } from "react";
import * as alpha from "./alphahelpers";
import Checkboard from "./Checkboard";
import style from "./style.module.css";

export class Alpha extends PureComponent {
  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = e => {
    const change = alpha.calculateChange(
      e,
      this.props.hsl,
      this.props.direction,
      this.props.a,
      this.container
    );
    if (change && this.props.onChange instanceof Function) {
      this.props.onChange(change, e);
    }
  };

  handleMouseDown = e => {
    this.handleChange(e);
  };

  handleMouseUp = () => {
    this.unbindEventListeners();
  };

  unbindEventListeners = () => {
    window.removeEventListener("mousemove", this.handleChange);
    window.removeEventListener("mouseup", this.handleMouseUp);
  };

  render() {
    const { rgb, radius, shadow, pointer } = this.props;

    const linearGradient = `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%, rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`;

    return (
      <div
        className={style.alpha3}
        style={{
          borderRadius: radius,
        }}
      >
        <div
          className={style.checkboard}
          style={{
            borderRadius: radius,
          }}
        >
          <Checkboard renderers={this.props.renderers} />
        </div>
        <div
          className={style.gradient}
          style={{
            background: linearGradient,
            boxShadow: shadow,
            borderRadius: radius,
          }}
        />
        <div
          className={style.container}
          ref={container => (this.container = container)}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        >
          <div
            className={style.pointer}
            style={{
              left: `${rgb.a * 100}%`,
            }}
          >
            {pointer ? (
              <pointer {...this.props} />
            ) : (
              <div className={style.slider2} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Alpha;
