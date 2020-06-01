import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class ModeButton extends Component {
  render() {
    const { ends, label, mode, onMouseEnter } = this.props;
    return (
      <NavLink
        className={`mode-button ${ends} nav-link`}
        onMouseEnter={() => onMouseEnter(label)}
        to={`/${mode}/${label.toLowerCase()}`}
      >
        {label}
      </NavLink>
    );
  }
}
export default ModeButton;
