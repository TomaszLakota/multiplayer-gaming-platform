import React, { Component } from "react";
import Navbar from "./Navbar";
import GameSelection from "./GameSelection";

class MainPage extends Component {
   state = {};
   render() {
      return (
         <React.Fragment>
            <Navbar />
            <div className="row justify-content-center">
               <div className="col-4 gameSelectionContainer">
                  <GameSelection />
               </div>
            </div>
         </React.Fragment>
      );
   }
}

export default MainPage;
