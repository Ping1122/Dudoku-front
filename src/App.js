import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Header from "./components/header";
import Home from "./components/home";
import SelectMode from "./components/selectMode";
import Profile from "./components/profile";
import History from "./components/history";
import Settings from "./components/settings";
import Login from "./components/login";
import Logout from "./components/logout";
import Register from "./components/register";
import Footer from "./components/footer";
import Sudoku from "./components/sudoku";
import Dudoku from "./components/dudoku";
import NotFound from "./components/notFound";
import user from "./service/user";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    const currentUser = user.getCurrentUser();
    if (currentUser === null) return;
    this.setState({ currentUser });
  }

  render() {
    return (
      <div className="App">
        <ToastContainer />
        <BrowserRouter>
          <div className="head">
            <Route
              path="/"
              render={props => (
                <Header {...props} currentUser={this.state.currentUser} />
              )}
            />
          </div>
          <div className="main">
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/sudoku/select-mode" component={SelectMode} />
              <Route path="/dudoku/select-mode" component={SelectMode} />
              <Route path="/login" component={Login} />
              <Route path="/profile" component={Profile} />
              <Route path="/history" component={History} />
              <Route path="/settings" component={Settings} />
              <Route path="/logout" component={Logout} />
              <Route path="/register" component={Register} />
              <Route path="/sudoku" component={Sudoku} />
              <Route
                path="/dudoku"
                render={props => (
                  <Dudoku {...props} currentUser={this.state.currentUser} />
                )}
              />
              <Route path="/not-found" component={NotFound} />
              <Redirect from="/" exact to="/home" />
              <Redirect to="/not-found" />
            </Switch>
          </div>
        </BrowserRouter>
        <Footer />
      </div>
    );
  }
}

export default App;
