import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class RoomInfoBar extends Component {
   constructor(props) {
      super(props);
      this.state = { goToRoom: null };
   }

   changeRoute = () => {
      console.log(this.props.room.id);
      this.setState({
         goToRoom: this.props.room.id
      });
   };

   render() {
      // console.log(this.props);
      if (this.state.goToRoom != null) {
         return <Redirect to={"/Room/Manage?Id=" + this.state.goToRoom} push />;
      }
      return (
         <tr className="lobbyInfoBar" onClick={this.changeRoute}>
            <td>
               {this.props.room.player1Name}
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
