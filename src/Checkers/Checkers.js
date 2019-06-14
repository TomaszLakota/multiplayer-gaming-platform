import React, { Component } from "react";
import "./Checkers.css";
import WithWebSocket from "./WebSocketHOC";

//credit to Caleb OLeary, i modified his single player checkers app https://github.com/caleboleary/React-Checkers-and-AI-Opponent

class Row extends Component {
   render() {
      return (
         <div className="board_row">
            {this.props.rowArr.map(function(cell, index) {
               return <Cell rowIndex={this.props.rowIndex} index={index} cell={cell} handlePieceClick={this.props.handlePieceClick} key={"row" + index} />;
            }, this)}
         </div>
      );
   }
}

class Cell extends Component {
   render() {
      return (
         <div className={"cell cell-" + this.props.cell}>
            <div onClick={this.props.handlePieceClick} data-row={this.props.rowIndex} data-cell={this.props.index} className="gamePiece" />
         </div>
      );
   }
}

//game board calls row for each item in the board array
class GameBoard extends Component {
   constructor(props) {
      super(props);

      this.state = {
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

         currentPlayer: 0,
         gameStarted: false,
         gameEnded: false,

         gameId: this.props.gameId,
         userId: this.props.userId
      };

      this.send = this.props.send.bind(this);
      this.handlePieceClick = this.props.handlePieceClick.bind(this);
   }

   ws;

   componentDidUpdate() {
      // console.log("CHECKERS: board did update; state and props:");
      // console.log(this.state);
      // console.log(this.props);
   }

   componentDidMount() {
      // console.log("CHECKERS: board did mount; state and props:");
      // console.log(this.state);
      // console.log(this.props);

      this.ws = this.props.ws;

      setTimeout(() => {
         console.log("CHECKERS: props and ws after 2s ########################################################");
         console.log(this.props);
         console.log(this.props.ws);
         console.log(this.props.ws.onmessage);
      }, 2000);
   }

   //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ SEND DATA @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   convertColumnIndexToLetter = c => {
      return (c + 10).toString(36).toUpperCase();
   };

   sendMove = (a, b, c, d) => {
      var a1 = this.convertColumnIndexToLetter(a);
      var a2 = this.convertColumnIndexToLetter(c);

      let state = this.state.gameState;
      state.currentPlayer = (state.currentPlayer + 1) % 2;
      state.gameStarted = true;
      this.setState({ gameState: state });
      this.send(a1 + (8 - b) + "-" + a2 + (8 - d), "move");
   };

   sendPieceClick = (a, b) => {
      var a1 = this.convertColumnIndexToLetter(a);
      this.send(a1 + (8 - b), "piece-click");
   };

   render() {
      return (
         <div className="board_container">
            <div className={this.props.myColor === 1 ? "board_black" : "board"}>
               {this.props.board.map(function(row, index) {
                  return <Row rowArr={row} handlePieceClick={this.handlePieceClick.bind(this)} rowIndex={index} key={"row" + index} />;
               }, this)}
            </div>
         </div>
      );
   }
}

export default WithWebSocket(GameBoard);
