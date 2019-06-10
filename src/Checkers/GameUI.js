import React, { Component } from "react";
import ChessClock from "./ChessClock";
import Chat from "./Chat";

class GameUI extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         isLoaded: false,
         gameName: this.props.gameInfo.gameName,
         stakes: this.props.gameInfo.stakes,
         playerName1: this.props.gameInfo.playerName1,
         playerName2: this.props.gameInfo.playerName2,
         clockInfo: props.clockInfo
      };

      this.ws = null;
      this.wsReady = false;
   }

   componentDidMount() {
      this.ws = this.props.ws;
      if (this.props.ws.readyState === WebSocket.OPEN) {
         this.initSocket();
      } else {
         this.props.ws.onopen = event => {
            this.initSocket();
         };
      }
   }

   initSocket() {
      this.ws.onmessage = event => {
         //TODO tutaj dodac odswiezenie parametrow gry
      };
   }

   componentDidUpdate() {
      console.log("component gameUI did update");
      console.log(this.props.ws);
      if (this.props.ws.readyState === WebSocket.OPEN && this.wsReady === false) {
         console.log("gameui ws open");
         this.ws = this.props.ws;
         this.wsReady = true;
      }
   }

   render() {
      console.log("rendering gameUI");
      console.log(this.props);

      return (
         <div className="gameUIContainer container">
            <div className="row">
               <div className="h4 GUI_info row text-center w-100">
                  <div className="col">
                     {this.state.gameName} {this.state.clockInfo.timeControl / 60}m+{this.state.clockInfo.timeControlBonus}s {this.state.stakes}zł
                  </div>
               </div>

               <div className="row text-center w-100">
                  <div className="h5 GUI_name col">{this.state.playerName1}</div>
                  <div className="h5 GUI_name col">{this.state.playerName2}</div>
               </div>
               <div className="row text-center w-100 GUI_clocks">
                  <ChessClock ws={this.props.ws} clockInfo={this.props.clockInfo} gameState={this.props.gameState} clockID={0} key="clock1" />
                  <ChessClock ws={this.props.ws} clockInfo={this.props.clockInfo} gameState={this.props.gameState} clockID={1} key="clock2" />
               </div>
               <div className="GUI_buttons row w-100">
                  <div className="col-4">
                     <button className="btn btn-secondary" onClick={this.handleDrawButtonClick}>
                        Remis
                     </button>
                  </div>
                  <div className="col-4">
                     <button className="btn btn-secondary" onClick={this.props.handleResign}>
                        Rezygnacja
                     </button>
                  </div>
                  <div className="col-4">
                     <button className="btn btn-secondary" onClick={this.handleSettingsButtonClick}>
                        Ustawienia
                     </button>
                  </div>
               </div>
            </div>
            <div className="row align-items-end">
               <Chat ws={this.props.ws} />
            </div>
         </div>
      );
   }

   handleSettingsButtonClick = () => {};
   handleDrawButtonClick = () => {};
}

export default GameUI;
