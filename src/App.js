/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import "./App.css";
import GameSelectionPage from "./GameSelectionPage";
import LoginPage from "./LoginPage";
import RegistrationPage from "./SignUpPage";
import MainPage from "./MainPage";
import CheckersLobbyPage from "./LobbyPage";
import RoomInfoBar from "./LobbyRoomInfoBar";
import CheckersRoomPage from "./Checkers/CheckersRoomPage";
import LeaderboardPage from "./LeaderboardPage";
import ProfilePage from "./ProfilePage";
import { BrowserRouter as Router } from "react-router-dom";

import { Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/games" component={GameSelectionPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegistrationPage} />
          <Route exact path="/checkers" component={CheckersLobbyPage} />
          <Route path="/users" component={RoomInfoBar} />
          <Route path="/room" component={CheckersRoomPage} />
          <Route exact path="/ranking" component={LeaderboardPage} />
          <Route exact path="/profile" component={ProfilePage} />
        </Router>

        {/* <div className="row">
          <div className="col-8">
            <GameBoard gameState={this.gameState} />
          </div>
          <div className="col-4">
            <GameUI gameState={this.gameState} clockInfo={this.clockInfo} />
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}

export default App;
