import React, { Component } from "react";
import Navbar from "../Navbar";
import GameBoard from "./Checkers";
import GameUI from "./GameUI";
import { Redirect } from "react-router-dom";
import { throws } from "assert";

class CheckersRoomPage extends Component {
   constructor(props) {
      super(props);
      this.handleMove = this.handleMove.bind(this);
      this.handlePieceClick = this.handlePieceClick.bind(this);
      this.handleResign = this.handleResign.bind(this);
      let gameState = {
         currentPlayer: 0,
         myColor: 0,
         gameStarted: false,
         gameEnded: false
      };
      this.state = {
         loggedIn: false,
         loaded: false,
         clockInfo: this.clockInfo,
         userId: 1221,
         gameId: 123,
         gameState: gameState,
         roomNumber: null,
         gameUI: {
            error: null,
            isLoaded: false,
            gameName: "Warcaby",
            stakes: 10,
            playerName1: "koks",
            playerName2: "noob"
         },
         board: [
            ["-", "b", "-", "b", "-", "b", "-", "b"],
            ["b", "-", "b", "-", "b", "-", "b", "-"],
            ["-", "b", "-", "b", "-", "b", "-", "b"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["r", "-", "r", "-", "r", "-", "r", "-"],
            ["-", "r", "-", "r", "-", "r", "-", "r"],
            ["r", "-", "r", "-", "r", "-", "r", "-"]
         ]
      };
      this.state.userId = Math.floor(Math.random() * 100);
      this.state.gameState.myColor = Math.floor(Math.random() * 2);
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
      //this.connect();
      //this.checkIfLoggedIn();

      this.getRoomInfo();
   }

   getRoomInfo = () => {
      let index = window.location.href.lastIndexOf("/");
      let roomNumber = window.location.href.substring(index + 1);
      this.setState({ roomNumber: roomNumber });

      let body = {
         a: 1
      };

      this.connect();

      fetch("https://localhost:44316/api/Room/" + roomNumber, {
         method: "POST",
         body: JSON.stringify(body),
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
      };

      this.ws.onmessage = event => {
         console.log("ws.onmessage():");
         console.log(event.data);
         let state = this.state.gameState;
         state.currentPlayer = (state.currentPlayer + 1) % 2;
         state.gameStarted = true;
         if (event.data.gameResult != null) {
            state.gameResult = event.data.gameResult;
         }
         this.setState({
            board: event.data.board,
            gameState: state
         });

         if (event.data.gameResult != null) {
            var modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];
            modal.style.display = "block";
            span.onclick = function() {
               modal.style.display = "none";
            };
            window.onclick = function(event) {
               if (event.target === modal) {
                  modal.style.display = "none";
               }
            };
            var bearer = "Bearer " + this.state.token;
            var url;
            if (event.data.gameResult === 1) {
               url = "https://localhost:44316/api/Game/Win";
            } else {
               url = "https://localhost:44316/api/Game/Win";
            }
            fetch(url, {
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
                  console.log(json);
               })
               .catch(error => console.error("Error:", error));
         }
      };
   };

   send = (message, typeString) => {
      if (this.ws.readyState !== WebSocket.OPEN) {
         console.log("ws not ready");
         return 0;
      }
      var json = JSON.stringify({
         gameId: this.state.gameId,
         userId: this.state.userId,
         moveString: message,
         type: typeString
      });
      console.log("ws.send(): " + json);
      this.ws.send(json);
   };

   convertColumnIndexToLetter = c => {
      return (c + 10).toString(36).toUpperCase();
   };

   handleMove = (a, b, c, d) => {
      var a1 = this.convertColumnIndexToLetter(a);
      var a2 = this.convertColumnIndexToLetter(c);

      let state = this.state.gameState;
      state.currentPlayer = (state.currentPlayer + 1) % 2;
      state.gameStarted = true;
      this.setState({ gameState: state });

      this.send(a1 + (8 - b) + "-" + a2 + (8 - d), "move"); //TODO odkomentowac
   };

   handlePieceClick = (a, b) => {
      var a1 = this.convertColumnIndexToLetter(a);
      console.log(a1 + (8 - b));
      this.send(a1 + (8 - b), "piece-click");
   };

   handleResign = () => {
      console.log("resigned");
      let gameState = this.state.gameState;
      gameState.gameEnded = true;
      this.setState({ gameState: gameState });

      this.send("0");
   };

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
            <div className="row justify-content-center">
               <div className="col-8">
                  <GameBoard handlePieceClick={this.handlePieceClick} handleMove={this.handleMove} myColor={this.state.gameState.myColor} board={this.state.board} />
               </div>
               <div className="col-4">
                  <GameUI
                     handleResign={this.handleResign}
                     gameState={this.state.gameState}
                     clockInfo={this.state.clockInfo}
                     gameInfo={this.state.gameUI}
                     loading={this.state.loading}
                     loaded={this.state.loaded}
                  />
               </div>
            </div>
         </React.Fragment>
      );
   }
}

export default CheckersRoomPage;
