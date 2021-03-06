/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import "./App.css";
import LoginPage from "./LoginPage";
import RegistrationPage from "./SignUpPage";
import MainPage from "./MainPage";
import CheckersLobbyPage from "./LobbyPage";
import CheckersRoomPage from "./Checkers/CheckersRoomPage";
import LeaderboardPage from "./LeaderboardPage";
import ProfilePage from "./ProfilePage";
import LogoutPage from "./LogoutPage";
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router-dom";
class App extends Component {
   render() {
      return (
         <React.Fragment>
            <Router>
               <Route exact path="/" component={MainPage} />
               <Route exact path="/login" component={LoginPage} />
               <Route exact path="/register" component={RegistrationPage} />
               <Route exact path="/checkers" component={CheckersLobbyPage} />
               <Route path="/room" component={CheckersRoomPage} />
               <Route exact path="/ranking" component={LeaderboardPage} />
               <Route exact path="/profile" component={ProfilePage} />
               <Route exact path="/logout" component={LogoutPage} />
            </Router>
         </React.Fragment>
      );
   }
}

export default App;
