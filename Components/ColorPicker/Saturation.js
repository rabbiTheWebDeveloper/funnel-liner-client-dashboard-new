import React, { Component, PureComponent } from "react";
import * as saturation from "./saturationhelpers";
import { throttle } from "lodash";
import style from "./style.module.css";

export class Saturation extends (PureComponent || Component) {
  constructor(props) {
    super(props);

    this.throttle = throttle((fn, data, e) => {
      fn(data, e);
    }, 50);
  }

  componentWillUnmount() {
    this.throttle.cancel();
    this.unbindEventListeners();
  }

  getContainerRenderWindow() {
    const { container } = this;
    let renderWindow = window;
    while (
      !renderWindow.document.contains(container) &&
      renderWindow.parent !== renderWindow
    ) {
      renderWindow = renderWindow.parent;
    }
    return renderWindow;
  }

  handleChange = e => {
    typeof this.props.onChange === "function" &&
      this.throttle(
        this.props.onChange,
        saturation.calculateChange(e, this.props.hsl, this.container),
        e
      );
  };

  handleMouseDown = e => {
    this.handleChange(e);
    const renderWindow = this.getContainerRenderWindow();
    renderWindow.addEventListener("mousemove", this.handleChange);
    renderWindow.addEventListener("mouseup", this.handleMouseUp);
  };

  handleMouseUp = () => {
    this.unbindEventListeners();
  };

  unbindEventListeners() {
    const renderWindow = this.getContainerRenderWindow();
    renderWindow.removeEventListener("mousemove", this.handleChange);
    renderWindow.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    const { color, white, black, pointer, circle } = this.props.style || {};

    return (
      <div
        className={style.color4}
        style={{
          background: `hsl(${this.props.hsl.h},100%, 50%)`,
          borderRadius: this.props.radius,
        }}
        ref={container => (this.container = container)}
        onMouseDown={this.handleMouseDown}
        onTouchMove={this.handleChange}
        onTouchStart={this.handleChange}
      >
        <style>{`
          .saturation-white {
            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
            background: linear-gradient(to right, #fff, rgba(255,255,255,0));
          }
          .saturation-black {
            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
            background: linear-gradient(to top, #000, rgba(0,0,0,0));
          }
        `}</style>
        <div
          style={{
            borderRadius: this.props.radius,
          }}
          className={`${style.white4} saturation-white`}
        >
          <div
            style={{
              boxShadow: this.props.shadow,
              borderRadius: this.props.radius,
            }}
            className={`${style.black4} saturation-black`}
          />
          <div
            className={style.pointer4}
            style={{
              top: `${-(this.props.hsv.v * 100) + 100}%`,
              left: `${this.props.hsv.s * 100}%`,
            }}
          >
            {this.props.pointer ? (
              <this.props.pointer {...this.props} />
            ) : (
              <div className={style.circle4} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Saturation;
