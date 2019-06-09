import React, { Component } from "react";
import Navbar from "./Navbar";
import SignUpForm from "./SignUpForm";

class RegistrationPage extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="row justify-content-center">
          <div className="col-4">
            <SignUpForm />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegistrationPage;
