import React from "react";

export default function WithWebSocket(WrappedComponent) {
   class WithWebSocket extends React.Component {
      state = {
         gameId: null,
         userId: null,
         send: this.send
      };

      send(message, typeString) {
         console.log("WITHWEBSOCKET: called send() with arguments:");
         console.log(message);
         console.log(typeString);
         if (this.props.ws.readyState !== WebSocket.OPEN) {
            console.log("WITHWEBSOCKET: send() ws not ready");
            return 0;
         }
         var json = JSON.stringify({
            gameId: this.state.gameId,
            userId: this.state.userId,
            message: message,
            type: typeString
         });
         console.log("WITHWEBSOCKET: this.state, this.props.ws");
         console.log(this.state);
         console.log(this.props.ws);
         console.log("WITHWEBSOCKET: calling ws.send(): with json = ");
         console.log(json);
         this.props.ws.send(json);
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
