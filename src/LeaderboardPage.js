import React, { Component } from "react";
import Navbar from "./Navbar";
import Leaderboard from "./Leaderboard";

class LeaderboardPage extends Component {
  state = {};

  componentDidMount() {
    let body = {
      username: this.state.login,
      password: this.state.password
    };

    fetch("https://localhost:44316/api/user/Ranking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({ token: json });
        console.log(this.state);
      })
      .catch(error => console.error("Error:", error));
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="row justify-content-center">
          <div className="col-6">
            <Leaderboard />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LeaderboardPage;
