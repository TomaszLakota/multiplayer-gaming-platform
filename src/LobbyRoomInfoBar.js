import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class RoomInfoBar extends Component {
   constructor(props) {
      super(props);
      this.state = { goToRoom: null };
   }

   changeRoute = () => {
      this.setState({
         goToRoom: this.props.room.roomId
      });
   };

   render() {
      console.log(this.props);
      if (this.state.goToRoom != null) {
         return <Redirect to={"/room/" + this.state.goToRoom} push />;
      }
      return (
         <tr className="lobbyInfoBar" onClick={this.changeRoute}>
            <td>
               {this.props.room.player1}
               {/* vs {this.props.room.player2} */}
            </td>
            <td>{this.props.room.playerRanking}</td>
            <td>{this.props.room.stakes}zł</td>
            <td>
               {this.props.room.timeControl / 60}m+{this.props.room.timeControlBonus}s
            </td>
         </tr>
      );
   }
}

export default RoomInfoBar;
