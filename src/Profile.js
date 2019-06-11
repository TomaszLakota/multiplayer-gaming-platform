import React, { Component } from "react";

class Profile extends Component {
   constructor(props) {
      super(props);
      this.state = {
         password: ""
      };
   }

   componentDidUpdate() {
      // console.log("Profile component did update");
   }

   render() {
      // console.log("####PROFIL");
      // console.log(this.props);
      if (!this.props.loaded) {
         return <div className="profile-container"> loading... </div>;
      }

      return (
         <div className="profile-container">
            <table>
               <tbody>
                  <tr>
                     <td>
                        <h3>{this.props.username}</h3>
                     </td>
                  </tr>
                  <tr>
                     <td>Email </td>
                     <td> {this.props.email}</td>
                  </tr>
                  <tr>
                     <td>Ranking </td>
                     <td> {this.props.rankingPoints}</td>
                  </tr>
                  <tr>
                     <td>Stan konta </td>
                     <td>{this.props.money} zł</td>
                  </tr>
               </tbody>
            </table>
            <div>
               <br />
               <h6>Zmień hasło</h6>
               <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                     <input type="password" id="password" className="form-control" onChange={this.handleChange} />
                  </div>
                  <button>Zapisz</button>
               </form>
            </div>
         </div>
      );
   }

   handleChange = e => {
      this.setState({
         [e.target.id]: e.target.value
      });
   };

   onSubmit = event => {
      let body = {
         password: this.state.password
      };
      event.preventDefault();
      fetch("https://localhost:44316/api/Auth/changePassword", {
         method: "PUT",
         body: JSON.stringify(body),
         headers: {
            "Content-Type": "application/json"
         }
      })
         .then(response => response.json())
         .then(json => {
            console.log(json);
         })
         .catch(error => console.error("Error:", error));
   };
}

export default Profile;
