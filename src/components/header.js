import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class Header extends Component {
  getActiveClass(pathname) {
    return this.props.location.pathname === pathname
      ? "nav-link active"
      : "nav-link";
  }

  render() {
    const homeActive = this.getActiveClass("/Home");
    const playActive = this.getActiveClass("/Play");
    const loginActive = this.getActiveClass("/Login");
    return (
      <header className="masthead mb-auto">
        <div className="inner">
          <Link to="/">
            <h3 className="masthead-brand">Dudoku</h3>
          </Link>
          <nav className="nav nav-masthead justify-content-center">
            <NavLink className={homeActive} to="/home">
              Home
            </NavLink>
            <NavLink className={playActive} to="/play">
              Play
            </NavLink>
            <NavLink className={loginActive} to="/login">
              Login
            </NavLink>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
