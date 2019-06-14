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

      let index = window.location.href.lastIndexOf("Id=");
      let gameId = window.location.href.substring(index + 3);
      this.state = {
         loggedIn: false,
         loaded: false,
         isLoaded: false,
         gameId: gameId,
         currentPlayer: 0,
         myColor: 0,
         gameStarted: false,
         gameEnded: false,
         userId: null,
         gameName: "Warcaby",
         stakes: null,
         playerName1: null,
         playerName2: null,
         timeControl: null,
         timeControlBonus: null,
         player1ID: null,
         player2ID: null,
         board: [
            ["-", "b", "-", "b", "-", "b", "-", "b"],
            ["b", "-", "b", "-", "b", "-", "b", "-"],
            ["-", "b", "-", "b", "-", "b", "-", "b"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-", "-", "-"],
            ["r", "-", "r", "-", "r", "-", "r", "-"],
            ["-", "r", "-", "r", "-", "r", "-", "r"],
            ["r", "-", "r", "-", "r", "-", "r", "-"]
         ],
         activePlayer: "r",
         count: 0,
         popShown: false,
         prevRowIndex: null,
         prevCellIndex: null,
         fetchStateUpdated1: false,
         fetchStateUpdated2: false,
         ws: null,
         didntUpdateYet: true
      };
   }

   checkIfLoggedIn() {
      if (localStorage.getItem("authToken") === null) {
         this.setState({
            loggedIn: false,
            loaded: true
         });
      }
   }

   componentDidMount() {
      this.checkIfLoggedIn();
      console.log("ROOM: componentDidMount: calling this.getRoomInfo();");
      this.getRoomInfo();
   }

   componentDidUpdate() {
      if (this.state.fetchStateUpdated1 && this.state.fetchStateUpdated2 && this.state.didntUpdateYet) {
         var ws = new WebSocket("ws://localhost:8080/CheckersSpring_war_exploded/game/" + this.state.userId);
         ws.onopen = () => {
            console.log("ROOM: sending initial");
            var json = JSON.stringify({
               gameId: this.state.gameId,
               userId: this.state.userId,
               userToken: this.state.token,
               myColor: this.state.myColor,
               timeControl: this.state.timeControl,
               timeControlBonus: this.state.timeControlBonus,
               start: false
            });
            console.log(json);
            this.state.ws.send(json);
         };

         ws.onmessage = event => {
            console.log("checkers received a message: ##################################################################################");
            console.log(event.data);

            //@@@@@@@@@@@@@ WHEN RECEIVES GAME RESULTS
            if (event.data.gameResult != null) {
               this.handleResult(event.data.gameResult);
               return 0;
            }

            //@@@@@@@@@@@@@ WHEN RECEIVES A GAME BOARD WITH MOVE OR HIGHLIGHT

            this.handleResult(event.data.gameResult);
            this.setState({
               board: event.data.board,
               currentPlayer: (this.state.currentPlayer + 1) % 2,
               gameStarted: true
            });
         };
         this.setState({
            ws: ws,
            didntUpdateYet: false
         });

         setTimeout(() => {
            console.log("!@#!@#!@#!@#");
            console.log(this.send);
            console.log(this.state.ws);
         }, 1000);
      }
   }

   getRoomInfo = () => {
      let index = window.location.href.lastIndexOf("Id=");
      let gameId = window.location.href.substring(index + 3);
      this.setState({ gameId: gameId });
      var bearer = "Bearer " + localStorage.getItem("authToken");

      this.updateRoom();
      this.joinRoom();
      let interval = setInterval(() => {
         this.updateRoom();
      }, 1000);
      this.setState({
         interval: interval
      });
   };

   updateRoom = () => {
      let index = window.location.href.lastIndexOf("Id=");
      let gameId = window.location.href.substring(index + 3);
      this.setState({ gameId: gameId });
      var bearer = "Bearer " + localStorage.getItem("authToken");

      fetch("https://localhost:44316/api/Room/Settings/" + gameId, {
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
            // console.log("ROOM: settings response");
            // console.log(response);
            let color;
            if (response.player1Id === response.myId) {
               color = 0;
            } else {
               color = 1;
            }
            this.setState({
               fetchStateUpdated1: true,
               stakes: response.settings.cash,
               playerName1: response.settings.player1Name,
               playerName2: response.settings.player2Name,
               timeControl: response.settings.timeControl,
               timeControlBonus: response.settings.timeControlBonus,
               gameName: response.settings.gameName,
               userID1: response.user1id,
               userID2: response.user2id,
               userId: response.myId,
               myColor: color
            });
         })
         .catch(error => console.error("Error:", error));
   };

   joinRoom = () => {
      let index = window.location.href.lastIndexOf("Id=");
      let gameId = window.location.href.substring(index + 3);
      this.setState({ gameId: gameId });
      var bearer = "Bearer " + localStorage.getItem("authToken");

      let body = {
         cash: 10,
         timeControl: 10,
         timeControlBonus: 25
      };

      fetch("https://localhost:44316/api/Room/Manage?Id=" + gameId, {
         method: "POST",
         body: JSON.stringify(body),
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
            Authorization: bearer
         }
      })
         .then(response => response.json())
         .then(json => {
            console.log("response manage");
            console.log(json);
            this.setState({ fetchStateUpdated2: true });
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
                  <h1>{this.state.gameResult ? "Zwycięstwo" : "Porażka"}</h1>
               </div>
            </div>
            <div className="main-wrapper justify-content-center">
               <div className="row justify-content-center">
                  <div className="col-8">
                     <GameBoard ws={this.state.ws} {...this.state} handlePieceClick={this.handlePieceClick} />
                  </div>
                  <div className="col-4">
                     <GameUI ws={this.state.ws} {...this.state} />
                  </div>
               </div>
            </div>
         </React.Fragment>
      );
   }

   handleResign = () => {
      console.log("resigned");
      this.setState({ gameEnded: true });

      var json = JSON.stringify({
         gameId: this.state.gameId,
         userId: this.state.userId,
         userToken: this.state.token,
         myColor: this.state.myColor,
         type: "resign"
      });
      this.state.ws.send(json);
   };

   //TODO dodac remis, sprawdzic adres api, sprawdzic logike
   handleResult = result => {
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
      if (result === 1 && this.state.myColor === 0) {
         url = "https://localhost:44316/api/Game/Win";
      } else {
         url = "https://localhost:44316/api/Game/Lose";
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
   };

   handlePieceClick = e => {
      console.log("CHECKERS: handlePieceClick");
      console.log(this.state);
      console.log(this.props);
      let rowIndex = parseInt(e.target.attributes["data-row"].nodeValue);
      let cellIndex = parseInt(e.target.attributes["data-cell"].nodeValue);

      console.log("CHECKERS: calling sendPieceClick");
      this.sendPieceClick(cellIndex, rowIndex);

      var state = this.state;
      if (this.state.board[rowIndex][cellIndex].indexOf(this.state.activePlayer) > -1) {
         //this is triggered if the piece that was clicked on is one of the player's own pieces, it activates it and highlights possible moves
         // state.board[rowIndex][cellIndex] = "a" + this.state.board[rowIndex][cellIndex];
         // //this.highlightPossibleMoves(rowIndex, cellIndex);
         state.prevCellIndex = cellIndex;
         state.prevRowIndex = rowIndex;
      } else if (this.state.board[rowIndex][cellIndex].indexOf("h") > -1) {
         //this is activated if the piece clicked is a highlighted square, it moves the active piece to that spot.
         //state.board = this.executeMove(rowIndex, cellIndex, this.state.board, this.state.activePlayer);
         this.sendMove(this.state.prevCellIndex, this.state.prevRowIndex, cellIndex, rowIndex);
         //is the game over? if not, swap active player
         // this.setState(this.state);

         state.activePlayer = this.state.activePlayer === "r" ? "b" : "r";
      }
      this.setState(state);
   };

   componentWillUnmount() {
      clearInterval(this.state.interval);
   }

   //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ SEND DATA @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   convertColumnIndexToLetter = c => {
      return (c + 10).toString(36).toUpperCase();
   };

   sendMove = (a, b, c, d) => {
      console.log("sendMove called");
      var a1 = this.convertColumnIndexToLetter(a);
      var a2 = this.convertColumnIndexToLetter(c);

      let state = this.state.gameState;
      state.currentPlayer = (state.currentPlayer + 1) % 2;
      state.gameStarted = true;
      this.setState({ gameState: state });
      this.send(a1 + (8 - b) + "-" + a2 + (8 - d), "move");
   };

   sendPieceClick = (a, b) => {
      console.log("sendPieceClick called");
      var a1 = this.convertColumnIndexToLetter(a);
      this.send(a1 + (8 - b), "piece-click");
   };
}

export default WithWebSocket(CheckersRoomPage);
