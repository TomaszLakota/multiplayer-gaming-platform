import React, { Component } from "react";
import RoomInfoBar from "./LobbyRoomInfoBar";
import { NavLink } from "react-router-dom";

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
    console.log(localStorage.getItem("authToken"));
    this.setState({ token: localStorage.getItem("authToken") });
    var bearer = "Bearer " + localStorage.getItem("authToken");

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
      .then(json => {
        console.log(json);
        this.setState({
          roomList: json
        });
      })
      .catch(error => console.error("Error:", error));

    //TODO usunac placeholdery
    // let room1 = {
    //   id: 333,
    //   player1: "kozak",
    //   player2: "pro",
    //   stakes: 10,
    //   timeControl: 120,
    //   timerControlBonus: 5
    // };
    // let room2 = room1;
    // let room3 = room1;
    // let room4 = room1;
    // let roomList = [room1, room2, room3, room4];
    // this.setState({ roomList: roomList });
    console.log(this);
  };

  getRooms() {
    this.requestRoomList();
    let interval = setInterval(this.requestRoomList, 3000);
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

  render() {
    console.log(this.state);
    if (Array.isArray(this.state.roomList)) {
      var rooms = this.state.roomList.map((room, i) => {
        return <RoomInfoBar room={room} key={i} />;
      });
    } else {
    }

    return (
      <div className="lobbyPage">
        <NavLink exact to={"/room/" + Math.floor(Math.random() * 10000)}>
          <button className="btn btn-info">Nowa gra</button>
        </NavLink>
        <h2>{this.props.gameName}</h2>
        <div className="lobbySelectionContainer">{rooms}</div>
        {rooms}
      </div>
    );
  }
}

export default LobbySelection;
