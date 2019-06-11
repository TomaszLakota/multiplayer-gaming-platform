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
         var bearer = "Bearer " + localStorage.getItem("authToken");
         // console.log(bearer);
         if (JSON.parse(localStorage.getItem("loggedIn")) === false) {
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
               console.log("NAVBAR response");
               console.log(json);
               setTimeout(() => {
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
               }, 1000);
               localStorage.setItem("loggedIn", true);
            })
            .catch(error => {
               this.setState({ loaded: true, loggedIn: false });
               console.error("Error:", error);
               localStorage.setItem("loggedIn", false);
            });
      }

      render() {
         return <WrappedComponent {...this.state} {...this.props} />;
      }
   };
}
