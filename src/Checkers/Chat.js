import React, { Component } from "react";
import WithWebSocket from "./WebSocketHOC";

class Chat extends Component {
   constructor(props) {
      super(props);

      this.send = this.props.send.bind(this);
   }
   state = {
      messages: [],
      message: ""
   };
   ws;

   componentDidMount() {
      this.ws = this.props.ws;
   }

   initSocket() {
      this.ws.onmessage = event => {
         console.log("CHAT: onmessage triggered");

         if (event.data.type === "chat-message") {
            this.setState({
               messages: this.state.messages.push({
                  username: event.data.username,
                  message: event.data.message
               })
            });
         }
      };
   }

   handleSend = () => {
      let message = {
         username: this.props.username, //TODO: make sure its using real data
         message: this.state.message
      };
      this.send(JSON.stringify(message), "message");
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
   };
}

export default WithWebSocket(Chat);
