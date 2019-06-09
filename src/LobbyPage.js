import React, { Component } from "react";
import Navbar from "./Navbar";
import LobbySelection from "./LobbySelection";

class CheckersLobbyPage extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="row justify-content-center">
          <div className="col-8">
            <LobbySelection gameID="1" gameName="Warcaby" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CheckersLobbyPage;
