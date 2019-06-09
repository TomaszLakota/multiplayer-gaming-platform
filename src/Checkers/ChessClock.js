import React, { Component } from "react";

class ChessClock extends Component {
  constructor(props) {
    super(props);
    this.state = { time: props.clockInfo.timeControl, currentPlayer: this.props.gameState.currentPlayer };
    // console.log(this.state);
  }
  render() {
    return (
      <div className="h2 col">
        {this.state.time / 60 - ((this.state.time / 60) % 1)}:{this.state.time % 60 < 10 ? "0" + (this.state.time % 60) : this.state.time % 60}
      </div>
    );
  }

  componentDidUpdate() {
    // console.log("component chessclock did update");
    // console.log(this.props);
    this.startStopClock();
  }

  startStopClock() {
    // console.log("startStopClock " + this.props.clockID + this.props.gameState.currentPlayer + " time: " + this.state.time);
    //initialize clocks
    if (this.state.time == null && this.props.clockInfo.timeControl != null) {
      this.setState({ time: this.props.clockInfo.timeControl });
    }

    //start clock
    if (!this.props.gameState.gameEnded && this.props.gameState.gameStarted && this.props.clockID === this.props.gameState.currentPlayer && this.timerID == null) {
      this.timerID = setInterval(() => {
        this.setState({ time: this.state.time - 1 });
      }, 1000);
    }

    //stop clock and add time
    if (!this.props.gameState.gameEnded && this.props.gameState.gameStarted && this.props.clockID !== this.props.gameState.currentPlayer && this.timerID != null) {
      if (this.props.clockID !== this.props.gameState.currentPlayer) {
        this.setState({ time: this.state.time + this.props.clockInfo.timeControlBonus });
        clearInterval(this.timerID);
        this.timerID = null;
      }
    }

    if (this.props.gameState.gameEnded || !this.props.gameState.gameStarted) {
      if (this.timerID != null) {
        clearInterval(this.timerID);
        this.timerID = null;
      }
    }
  }
}

export default ChessClock;
