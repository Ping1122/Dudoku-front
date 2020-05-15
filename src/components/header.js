import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import UserDropDown from "./userDropDown";
import logo from "../icon.png";

class Header extends Component {
  getActiveClass(pathname) {
    return this.props.location.pathname === pathname
      ? "nav-link active"
      : "nav-link";
  }

  renderUser = () => {
    const loginActive = this.getActiveClass("/Login");
    if (this.props.currentUser == null) {
      return (
        <NavLink className={loginActive} to="/login">
          Login
        </NavLink>
      );
    }
    return <UserDropDown username={this.props.currentUser.username} />;
  };

  render() {
    const homeActive = this.getActiveClass("/Home");
    const playActive = this.getActiveClass("/Play");

    return (
      <header className="masthead">
        <div className="inner">
          <Link to="/">
            <h3 className="masthead-brand">
              <img className="logo" alt="logo" src={logo} />
              Dudoku
            </h3>
          </Link>
          <nav className="nav nav-masthead justify-content-center">
            <NavLink className={homeActive} to="/home">
              Home
            </NavLink>
            <NavLink className={playActive} to="/select-mode">
              Play
            </NavLink>
            {this.renderUser()}
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
