import React, { Component } from "react";
import { NavLink, Link, Redirect } from "react-router-dom";
import Authorized from "./AuthHOC";
import logo from "./images/logo.png";

class Navbar extends Component {
   state = {
      logout: false,
      login: false,
      register: false
   };

   componentDidUpdate() {
      if (this.state.register || this.state.login || this.state.logout) {
         this.setState({
            logout: false,
            login: false,
            register: false
         });
      }
   }

   render() {
      // console.log("navbar render");
      // console.log(this.props.loggedIn);
      // console.log(this.state);

      const loggedInButtons = (
         <React.Fragment>
            <Link className="link" exact to="/logout">
               Wyloguj
            </Link>
         </React.Fragment>
      );
      const loggedOutButtons = (
         <React.Fragment>
            <Link className="link" exact to="/login">
               Logowanie
            </Link>
            <Link className="link" exact to="/register">
               Rejestracja
            </Link>
         </React.Fragment>
      );
      const routes = (
         <React.Fragment>
            {this.state.logout && <Redirect to="/" push />}
            {this.state.login && <Redirect to="/login" push />}
            {this.state.register && <Redirect to="/register" push />}
         </React.Fragment>
      );

      return (
         <React.Fragment>
            {routes}
            <nav className="navbar navbar-expand-sm navbar-light justify-content-end">
               <NavLink exact to="/">
                  <img src={logo} alt="logo" />
               </NavLink>
               {/* <LoginLayout /> */}
               {this.props.loggedIn === true ? loggedInButtons : loggedOutButtons}
               <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                  <span className="navbar-toggler-icon" />
               </button>
               <div className="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
                  <ul className="navbar-nav text-right">
                     <li className="nav-item active">
                        <Link className="link" exact to="/ranking">
                           Ranking
                        </Link>
                     </li>
                     <li className="nav-item active">
                        <Link className="link" exact to="/profile">
                           Profil
                        </Link>
                     </li>
                  </ul>
               </div>
            </nav>
         </React.Fragment>
      );
   }
}

export default Authorized(Navbar);
