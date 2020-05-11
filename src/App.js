import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/header";
import Home from "./components/home";
import Play from "./components/play";
import Profile from "./components/profile";
import History from "./components/history";
import Settings from "./components/settings";
import Login from "./components/login";
import Footer from "./components/footer";
import NotFound from "./components/notFound";
import user from "./service/user";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null
    };
  }

  async componentDidMount() {
    const { data: currentUser } = await user.getCurrentUser();
    console.log(currentUser);
    if (currentUser != null) {
      this.setState({ currentUser });
    }
  }

  render() {
    console.log("app.js state");
    console.log(this.state);
    return (
      <div className="App">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <ToastContainer />
          <BrowserRouter>
            <Route
              path="/"
              render={props => (
                <Header {...props} currentUser={this.state.currentUser} />
              )}
            />
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/play" component={Play} />
              <Route path="/login" component={Login} />
              <Route path="/profile" component={Profile} />
              <Route path="/history" component={History} />
              <Route path="/settings" component={Settings} />
              <Route path="/not-found" component={NotFound} />
              <Redirect from="/" exact to="/home" />
              <Redirect to="/not-found" />
            </Switch>
          </BrowserRouter>
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
