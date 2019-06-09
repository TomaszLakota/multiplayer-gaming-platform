import React, { Component } from "react";
import Navbar from "./Navbar";
import GameSelectionPage from "./GameSelectionPage";

class MainPage extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="row justify-content-center">
              <GameSelectionPage />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MainPage;
