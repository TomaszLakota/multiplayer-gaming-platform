import React, { Component } from "react";

class SignUpForm extends Component {
  state = {
    email: "",
    username: "",
    password: ""
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
      .then(json => console.log(json))
      .catch(error => console.error("Error:", error));
  };
  render() {
    return (
      <div className="form-container">
        <form onSubmit={this.onSubmit}>
          <h2>Rejestracja</h2>
          <div className="form-group">
            <label htmlFor="username">Login</label>
            <input type="username" id="username" className="form-control" onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" className="form-control" onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input type="password" id="password" className="form-control" onChange={this.handleChange} />
          </div>
          <button>Rejestracja</button>
        </form>
      </div>
    );
  }
}

export default SignUpForm;
