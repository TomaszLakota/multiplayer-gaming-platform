import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class SignUpForm extends Component {
   state = {
      email: "",
      username: "",
      password: "",
      loginErrorMessage: "",
      passwordErrorMessage: "",
      emailErrorMessage: ""
   };

   handleChange = e => {
      console.log(e);
      this.setState({
         [e.target.id]: e.target.value
      });
   };

   onSubmit = event => {
      let body = {
         username: this.state.username,
         email: this.state.email,
         password: this.state.password
      };
      event.preventDefault();
      fetch("https://localhost:44316/api/User/Register", {
         method: "POST",
         body: JSON.stringify(body),
         headers: {
            "Content-Type": "application/json"
         }
      })
         .then(response => response.json())
         .then(json => this.handleResponse(json))
         .catch(error => console.error("Error:", error));
   };

   handleResponse(json) {
      console.log(json);
      this.setState({
         loginErrorMessage: "",
         passwordErrorMessage: ""
      });
      if (json.status === 100) {
         localStorage.setItem("authToken", json.token);
         localStorage.setItem("loggedIn", true);
         this.setState({ token: json.token, redirect: true });
      }
      // if (json.status === 102) {
      //    this.setState({ token: null, passwordErrorMessage: "Błędne hasło" });
      //    localStorage.setItem("authToken", null);
      //    localStorage.setItem("loggedIn", false);
      // }
      if (json.status === 101) {
         this.setState({ token: null, loginErrorMessage: "Login zajęty" });
         localStorage.setItem("authToken", null);
         localStorage.setItem("loggedIn", false);
      }
      if (json.status === 400) {
         if (Array.isArray(json.errors.Email)) {
            this.setState({ token: null, emailErrorMessage: "Błedny email" });
            localStorage.setItem("authToken", null);
            localStorage.setItem("loggedIn", false);
         }
         if (Array.isArray(json.errors.Password)) {
            this.setState({ token: null, passwordErrorMessage: "Hasło zbyt krótkie" });
            localStorage.setItem("authToken", null);
            localStorage.setItem("loggedIn", false);
         }
      }
   }

   render() {
      return (
         <div className="form-container">
            {this.state.redirect && <Redirect to="/" push />}
            <form onSubmit={this.onSubmit}>
               <h2>Rejestracja</h2>
               <div className="form-group">
                  <label htmlFor="username">Login</label>
                  <input type="username" id="username" className="form-control" onChange={this.handleChange} />
                  <span className="text-danger">{this.state.loginErrorMessage}</span>
               </div>
               <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" className="form-control" onChange={this.handleChange} />
                  <span className="text-danger">{this.state.emailErrorMessage}</span>
               </div>
               <div className="form-group">
                  <label htmlFor="password">Hasło</label>
                  <input type="password" id="password" className="form-control" onChange={this.handleChange} />
                  <span className="text-danger">{this.state.passwordErrorMessage}</span>
               </div>
               <button className="btn">Rejestracja</button>
            </form>
         </div>
      );
   }
}

export default SignUpForm;
