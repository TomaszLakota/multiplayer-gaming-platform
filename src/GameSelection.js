import React, { Component } from "react";

class GameSelection extends Component {
   state = {};
   render() {
      return (
         <div style={{ padding: 10 }}>
            <h2>Wybór gry</h2>
            <ul style={{ listStyleType: "none" }}>
               <li className="h4">
                  <a href="/checkers">Warcaby</a>
               </li>
               <li className="text-muted h4">Szachy</li>
               <li className="text-muted h4">Kości</li>
               <li className="text-muted h4">Karty</li>
            </ul>
         </div>
      );
   }
}

export default GameSelection;
