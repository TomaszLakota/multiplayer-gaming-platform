import React from "react";

export default function Authorized(WrappedComponent) {
   return class extends React.Component {
      constructor(props) {
         super(props);
         let loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
         // console.log("logged in = " + loggedIn);
         this.state = {
            loggedIn: loggedIn,
            loaded: false,
            _isMounted: true
         };
      }

      componentDidMount() {
         // console.log("Authorized component did mount");
         var bearer = "Bearer " + localStorage.getItem("authToken");
         // console.log(bearer);
         if (JSON.parse(localStorage.getItem("loggedIn")) === false) {
            this.setState({ loaded: true, loggedIn: false });
            return 0;
         }
         fetch("https://localhost:44316/api/user/Info", {
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
               // console.log("AUTHORIZED response");
               // console.log(json);

               this.setState({
                  email: json.currentUser.email,
                  playerid: json.currentUser.id,
                  money: json.currentUser.money,
                  password: json.currentUser.password,
                  rankingPoints: json.currentUser.rankingPoints,
                  username: json.currentUser.username,
                  loggedIn: true,
                  loaded: true
               });

               localStorage.setItem("loggedIn", true);
            })
            .catch(error => {
               console.log("AUTHORIZED error");
               console.error("Error:", error);
               this.setState({ loaded: true, loggedIn: false });

               localStorage.setItem("loggedIn", false);
            });
      }

      render() {
         return <WrappedComponent {...this.state} {...this.props} />;
      }
   };
}
