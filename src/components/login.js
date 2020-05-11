import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "./common/form";
import auth from "../service/auth";

class Login extends Form {
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
      const error = ex.response && ex.response.data;
      toast.info(error);
    }
  };

  render() {
    return (
      <div className="loginForm">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default Login;
