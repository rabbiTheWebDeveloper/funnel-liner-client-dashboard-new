import React, { Component, PureComponent } from "react";
import * as color from "./color";
import { debounce } from "lodash";

export const ColorWrap = Picker => {
  class ColorPicker extends (PureComponent || Component) {
    constructor(props) {
      super();
      color;
      this.state = {
        ...color.toState(props.color, 0),
      };

      this.debounce = debounce((fn, data, event) => {
        fn(data, event);
      }, 100);
    }

    static getDerivedStateFromProps(nextProps, state) {
      return {
        ...color.toState(nextProps.color, state.oldHue),
      };
    }

    handleChange = (data, event) => {
      const isValidColor = color.simpleCheckForValidColor(data);
      if (isValidColor) {
        const colors = color.toState(data, data.h || this.state.oldHue);
        this.setState(colors);
        this.props.onChangeComplete &&
          this.debounce(this.props.onChangeComplete, colors, event);
        this.props.onChange && this.props.onChange(colors, event);
      }
    };

    handleSwatchHover = (data, event) => {
      const isValidColor = color.simpleCheckForValidColor(data);
      if (isValidColor) {
        const colors = color.toState(data, data.h || this.state.oldHue);
        this.props.onSwatchHover && this.props.onSwatchHover(colors, event);
      }
    };

    render() {
      const optionalEvents = {};
      if (this.props.onSwatchHover) {
        optionalEvents.onSwatchHover = this.handleSwatchHover;
      }

      return (
        <Picker
          {...this.props}
          {...this.state}
          onChange={this.handleChange}
          onReset={this.props.onReset}
          {...optionalEvents}
        />
      );
    }
  }

  ColorPicker.defaultProps = {
    ...Picker.defaultProps,
    color: {
      h: 250,
      s: 0.5,
      l: 0.2,
      a: 1,
    },
  };

  return ColorPicker;
};

export default ColorWrap;
