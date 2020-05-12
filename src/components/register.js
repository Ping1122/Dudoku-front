import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Form from "./common/form";
import auth from "../service/auth";

class Register extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: { username: "", password: "" },
      errors: {}
    };
    this.schema = {
      username: Joi.string()
        .required()
        .email()
        .label("Username"),
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
      await auth.login(data.username, data.password);
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
        <h1>Create an Account</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
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

export default Register;
