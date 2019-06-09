import React, { Component } from "react";

class LogInForm extends Component {
  state = {
    login: "",
    password: "",
    loading: true,
    redirect: false,
    token: null
  };

  handleChange = e => {
    console.log(e);
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
      .then(json => {
        console.log(json);
        this.setState({ token: json.token });
        console.log(this.state);
        localStorage.setItem("authToken", json.token);
        console.log(localStorage.getItem("authToken"));
      })
      .catch(error => console.error("Error:", error));
  };

  // componentDidMount() {
  //   fetch('/checkToken')
  //     .then(res => {
  //       if (res.status === 200) {
  //         this.setState({ loading: false });
  //       } else {
  //         const error = new Error(res.error);
  //         throw error;
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       this.setState({ loading: false, redirect: true });
  //     });
  // }

  render() {
    return (
      <div className="form-container">
        <form onSubmit={this.onSubmit}>
          <h2>Logowanie</h2>
          <div className="form-group">
            <label htmlFor="login">Login</label>
            <input type="login" id="login" className="form-control" onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input type="password" id="password" className="form-control" onChange={this.handleChange} />
          </div>
          <button>Logowanie</button>
        </form>
      </div>
    );
  }
}

export default LogInForm;
