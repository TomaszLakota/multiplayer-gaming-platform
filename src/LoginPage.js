import React, { Component } from "react";
import Navbar from "./Navbar";
import LogInForm from "./LoginForm";
import Authorized from "./AuthHOC";
import { Redirect } from "react-router-dom";

class LoginPage extends Component {
   state = {};
   render() {
      if (this.props.loggedIn && this.props.loaded) {
         return <Redirect to="/" push />;
      }
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

export default Authorized(LoginPage);
