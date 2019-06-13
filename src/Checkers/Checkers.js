import React, { Component } from "react";
import "./Checkers.css";
import WithWebSocket from "./WebSocketHOC";

//credit to Caleb OLeary, i modified his single player checkers app https://github.com/caleboleary/React-Checkers-and-AI-Opponent

//row is passed a single row from the board, returns a container and a Cell for each item in the array
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

//cell is passed a single item in a row, and renders it out, it also calls it's grand-parent's swapper function on click
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
         gameState: {
            currentPlayer: 0,
            myColor: 0,
            gameStarted: false,
            gameEnded: false
         },
         gameId: this.props.gameId,
         userId: this.props.userId
      };

      this.send = this.props.send.bind(this);
   }

   ws;

   componentDidUpdate() {
      console.log("CHECKERS: board did update; state and props:");
      console.log(this.state);
      console.log(this.props);
   }

   componentDidMount() {
      console.log("CHECKERS: board did mount; state and props:");
      console.log(this.state);
      console.log(this.props);

      this.ws = this.props.ws;

      setTimeout(() => {
         console.log("CHECKERS: props and ws after 2s");
         console.log(this.props);
         console.log(this.ws);
      }, 2000);
   }

   //@@@@@@@@@@@@@@@@@@@ ONMESSAGE ONMESSAGE ONMESSAGE ONMESSAGE ONMESSAGE ONMESSAGE
   initSocket = () => {
      console.log("CHECKERS: initsocket called");
      this.ws.onmessage = event => {
         console.log("checkers received a message:");
         console.log(event.data);

         let state = this.state.gameState;
         state.currentPlayer = (state.currentPlayer + 1) % 2;
         state.gameStarted = true;

         //@@@@@@@@@@@@@ WHEN RECEIVES A GAME BOARD WITH MOVE OR HIGHLIGHT
         if (event.data.gameResult != null) {
            state.gameResult = event.data.gameResult;
         }
         this.setState({
            board: event.data.board,
            gameState: state
         });

         //@@@@@@@@@@@@@ WHEN RECEIVES GAME RESULTS
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
            <div className={this.props.gameState.myColor === 1 ? "board_black" : "board"}>
               {this.state.board.map(function(row, index) {
                  return <Row rowArr={row} handlePieceClick={this.handlePieceClick.bind(this)} rowIndex={index} key={"row" + index} />;
               }, this)}
            </div>
         </div>
      );
   }
   aboutPopOpen(e) {
      this.setState({ popShown: true });
   }
   aboutPopClose(e) {
      this.setState({ popShown: false });
   }

   handlePieceClickNew(e) {
      let rowIndex = parseInt(e.target.attributes["data-row"].nodeValue);
      let cellIndex = parseInt(e.target.attributes["data-cell"].nodeValue);

      if (this.state.board[rowIndex][cellIndex].indexOf(this.state.activePlayer) > -1) {
         console.log("CHECKERS: calling sendPieceClick");
         this.sendPieceClick(cellIndex, rowIndex);
      } else {
         console.log("CHECKERS ERROR: nie twoj kolor/ruch");
      }
   }

   handlePieceClick(e) {
      console.log("CHECKERS: handlePieceClick");
      this.handlePieceClickNew(e);
      let rowIndex = parseInt(e.target.attributes["data-row"].nodeValue);
      let cellIndex = parseInt(e.target.attributes["data-cell"].nodeValue);
      var state = this.state;
      if (this.state.board[rowIndex][cellIndex].indexOf(this.state.activePlayer) > -1) {
         //this is triggered if the piece that was clicked on is one of the player's own pieces, it activates it and highlights possible moves
         state.board = this.state.board.map(function(row) {
            return row.map(function(cell) {
               return cell.replace("a", "");
            });
         }); //un-activate any previously activated pieces
         state.board[rowIndex][cellIndex] = "a" + this.state.board[rowIndex][cellIndex];
         this.highlightPossibleMoves(rowIndex, cellIndex);
         state.prevCellIndex = cellIndex;
         state.prevRowIndex = rowIndex;
      } else if (this.state.board[rowIndex][cellIndex].indexOf("h") > -1) {
         //this is activated if the piece clicked is a highlighted square, it moves the active piece to that spot.
         state.board = this.executeMove(rowIndex, cellIndex, this.state.board, this.state.activePlayer);
         this.sendMove(this.state.prevCellIndex, this.state.prevRowIndex, cellIndex, rowIndex);
         //is the game over? if not, swap active player
         this.setState(this.state);
         if (this.winDetection(this.state.board, this.state.activePlayer)) {
            console.log(this.state.activePlayer + " won the game!");
         } else {
            state.activePlayer = this.state.activePlayer === "r" ? "b" : "r";
         }
      }
      this.setState(state);
   }

   executeMove(rowIndex, cellIndex, board, activePlayer) {
      let activePiece;
      for (let i = 0; i < board.length; i++) {
         //for each row
         for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].indexOf("a") > -1) {
               activePiece = board[i][j];
            }
         }
      }
      //make any jump deletions
      let deletions = board[rowIndex][cellIndex].match(/d\d\d/g);
      if (typeof deletions !== undefined && deletions !== null && deletions.length > 0) {
         for (let k = 0; k < deletions.length; k++) {
            let deleteCoords = deletions[k].replace("d", "").split("");
            board[deleteCoords[0]][deleteCoords[1]] = "-";
         }
      }
      //remove active piece from it's place
      board = board.map(function(row) {
         return row.map(function(cell) {
            return cell.replace(activePiece, "-");
         });
      });
      //unhighlight
      board = board.map(function(row) {
         return row.map(function(cell) {
            return cell
               .replace("h", "-")
               .replace(/d\d\d/g, "")
               .trim();
         });
      });
      //place active piece, now unactive, in it's new place
      board[rowIndex][cellIndex] = activePiece.replace("a", "");
      if ((activePlayer === "b" && rowIndex === 7) || (activePlayer === "r" && rowIndex === 0)) {
         board[rowIndex][cellIndex] += " k";
      }
      return board;
   }

   //@@@@@@@@@@@@@@@@@@@@@@@@@@@@ highlightPossibleMoves
   highlightPossibleMoves(rowIndex, cellIndex) {
      //unhighlight any previously highlighted cells
      var state = this.state;
      state.board = this.state.board.map(function(row) {
         return row.map(function(cell) {
            return cell
               .replace("h", "-")
               .replace(/d\d\d/g, "")
               .trim();
         });
      });

      let possibleMoves = this.findAllPossibleMoves(rowIndex, cellIndex, state.board, this.state.activePlayer);

      //actually highlight the possible moves on the board
      //the 'highlightTag' inserts the information in to a cell that specifies
      for (let j = 0; j < possibleMoves.length; j++) {
         let buildHighlightTag = "h ";
         for (let k = 0; k < possibleMoves[j].wouldDelete.length; k++) {
            buildHighlightTag += "d" + String(possibleMoves[j].wouldDelete[k].targetRow) + String(possibleMoves[j].wouldDelete[k].targetCell) + " ";
         }
         state.board[possibleMoves[j].targetRow][possibleMoves[j].targetCell] = buildHighlightTag;
      }
      console.log(state.board);
      console.log(state);
      this.setState({
         board: state.board
      });
      console.log(this.state);
   }

   findAllPossibleMoves(rowIndex, cellIndex, board, activePlayer) {
      let possibleMoves = [];
      let directionOfMotion = [];
      let leftOrRight = [1, -1];
      let isKing = board[rowIndex][cellIndex].indexOf("k") > -1;
      if (activePlayer === "b") {
         directionOfMotion.push(1);
      } else {
         directionOfMotion.push(-1);
      }

      //if it's a king, we allow it to both go forward and backward, otherwise it can only move in it's color's normal direction
      //the move loop below runs through every direction of motion allowed, so if there are two it will hit them both
      if (isKing) {
         directionOfMotion.push(directionOfMotion[0] * -1);
      }

      //normal move detection happens here (ie. non jumps)
      //for each direction of motion allowed to the piece it loops (forward for normal pieces, both for kings)
      //inside of that loop, it checks in that direction of motion for both left and right (checkers move diagonally)
      //any moves found are pushed in to the possible moves array
      for (let j = 0; j < directionOfMotion.length; j++) {
         for (let i = 0; i < leftOrRight.length; i++) {
            if (
               typeof board[rowIndex + directionOfMotion[j]] !== "undefined" &&
               typeof board[rowIndex + directionOfMotion[j]][cellIndex + leftOrRight[i]] !== "undefined" &&
               board[rowIndex + directionOfMotion[j]][cellIndex + leftOrRight[i]] === "-"
            ) {
               if (
                  possibleMoves
                     .map(function(move) {
                        return String(move.targetRow) + String(move.targetCell);
                     })
                     .indexOf(String(rowIndex + directionOfMotion[j]) + String(cellIndex + leftOrRight[i])) < 0
               ) {
                  possibleMoves.push({ targetRow: rowIndex + directionOfMotion[j], targetCell: cellIndex + leftOrRight[i], wouldDelete: [] });
               }
            }
         }
      }

      //get jumps
      let jumps = this.findAllJumps(rowIndex, cellIndex, board, directionOfMotion[0], [], [], isKing, activePlayer);

      //loop and push all jumps in to possibleMoves
      for (let i = 0; i < jumps.length; i++) {
         possibleMoves.push(jumps[i]);
      }
      return possibleMoves;
   }
   findAllJumps(sourceRowIndex, sourceCellIndex, board, directionOfMotion, possibleJumps, wouldDelete, isKing, activePlayer) {
      //jump moves
      let thisIterationDidSomething = false;
      let directions = [directionOfMotion];
      let leftOrRight = [1, -1];
      if (isKing) {
         //if it's a king, we'll also look at moving backwards
         directions.push(directions[0] * -1);
      }
      //here we detect any jump possible moves
      //for each direction available to the piece (based on if it's a king or not)
      //and for each diag (left or right) we look 2 diag spaces away to see if it's open and if we'd jump an enemy to get there.
      for (let k = 0; k < directions.length; k++) {
         for (let l = 0; l < leftOrRight.length; l++) {
            //leftOrRight[l];
            if (
               typeof board[sourceRowIndex + directions[k]] !== "undefined" &&
               typeof board[sourceRowIndex + directions[k]][sourceCellIndex + leftOrRight[l]] !== "undefined" &&
               typeof board[sourceRowIndex + directions[k] * 2] !== "undefined" &&
               typeof board[sourceRowIndex + directions[k] * 2][sourceCellIndex + leftOrRight[l] * 2] !== "undefined" &&
               board[sourceRowIndex + directions[k]][sourceCellIndex + leftOrRight[l]].indexOf(activePlayer === "r" ? "b" : "r") > -1 &&
               board[sourceRowIndex + directions[k] * 2][sourceCellIndex + leftOrRight[l] * 2] === "-"
            ) {
               if (
                  possibleJumps
                     .map(function(move) {
                        return String(move.targetRow) + String(move.targetCell);
                     })
                     .indexOf(String(sourceRowIndex + directions[k] * 2) + String(sourceCellIndex + leftOrRight[l] * 2)) < 0
               ) {
                  //this eventual jump target did not already exist in the list
                  let tempJumpObject = {
                     targetRow: sourceRowIndex + directions[k] * 2,
                     targetCell: sourceCellIndex + leftOrRight[l] * 2,
                     wouldDelete: [
                        {
                           targetRow: sourceRowIndex + directions[k],
                           targetCell: sourceCellIndex + leftOrRight[l]
                        }
                     ]
                  };
                  for (let i = 0; i < wouldDelete.length; i++) {
                     tempJumpObject.wouldDelete.push(wouldDelete[i]);
                  }
                  possibleJumps.push(tempJumpObject);
                  thisIterationDidSomething = true;
               }
            }
         }
      }

      //if a jump was found, thisIterationDidSomething is set to true and this function calls itself again from that source point, this is how we recurse to find multi jumps
      if (thisIterationDidSomething) {
         for (let i = 0; i < possibleJumps.length; i++) {
            let coords = [possibleJumps[i].targetRow, possibleJumps[i].targetCell];
            let children = this.findAllJumps(coords[0], coords[1], board, directionOfMotion, possibleJumps, possibleJumps[i].wouldDelete, isKing, activePlayer);
            for (let j = 0; j < children.length; j++) {
               if (possibleJumps.indexOf(children[j]) < 0) {
                  possibleJumps.push(children[j]);
               }
            }
         }
      }
      return possibleJumps;
   }
   setBoardState(board, activePlayer) {
      this.setState({
         board: board,
         activePlayer: activePlayer || "r"
      });
   }
   winDetection(board, activePlayer) {
      let enemyPlayer = activePlayer === "r" ? "b" : "r";
      let result = true;
      for (let i = 0; i < board.length; i++) {
         for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].indexOf(enemyPlayer) > -1) {
               result = false;
            }
         }
      }
      return result;
   }
   cloneBoard(board) {
      let output = [];
      for (let i = 0; i < board.length; i++) output.push(board[i].slice(0));
      return output;
   }
}

export default WithWebSocket(GameBoard);
