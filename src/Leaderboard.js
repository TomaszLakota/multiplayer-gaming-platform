import React, { Component } from "react";

class Leaderboard extends Component {
   state = {
      loading: true
   };

   render() {
      return (
         <div className="row tableContainer">
            <Table data={this.props.data} />
         </div>
      );
   }
}

class Table extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         data: [],
         sortDirection: true
      };
      this.componentDidMount = this.componentDidMount.bind(this);
      this.handleSort = this.handleSort.bind(this);
   }

   componentDidMount() {
      this.handleSort("ranking");
   }

   handleSort() {
      var attribute = "ranking";
      if (this.state.sortDirection) {
         this.setState({
            data: this.state.data.sort((a, b) => (parseInt(a[attribute], 10) > parseInt(b[attribute], 10) ? -1 : 1)),
            sortDirection: false
         });
      } else {
         this.setState({
            data: this.state.data.sort((a, b) => (parseInt(a[attribute], 10) < parseInt(b[attribute], 10) ? -1 : 1)),
            sortDirection: true
         });
      }
   }

   render() {
      console.log("table in leaderboard");
      console.log(this.props.data);
      const rows = this.props.data.map((row, index) => <Tablerow key={row.username + index} position={index + 1} username={row.username} ranking={row.points} />);

      return (
         <React.Fragment>
            <div className="col-6">
               <h1>Najlepsi gracze</h1>
            </div>
            <div className="col-12">
               <table>
                  <thead>
                     <tr>
                        <th>Miejsce</th>
                        <th>Użytkownik</th>
                        <th onClick={this.handleSort}>Ranking</th>
                     </tr>
                  </thead>
                  <tbody>{rows}</tbody>
               </table>
            </div>
         </React.Fragment>
      );
   }
}

class Tablerow extends React.Component {
   render() {
      return (
         <tr className={this.props.className}>
            <td>{this.props.position}</td>
            <td>{this.props.username}</td>
            <td>{this.props.ranking}</td>
         </tr>
      );
   }
}

export default Leaderboard;
