import React, { Component } from "react";
import Navbar from "./Navbar";
import Profile from "./Profile";
import { Redirect } from "react-router-dom";
import Authorized from "./AuthHOC";

class ProfilePage extends Component {
   constructor(props) {
      super(props);
      this.state = {};
   }

   componentDidMount() {}

   componentDidUpdate() {
      // console.log("PROFILE PAGE DID UPDATE");
      // console.log(this.props);
   }

   render() {
      // console.log("PROFILE PAGE " + this.props.loggedIn);
      if (!this.props.loggedIn && this.props.loaded) {
         return <Redirect to="/login" push />;
      }
      return (
         <React.Fragment>
            <Navbar />
            <div className="row justify-content-center">
               <div className="col-12">
                  <Profile {...this.state} {...this.props} />
               </div>
            </div>
         </React.Fragment>
      );
   }
}

export default Authorized(ProfilePage);
