import React, { Component } from "react";
import Navbar from "../Navbar";
import GameBoard from "./Checkers";
import GameUI from "./GameUI";
import { Redirect } from "react-router-dom";
import WithWebSocket from "./WebSocketHOC";

class CheckersRoomPage extends Component {
   constructor(props) {
      super(props);

      this.send = this.props.send.bind(this);
      this.handleResign = this.handleResign.bind(this);

      //TODO pobrac z propsów
      let gameState = {
         currentPlayer: 0,
         myColor: Math.floor(Math.random() * 2),
         gameStarted: false,
         gameEnded: false
      };
      let index = window.location.href.lastIndexOf("/");
      let gameId = window.location.href.substring(index + 3);
      this.state = {
         loggedIn: false,
         loaded: false,
         clockInfo: this.clockInfo,
         myUserId: Math.floor(Math.random() * 1000),
         gameId: gameId,
         gameState: gameState,
         roomNumber: null,
         userId: null,
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

   //TODO proper
   checkIfLoggedIn() {
      console.log("ROOM: checkIfLoggedIn was called");
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
      console.log("ROOM: componentDidMount: calling this.getRoomInfo();");
      this.getRoomInfo();
   }

   getRoomInfo = () => {
      let index = window.location.href.lastIndexOf("Id=");
      let roomNumber = window.location.href.substring(index + 1);
      this.setState({ roomNumber: roomNumber });
      var bearer = "Bearer " + localStorage.getItem("authToken");
      fetch("https://localhost:44316/api/room/settings", {
         method: "GET",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
            Authorization: bearer
         }
      })
         .then(response => response.json())
         .then(response => {
            console.log("ROOM: room api fetch response:");
            console.log(response);
            // if (response.player1Name != null) {
            //    let gameUI = this.state.gameUI;
            //    let clockInfo = this.state.clockInfo;
            //    gameUI.playerName1 = response.player1Name;
            //    gameUI.stakes = response.room.cash;
            //    gameUI.gameName = response.room.gameName;
            //    clockInfo.timeControl = response.room.timeControl;
            //    clockInfo.timeControlBonus = response.room.timeControlBonus;
            //    this.setState({
            //       gameUI: gameUI,
            //       clockInfo: clockInfo
            //    });
            // }

            // //nie istnieje pokoj

            // //nie ma drugiego gracza
            // if (response.player2Id == null) {
            //    setTimeout(() => {
            //       this.getRoomInfo();
            //    }, 1000);
            //    return;
            // }

            // let gameUI = this.state.gameUI;
            // gameUI.playerName2 = response.player2Name;
            // this.setState({
            //    gameUI: gameUI
            // });

            //stworz gre na backendzie gry
         })
         .catch(error => console.error("Error:", error));

      fetch("https://localhost:44316/api/user/Info", {
         method: "GET",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
            Authorization: bearer
         }
      })
         .then(response => response.json())
         .then(json => {
            // console.log("AUTHORIZED response");
            // console.log(json);

            this.setState({
               email: json.currentUser.email,
               userId: json.currentUser.id,
               money: json.currentUser.money,
               password: json.currentUser.password,
               rankingPoints: json.currentUser.rankingPoints,
               username: json.currentUser.username,
               loggedIn: true,
               loaded: true
            });

            console.log("ROOM: sending initial");
            let index = window.location.href.lastIndexOf("Id=");
            let roomNumber = window.location.href.substring(index + 3);
            var jsona = JSON.stringify({
               gameId: roomNumber,
               userId: json.currentUser.userId,
               userToken: this.state.token,
               myColor: this.state.gameState.myColor,
               timeControl: 180,
               timeControlBonus: 5
            });
            console.log(jsona);
            this.ws.send(jsona);
         });
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
            <div className="main-wrapper justify-content-center">
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
      // console.log("ROOM: connect was called");
      this.ws = new WebSocket("ws://localhost:8080/CheckersSpring_war_exploded/game/" + this.state.userId);
   };

   handleResign = () => {
      console.log("resigned");
      let gameState = this.state.gameState;
      gameState.gameEnded = true;
      this.setState({ gameState: gameState });

      var json = JSON.stringify({
         gameId: this.state.gameId,
         userId: this.state.userId,
         userToken: this.state.token,
         myColor: this.state.gameState.myColor,
         type: "resign"
      });
      this.ws.send(json);
   };
}

export default WithWebSocket(CheckersRoomPage);
