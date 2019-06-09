import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import Authorized from "./AuthHOC";

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

  componentDidMount() {
    console.log("navbar mount");
  }

  render() {
    console.log("navbar render");
    // console.log(this.props);
    // console.log(this.state);

    const loggedInButtons = (
      <React.Fragment>
        <button className="btn btn-info ml-auto mr-2" onClick={() => this.setState({ logout: true })}>
          Wyloguj
        </button>
      </React.Fragment>
    );
    const loggedOutButtons = (
      <React.Fragment>
        <button className="btn btn-success ml-auto mr-2" onClick={() => this.setState({ login: true })}>
          Logowanie
        </button>
        <button className="btn btn-warning   mr-2" onClick={() => this.setState({ register: true })}>
          Rejestracja
        </button>
      </React.Fragment>
    );
    const routes = (
      <React.Fragment>
        {this.state.logout ? <Redirect to="/" push /> : ""}
        {this.state.login ? <Redirect to="/login" push /> : ""}
        {this.state.register ? <Redirect to="/register" push /> : ""}
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {routes}
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-end">
          <NavLink className="text-white" exact to="/">
            Check Mate!
          </NavLink>
          {/* <LoginLayout /> */}
          {this.props.loggedIn === true ? loggedInButtons : loggedOutButtons}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
            <ul className="navbar-nav text-right">
              <li className="nav-item active">
                <NavLink className="nav-link" exact to="/ranking">
                  Ranking
                </NavLink>
              </li>
              <li className="nav-item active">
                <NavLink className="nav-link" exact to="/profile">
                  Profil
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Authorized(Navbar);
