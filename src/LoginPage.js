import React, { Component } from "react";
import Navbar from "./Navbar";
import LogInForm from "./LoginForm";

class LoginPage extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="row justify-content-center">
          <div className="col-4">
            <LogInForm />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginPage;
