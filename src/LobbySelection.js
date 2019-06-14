import React, { Component } from "react";
import RoomInfoBar from "./LobbyRoomInfoBar";
import { Redirect } from "react-router-dom";

class LobbySelection extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isLoaded: false,
         loadingError: false,
         roomList: [],
         intervalID: null
      };
   }

   requestRoomList = () => {
      // console.log("REQUEST ROOM LIST");
      // console.log(localStorage.getItem("authToken"));
      this.setState({ token: localStorage.getItem("authToken") });
      var bearer = "Bearer " + localStorage.getItem("authToken");
      if (localStorage.getItem("authToken") === null) {
         return 0;
      }
      fetch("https://localhost:44316/api/Room/Rooms", {
         method: "GET",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
            Authorization: bearer
         }
      })
         .then(response => response.json())
         .then(roomList => {
            console.log(roomList);
            if (!(JSON.stringify(roomList) === JSON.stringify(this.state.roomList))) {
               this.setState({
                  roomList: roomList
               });
            }
         })
         .catch(error => console.error("Error:", error));
   };

   getRooms() {
      // this.requestRoomList();
      let interval = setInterval(this.requestRoomList, 1000); //TODO: change to 1000
      this.setState({
         intervalID: interval
      });
   }

   componentDidMount() {
      this.getRooms();
   }

   componentWillUnmount() {
      if (this.state.intervalID != null) {
         clearInterval(this.state.intervalID);
      }
   }
   handleCreateRoom() {
      var bearer = "Bearer " + localStorage.getItem("authToken");
      // console.log(bearer);
      let body = {
         cash: 10,
         timeControl: 60,
         timeControlBonus: 5
      };
      let rand = Math.floor(Math.random() * 100000000);
      fetch("https://localhost:44316/api/Room/Manage?Id=" + rand, {
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
            console.log(json);
         })
         .catch(error => console.error("Error:", error));
   }

   render() {
      // console.log(this.state);
      if (Array.isArray(this.state.roomList)) {
         var rooms = this.state.roomList.map((room, i) => {
            return <RoomInfoBar key={i} {...room} />;
         });
      } else {
      }

      return (
         <div className="lobbyPage">
            {this.state.token === null && <Redirect to="/login" push />}

            <button className="btn btn-info" onClick={this.handleCreateRoom}>
               Nowa gra
            </button>

            <h2>{this.props.gameName}</h2>
            <div className="lobbyTableContainer">
               <table>
                  <thead>
                     <tr>
                        <td>Gracz</td>
                        <td>Ranking</td>
                        <td>Stawka</td>
                        <td>Czas</td>
                     </tr>
                  </thead>
                  <tbody>{rooms}</tbody>
               </table>
            </div>
         </div>
      );
   }
}

export default LobbySelection;
