import React, { Component } from "react";
import checkers from "./images/checkers.png";
import cards from "./images/cards.png";
import dice from "./images/dice.png";
import chess from "./images/chess.png";
import { ImageWithCaptionSmall } from "./ImageWithCaption";

class GameSelection extends Component {
   state = {};
   render() {
      return (
         <React.Fragment>
            {/* <h2>Wybór gry</h2> */}
            <div className="row">
               <ImageWithCaptionSmall image={checkers} caption={"Warcaby"} link={"/checkers"} />
               <ImageWithCaptionSmall image={cards} caption={"Brydż"} link={null} />
            </div>
            <div className="row">
               <ImageWithCaptionSmall image={dice} caption={"Kości"} link={null} />
               <ImageWithCaptionSmall image={chess} caption={"Szachy"} link={null} />
            </div>
         </React.Fragment>
      );
   }
}

export default GameSelection;
