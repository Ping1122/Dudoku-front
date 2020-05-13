import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Input from "./common/input";
import Form from "./common/form";
import auth from "../service/auth";

class Register extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: { username: "", password: "", confirmPassword: "", email: "" },
      errors: {}
    };
    this.schema = {
      username: Joi.string()
        .required()
        .min(3)
        .max(50)
        .label("Username"),
      password: Joi.string()
        .required()
        .min(3)
        .max(1000)
        .label("Password"),
      email: Joi.string()
        .required()
        .email()
        .max(1000)
        .label("Email")
    };
    this.validateWhileTyping = true;
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

  handleConfirmPasswordChange = ({ currentTarget: input }) => {
    const { value } = input;
    const errors = { ...this.state.errors };
    if (this.validateWhileTyping) {
      let errorMessage = "";
      if (value !== this.state.data.password) {
        errorMessage = "Those passwords didn't match. Try again.";
      }

      if (errorMessage) errors[input.name] = errorMessage;
      else delete errors[input.name];
    }
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  render() {
    const { data, errors } = this.state;
    return (
      <div className="login-form">
        <h1>Create an Account</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email")}
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          <Input
            type="password"
            name={"confirmPassword"}
            value={data["confirmPassword"]}
            label={"Confirm Password"}
            onChange={this.handleConfirmPasswordChange}
            error={errors["confirmPassword"]}
          />
          {this.renderButton("Sign up")}
          <br />

          <div className="login-link">
            <NavLink to="/login">Already have an account? Log in.</NavLink>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
