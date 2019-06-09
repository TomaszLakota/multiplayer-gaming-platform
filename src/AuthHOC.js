import React from "react";

export default function Authorized(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      let loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
      this.state = {
        loggedIn: loggedIn,
        loaded: false
      };

      console.log(this.props);
    }

    componentDidMount() {
      var bearer = "Bearer " + localStorage.getItem("authToken");
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
          setTimeout(() => {
            this.setState({
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
