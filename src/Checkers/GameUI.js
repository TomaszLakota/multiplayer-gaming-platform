import React, { Component } from "react";
import ChessClock from "./ChessClock";

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
  }

  componentDidMount() {
    console.log("component did mount");
  }

  componentDidUpdate() {
    console.log("component gameUI did update");
  }

  render() {
    console.log("rendering gameUI");

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
            <ChessClock clockInfo={this.props.clockInfo} gameState={this.props.gameState} clockID={0} key="clock1" />
            <ChessClock clockInfo={this.props.clockInfo} gameState={this.props.gameState} clockID={1} key="clock2" />
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
          <div className="GUI_chat row">
            <div className="col">
              <div>
                <h5>Chat</h5>
              </div>
              <div className="GUI_chat_text">
                {/* <p>
                  <span>Lorem ipsum</span> GG Noob
                </p>
                <p>
                  <span>Lorem ipsum</span> Git gud
                </p>
                <p>
                  <span>Ja</span> gg ez
                </p>
                <p>
                  <span>Lorem ipsum</span> "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
                </p>
                <p>
                  <span>Lorem ipsum</span> "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
                </p>
                <p>
                  <span>Lorem ipsum</span> "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
                </p> */}
              </div>
              <div>
                <input />
                <button>Wyślij</button>
              </div>
            </div>
          </div>

          {
            //TODO <Chat />
          }
        </div>
      </div>
    );
  }

  handleSettingsButtonClick = () => {};
  handleDrawButtonClick = () => {};
}

export default GameUI;
