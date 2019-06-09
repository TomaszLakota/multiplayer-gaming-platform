import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class RoomInfoBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    //this.routeChange = this.routeChange.bind(this);
  }

  changeRoute = () => {
    this.setState({
      goToRoom: 123 //this.props.room.roomId
    });
  };

  render() {
    console.log(this.props);
    if (this.state.goToRoom != null) {
      return <Redirect to={"/room/" + this.state.goToRoom} push />;
    }
    return (
      <div className="lobbyInfoBar" onClick={this.changeRoute}>
        <div>
          {this.props.room.player1} vs {this.props.room.player2}
        </div>
        <div>{this.props.room.stakes}zł</div>
        <div>
          {this.props.room.timeControl / 60}m+{this.props.room.timeControlBonus}s
        </div>
      </div>
    );
  }
}

// RoomInfoBar.contextTypes = {
//   router: React.PropTypes.func.isRequired
// };

export default RoomInfoBar;
