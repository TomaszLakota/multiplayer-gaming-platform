import React, { Component } from "react";

class Leaderboard extends Component {
  state = {
    loading: true
  };

  render() {
    return (
      <div className="tableContainer">
        <Table />
      </div>
    );
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{ username: "szachista1996", ranking: 1110 }, { username: "lorem ipsum", ranking: 880 }, { username: "jacek", ranking: 1000 }],
      sortDirection: true
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.handleSort("ranking");
  }

  handleSort(attribute) {
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
    const rows = this.state.data.map((row, index) => <Tablerow key={row.username + index} position={index + 1} username={row.username} ranking={row.ranking} />);

    return (
      <table>
        <Tablehead onChange={this.handleSort} />
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class Tablehead extends React.Component {
  render() {
    return (
      <thead>
        <tr>
          <th>Miejsce</th>
          <th>Użytkownik</th>
          <th className="clickable" onClick={this.props.onChange.bind(this, "ranking")}>
            Ranking
          </th>
        </tr>
      </thead>
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
