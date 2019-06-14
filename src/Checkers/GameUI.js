import React, { Component } from "react";
import ChessClock from "./ChessClock";
import Chat from "./Chat";
import WithWebSocket from "./WebSocketHOC";

class GameUI extends Component {
   constructor(props) {
      super(props);

      this.ws = null;
   }

   componentDidMount() {
      // console.log("GAMEUI did mount");
      this.ws = this.props.ws;
   }

   componentDidUpdate() {
      // console.log("component gameUI did update");
      // console.log(this.props);

      if (this.props.ws !== null && this.props.ws.readyState === WebSocket.OPEN && this.wsReady === false) {
         // console.log("gameui ws open");
         this.ws = this.props.ws;
         this.wsReady = true;
      }
   }

   render() {
      // console.log("rendering gameUI");
      // console.log(this.props);

      return (
         <div className="gameUIContainer container">
            <div className="row">
               <div className="h4 GUI_info row text-center w-100">
                  <div className="col">
                     {this.props.gameName} {this.props.timeControl / 60}m+{this.props.timeControlBonus}s {this.props.stakes}zł
                  </div>
               </div>

               <div className="row text-center w-100">
                  <div className="h5 GUI_name col">{this.props.playerName1 ? this.props.playerName1 : ""}</div>
                  <div className="h5 GUI_name col">{this.props.playerName2 ? this.props.playerName2 : ""}</div>
               </div>
               <div className="row text-center w-100 GUI_clocks">
                  <ChessClock ws={this.props.ws} clockInfo={this.props} gameState={this.props} clockID={0} key="clock1" {...this.props} />
                  <ChessClock ws={this.props.ws} clockInfo={this.props} gameState={this.props} clockID={1} key="clock2" {...this.props} />
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
                     <button className="btn btn-secondary" onClick={this.handleStartButton}>
                        Start
                     </button>
                  </div>
               </div>
            </div>
            <div className="row align-items-end">
               <Chat ws={this.props.ws} username={this.props.playerName1} {...this.props} />
               {/* TODO fix username above to real data */}
            </div>
         </div>
      );
   }

   handleSettingsButtonClick = () => {};
   handleDrawButtonClick = () => {};
   handleStartButton = () => {
      var json = JSON.stringify({
         gameId: this.props.gameId,
         userId: this.props.userId,
         userToken: this.props.token,
         myColor: this.props.myColor,
         timeControl: this.props.timeControl,
         timeControlBonus: this.props.timeControlBonus,
         start: true
      });
      console.log(json);
      this.props.ws.send(json);
   };
}

export default WithWebSocket(GameUI);
