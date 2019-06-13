import React, { Component } from "react";

export class ImageWithCaptionSmall extends Component {
   state = {};
   render() {
      return (
         <div className="imageWithCaptionSmall">
            <div className="img">
               <a href={this.props.link}>
                  <img src={this.props.image} alt="icon" />
               </a>
            </div>
            <a href={this.props.link} className={this.props.link === null ? "text-muted" : ""}>
               <h4>{this.props.caption}</h4>
            </a>
         </div>
      );
   }
}

export class ImageWithCaptionBig extends Component {
   state = {};
   render() {
      return (
         <div className="imageWithCaptionBig">
            <div className="img">
               <a href={this.props.link}>
                  <img src={this.props.image} alt="icon" />
               </a>
            </div>
            <a href={this.props.link}>
               <h4>{this.props.caption}</h4>
            </a>
         </div>
      );
   }
}

export class ImageWithCaptionTall extends Component {
   state = {};
   render() {
      return (
         <div className="imageWithCaptionTall">
            <div className="img">
               <a href={this.props.link}>
                  <img src={this.props.image} alt="icon" />
               </a>
            </div>
            <a href={this.props.link}>
               <h4>{this.props.caption}</h4>
            </a>
         </div>
      );
   }
}
