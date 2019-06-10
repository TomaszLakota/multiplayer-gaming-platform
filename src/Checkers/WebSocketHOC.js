import React from "react";

export default function WithWebSocket(WrappedComponent) {
   return class extends React.Component {
      constructor(props) {
         super(props);
         console.log("WithWebSocker constructor");
      }
      ws;
      state = {
         gameId: null,
         userId: null,
         send: this.send
      };

      componentDidMount() {
         console.log("@@@@@@@@@@@@@@@@@@@@@@ componentDidMount( @@@@@@@@@@@@@@");
         this.ws = this.props.ws;
         console.log(this.props);
         if (this.props.ws === undefined) {
            return 0;
         }
         if (this.props.ws.readyState === WebSocket.OPEN) {
            this.initSocket();
         } else {
            this.props.ws.onopen = event => {
               this.initSocket();
            };
         }
         console.log("@@@@@@@@@@@@@@@@@@@@@@ componentDidMount EEEEEEEEEEEE( @@@@@@@@@@@@@@");
      }

      initSocket() {
         console.log("@@@@@@@@@@@@@@@@@@@@@@ INIT SCOKET @@@@@@@@@@@@@@");
      }

      send(message, typeString) {
         if (this.ws.readyState !== WebSocket.OPEN) {
            console.log("ws not ready");
            return 0;
         }
         var json = JSON.stringify({
            gameId: this.state.gameId,
            userId: this.state.userId,
            message: message,
            type: typeString
         });
         console.log("hoc this.state");
         console.log(this.state);
         console.log("HOC ws.send(): " + json);
         this.ws.send(json);
      }

      render() {
         return <WrappedComponent {...this.state} {...this.props} />;
      }
   };
}
