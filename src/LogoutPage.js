import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class LogoutPage extends Component {
   constructor(props) {
      super(props);
      localStorage.removeItem("authToken");
      localStorage.setItem("loggedIn", false);
      this.state = {
         redirect: false
      };
   }

   render() {
      setTimeout(() => {
         this.setState({
            redirect: true
         });
      }, 1000);

      return (
         <div>
            {this.state.redirect && <Redirect to="/" push />}
            Nastąpi wylogowanie
         </div>
      );
   }
}
