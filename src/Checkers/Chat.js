import React, { Component } from "react";

export default class Chat extends Component {
   state = {
      messages: [],
      message: ""
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

   handleSend = () => {
      if (this.ws.readyState !== WebSocket.OPEN) {
         console.log("ws not ready");
         return 0;
      }
      var json = JSON.stringify({
         gameId: this.state.gameId,
         userId: this.state.userId,
         message: this.state.message
      });
      console.log("ws.send(): " + json);
      this.ws.send(json);
   };

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
                  <input id="message" onChange={this.handleInput} />
                  <button onClick={this.handleSend}>Wyślij</button>
               </div>
            </div>
         </div>
      );
   }

   handleInput = e => {
      this.setState({
         [e.target.id]: e.target.value
      });
      console.log(this.state);
   };
}
