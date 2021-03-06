import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class UserDropDown extends Component {
  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.removeDropdown = this.removeDropdown.bind(this);
    this.handleBlurEvent = this.handleBlurEvent.bind(this);
    this.hasFocus = this.hasFocus.bind(this);

    this.state = {
      show: false,
      mouseInDropdown: false
    };
  }

  componentDidMount() {
    this.dropdown.addEventListener("focusout", this.handleBlurEvent);
  }

  hasFocus(target) {
    if (!this.dropdown) {
      return false;
    }
    var dropdownHasFocus = false;
    var nodeIterator = document.createNodeIterator(
      this.dropdown,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    var node;

    while ((node = nodeIterator.nextNode())) {
      if (node === target) {
        dropdownHasFocus = true;
        break;
      }
    }

    return dropdownHasFocus;
  }

  handleBlurEvent(e) {
    var dropdownHasFocus = this.hasFocus(e.relatedTarget);

    if (!dropdownHasFocus) {
      this.setState({
        show: false
      });
    }
  }

  removeDropdown(e) {
    this.setState({
      show: false,
      mouseInDropdown: false
    });
  }

  toggleDropdown() {
    this.setState({
      show: true,
      mouseInDropdown: false
    });
  }

  handleMouseLeaveButton = () => {
    setTimeout(() => {
      if (this.state.mouseInDropdown) return;
      this.setState({
        show: false
      });
    }, 100);
  };

  handleMouseEnterDropdown = () => {
    this.setState({
      mouseInDropdown: true
    });
  };

  render() {
    const { username } = this.props;
    return (
      <div className={`dropdown`} ref={dropdown => (this.dropdown = dropdown)}>
        <button
          className="user-dropdown-button dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded={this.state.show}
          onMouseEnter={this.toggleDropdown}
          onMouseLeave={this.handleMouseLeaveButton}
        >
          Hello, {username}
        </button>
        <ul
          className={`dropdown-menu pt-0 pl-2 ${this.state.show ? "show" : ""}`}
          aria-labelledby="dropdownMenuButton"
          onMouseEnter={this.handleMouseEnterDropdown}
          onMouseLeave={this.removeDropdown}
        >
          <li className="my-1">
            <NavLink className="user-dropdown-item " to="/profile">
              Your profile
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink className="user-dropdown-item" to="/history">
              Your history
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink className="user-dropdown-item" to="/settings">
              Settings
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink className="user-dropdown-item" to="/logout">
              Log out
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserDropDown;
