import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Form from "./common/form";
import auth from "../service/auth";

class Login extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: { email: "", password: "" },
      errors: {}
    };
    this.schema = {
      email: Joi.string()
        .required()
        .email()
        .label("email"),
      password: Joi.string()
        .required()
        .label("Password")
    };
    this.validateWhileTyping = false;
  }

  doSubmit = async () => {
    console.log("submit login form");
    try {
      const { data } = this.state;
      await auth.login(data.email, data.password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      console.log(ex.response);
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
  };

  render() {
    return (
      <div className="login-form">
        <h1 className="login-title">Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
          <br />
          <div className="login-link">
            <NavLink to="/reset-password">Forget your password?</NavLink>
          </div>
          <div className="login-link">
            <NavLink to="/register">Do not have an account? Sign up!</NavLink>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
