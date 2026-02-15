import React, { Component, PureComponent } from "react";
import * as hue from "./huehelpers";

import style from "./style.module.css";

export class Hue extends (PureComponent || Component) {
  componentWillUnmount() {
    this.unbindEventListeners();
  }

  handleChange = e => {
    const change = hue.calculateChange(
      e,
      this.props.direction,
      this.props.hsl,
      this.container
    );
    change &&
      typeof this.props.onChange === "function" &&
      this.props.onChange(change, e);
  };

  handleMouseDown = e => {
    this.handleChange(e);
    window.addEventListener("mousemove", this.handleChange);
    window.addEventListener("mouseup", this.handleMouseUp);
  };

  handleMouseUp = () => {
    this.unbindEventListeners();
  };

  unbindEventListeners() {
    window.removeEventListener("mousemove", this.handleChange);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    const { direction = "horizontal" } = this.props;

    return (
      <div
        className={style.hue}
        style={{
          borderRadius: this.props.radius,
          boxShadow: this.props.shadow,
        }}
      >
        <div
          className={`hue-${direction} ${style.container2}`}
          style={{
            borderRadius: this.props.radius,
          }}
          ref={container => (this.container = container)}
          onMouseDown={this.handleMouseDown}
          onTouchMove={this.handleChange}
          onTouchStart={this.handleChange}
        >
          <style>{`
            .hue-horizontal {
              background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0
                33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to right, #f00 0%, #ff0
                17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }

            .hue-vertical {
              background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,
                #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%,
                #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }
          `}</style>
          <div
            className={style.pointer2}
            style={{
              left: `${(this.props.hsl.h * 100) / 360}%`,
            }}
          >
            {this.props.pointer ? (
              <this.props.pointer {...this.props} />
            ) : (
              <div className={style.slider3} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Hue;
