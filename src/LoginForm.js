import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class LogInForm extends Component {
   state = {
      login: "",
      password: "",
      loading: true,
      redirect: false,
      token: null,
      loginErrorMessage: "",
      passwordErrorMessage: ""
   };

   handleChange = e => {
      this.setState({
         [e.target.id]: e.target.value
      });
   };

   onSubmit = event => {
      let body = {
         username: this.state.login,
         password: this.state.password
      };
      event.preventDefault();
      fetch("https://localhost:44316/api/Auth/Login", {
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
      if (json.status === 103) {
         localStorage.setItem("authToken", json.token);
         localStorage.setItem("loggedIn", true);
         this.setState({ token: json.token, redirect: true });
      }
      if (json.status === 102) {
         this.setState({ token: null, passwordErrorMessage: "Błędne hasło" });
         localStorage.setItem("authToken", null);
         localStorage.setItem("loggedIn", false);
      }
      if (json.status === 101) {
         this.setState({ token: null, loginErrorMessage: "Użytkownik nie istnieje" });
         localStorage.setItem("authToken", null);
         localStorage.setItem("loggedIn", false);
      }
      if (json.status === 400) {
         this.setState({ token: null, passwordErrorMessage: "Hasło zbyt krótkie" });
         localStorage.setItem("authToken", null);
         localStorage.setItem("loggedIn", false);
      }
   }

   render() {
      return (
         <div className="form-container">
            {this.state.redirect && <Redirect to="/" push />}
            <form onSubmit={this.onSubmit}>
               <h2>Logowanie</h2>
               <div className="form-group">
                  <label htmlFor="login">Login</label>
                  <input type="login" id="login" className="form-control" onChange={this.handleChange} />
                  <span className="text-danger">{this.state.loginErrorMessage}</span>
               </div>
               <div className="form-group">
                  <label htmlFor="password">Hasło</label>
                  <input type="password" id="password" className="form-control" onChange={this.handleChange} />
                  <span className="text-danger">{this.state.passwordErrorMessage}</span>
               </div>
               <button>Logowanie</button>
            </form>
         </div>
      );
   }
}

export default LogInForm;
