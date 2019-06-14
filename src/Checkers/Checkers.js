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

      this.state = {};

      this.send = this.props.send.bind(this);
      this.handlePieceClick = this.props.handlePieceClick.bind(this);
   }

   ws = null;

   componentDidMount() {
      this.ws = this.props.ws;

      setTimeout(() => {
         console.log("CHECKERS: props and ws after 2s");
         console.log(this.props);
         console.log(this.props.ws);
      }, 2000);
   }

   render() {
      return (
         <div className="board_container">
            <div className={this.props.myColor === 1 ? "board_black" : "board"}>
               {this.props.board.map(function(row, index) {
                  return <Row rowArr={row} handlePieceClick={this.props.handlePieceClick} rowIndex={index} key={"row" + index} />;
               }, this)}
            </div>
         </div>
      );
   }
}

export default WithWebSocket(GameBoard);
