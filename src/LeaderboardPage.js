import React, { Component } from "react";
import Navbar from "./Navbar";
import Leaderboard from "./Leaderboard";

class LeaderboardPage extends Component {
   state = {
      data: []
   };

   componentDidMount() {
      let body = {
         username: this.state.login,
         password: this.state.password
      };

      fetch("https://localhost:44316/api/user/Ranking", {
         method: "GET",
         headers: {
            "Content-Type": "application/json"
         }
      })
         .then(response => response.json())
         .then(json => {
            console.log("json");
            console.log(json);
            this.setState({ data: json });
            console.log(this.state);
         })
         .catch(error => console.error("Error:", error));
   }

   render() {
      return (
         <React.Fragment>
            <Navbar />
            <div className="row justify-content-center">
               <div className="col-5">
                  <Leaderboard data={this.state.data} />
               </div>
            </div>
         </React.Fragment>
      );
   }
}

export default LeaderboardPage;
