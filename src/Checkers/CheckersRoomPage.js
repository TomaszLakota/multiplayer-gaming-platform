import React, { Component } from "react";
import Navbar from "../Navbar";
import GameBoard from "./Checkers";
import GameUI from "./GameUI";
import { Redirect } from "react-router-dom";
import WithWebSocket from "./WebSocketHOC";

class CheckersRoomPage extends Component {
   constructor(props) {
      super(props);

      console.log("CHECKERS ROOM PAGE @@@@@@@@@@@");
      console.log(this.send);
      console.log(this.props);
      console.log(this.state);
      this.send = this.props.send.bind(this);
      console.log(this.send);
      this.handleResign = this.handleResign.bind(this);

      let gameState = {
         currentPlayer: 0,
         myColor: Math.floor(Math.random() * 2),
         gameStarted: false,
         gameEnded: false
      };
      this.state = {
         loggedIn: false,
         loaded: false,
         clockInfo: this.clockInfo,
         myUserId: 1221,
         gameId: 123,
         gameState: gameState,
         roomNumber: null,
         userId: Math.floor(Math.random() * 100),
         gameUI: {
            error: null,
            isLoaded: false,
            gameName: "Warcaby",
            stakes: 10,
            playerName1: "koks",
            playerName2: "noob"
         },
         board: []
      };
      this.connect();
   }
   clockInfo = {
      timeControl: 120,
      timeControlBonus: 5
   };
   ws;

   checkIfLoggedIn() {
      console.log("checkIfLoggedIn");
      console.log(localStorage.getItem("authToken"));
      if (localStorage.getItem("authToken") === null) {
         this.setState({
            loggedIn: false,
            loaded: true
         });
         return 0;
      }
   }

   componentDidMount() {
      //this.checkIfLoggedIn();
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@ this.getRoomInfo();");
      this.getRoomInfo();
   }

   getRoomInfo = () => {
      let index = window.location.href.lastIndexOf("/");
      let roomNumber = window.location.href.substring(index + 1);
      this.setState({ roomNumber: roomNumber });

      fetch("https://localhost:44316/api/Room/" + roomNumber, {
         method: "GET",
         headers: {
            "Content-Type": "application/json"
         }
      })
         .then(response => response.json())
         .then(response => {
            console.log(response);
            if (response.player1Name != null) {
               let gameUI = this.state.gameUI;
               let clockInfo = this.state.clockInfo;
               gameUI.playerName1 = response.player1Name;
               gameUI.stakes = response.room.cash;
               gameUI.gameName = response.room.gameName;
               clockInfo.timeControl = response.room.timeControl;
               clockInfo.timeControlBonus = response.room.timeControlBonus;
               this.setState({
                  gameUI: gameUI,
                  clockInfo: clockInfo
               });
            }

            //nie istnieje pokoj

            //nie ma drugiego gracza
            if (response.player2Id == null) {
               setTimeout(() => {
                  this.getRoomInfo();
               }, 1000);
               return;
            }

            let gameUI = this.state.gameUI;
            gameUI.playerName2 = response.player2Name;
            this.setState({
               gameUI: gameUI
            });

            //stworz gre na backendzie gry
         })
         .catch(error => console.error("Error:", error));
   };

   //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RENDER @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   render() {
      if (!this.state.loggedIn && this.state.loaded) {
         return <Redirect to="/login" push />;
      }
      return (
         <React.Fragment>
            <Navbar loggedIn={this.state.loggedIn} />
            <div id="myModal" className="modal">
               <div className="modal-content">
                  <span className="close">&times;</span>
                  <h1>{this.state.gameState.gameResult ? "Zwycięstwo" : "Porażka"}</h1>
               </div>
            </div>
            <div className="main-wrapper">
               <div className="row justify-content-center">
                  <div className="col-8">
                     <GameBoard ws={this.ws} {...this.state} />
                  </div>
                  <div className="col-4">
                     <GameUI
                        handleResign={this.handleResign}
                        gameState={this.state.gameState}
                        clockInfo={this.state.clockInfo}
                        gameInfo={this.state.gameUI}
                        loading={this.state.loading}
                        loaded={this.state.loaded}
                        ws={this.ws}
                     />
                  </div>
               </div>
            </div>
         </React.Fragment>
      );
   }

   //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ WEB SOCKET @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   connect = () => {
      this.ws = new WebSocket("ws://localhost:8080/CheckersSpring_war_exploded/game/" + this.state.userId);
      console.log("new ws");
      console.log(this.ws);

      this.ws.onopen = event => {
         var json = JSON.stringify({
            gameId: this.state.gameId,
            userId: this.state.userId,
            userToken: this.state.token,
            myColor: this.state.gameState.myColor
         });

         this.ws.send(json);
         console.log("CHECKERS ROOM PAGE ws open @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      };

      setTimeout(() => {
         console.log("CHECKERS ROOM ws @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
         console.log(this.ws);
         console.log(this.state);
      }, 2000);
   };

   handleResign = () => {
      console.log("resigned");
      let gameState = this.state.gameState;
      gameState.gameEnded = true;
      this.setState({ gameState: gameState });

      this.send("1", "resign");
   };
}

export default WithWebSocket(CheckersRoomPage);
