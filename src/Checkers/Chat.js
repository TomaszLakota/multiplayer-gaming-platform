import React, { Component } from "react";

export default class Chat extends Component {
   state = {
      messages: []
   };
   ws;

   componentDidMount() {
      this.ws = this.props.ws;
      console.log(this.props);
      if (this.props.ws.readyState === WebSocket.OPEN) {
         this.initSocket();
      } else {
         this.props.ws.onopen = event => {
            this.initSocket();
         };
      }
   }

   initSocket() {
      this.ws.onmessage = event => {
         console.log("chat new ws message");
         this.setState({
            messages: this.state.messages.push({
               username: event.data.username,
               message: event.data.message
            })
         });
      };
   }

   render() {
      return (
         <div className="GUI_chat row">
            <div className="col">
               <div>
                  <h5>Chat</h5>
               </div>
               <div className="GUI_chat_text">
                  {this.state.messages.map(item => (
                     <p key={item}>
                        <span>{item.username + ": "}</span>
                        {item.message}
                     </p>
                  ))}
               </div>
               <div>
                  <input />
                  <button>Wyślij</button>
               </div>
            </div>
         </div>
      );
   }
}
