import React, { Component } from "react";
import Navbar from "./Navbar";
import LobbySelection from "./LobbySelection";
import Authorized from "./AuthHOC";
import { Redirect } from "react-router-dom";

class CheckersLobbyPage extends Component {
   constructor(props) {
      super(props);
      this._isMounted = true;
   }
   state = {};

   render() {
      if (!this.props.loggedIn && this.props.loaded) {
         return <Redirect to="/login" push />;
      }
      return (
         <React.Fragment>
            <Navbar />
            <div className="row justify-content-center">
               <div className="col-5">
                  <LobbySelection gameID="1" gameName="Warcaby" />
               </div>
            </div>
         </React.Fragment>
      );
   }

   componentWillUnmount() {
      this._isMounted = false;
   }
}

export default Authorized(CheckersLobbyPage);
