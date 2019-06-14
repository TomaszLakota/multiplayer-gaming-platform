import React from "react";

export default function WithWebSocket(WrappedComponent) {
   class WithWebSocket extends React.Component {
      state = {
         gameId: null,
         userId: null,
         send: this.send
      };

      send(message, typeString) {
         console.log("WITHWEBSOCKET: called send():");
         // console.log(message);
         // console.log(typeString);
         // console.log("WITHWEBSOCKET: this.state, this.props");
         // console.log(this.state);
         // console.log(this.props);
         if (this.state.ws === undefined && this.props.ws === undefined) {
            console.log("WITHWEBSOCKET: this.state.ws === undefined && this.props.ws === undefined");
            return 0;
         }
         if (this.state.ws === undefined) {
            var state = { ws: this.props.ws, gameId: this.props.gameId, userId: this.props.userId };
         }
         if (this.props.ws === undefined) {
            state = { ws: this.state.ws, gameId: this.state.gameId, userId: this.state.userId };
         }

         if (state.ws.readyState !== WebSocket.OPEN) {
            console.log("WITHWEBSOCKET: send() ws not ready");
            return 0;
         }
         var json = JSON.stringify({
            gameId: state.gameId,
            userId: state.userId,
            message: message,
            type: typeString,
            start: true
         });

         console.log("WITHWEBSOCKET: calling ws.send(): with json = ");
         console.log(json);
         state.ws.send(json);
      }

      render() {
         return <WrappedComponent {...this.state} {...this.props} />;
      }
   }

   WithWebSocket.displayName = `WithWebSocket(${getDisplayName(WrappedComponent)})`;
   return WithWebSocket;
}

function getDisplayName(WrappedComponent) {
   return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
