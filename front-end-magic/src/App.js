import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.png";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
      seconds: 20
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5005/projects")
      .then(response => {
        console.log(response);
        console.log(response.data);
        // what is the data called?
        this.setState({ projects: response.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            style={{
              animation: `App-logo-spin infinite ${this.state.seconds}s linear`
            }}
            src={logo}
            onClick={() => this.setState({ seconds: this.state.seconds / 2 })}
            className="App-logo"
            alt="logo"
          />
          <p>Lol i'm rotating</p>
          {this.state.projects.map((project, index) => (
            <div key={project.id}>
              <h2>{project.name}</h2>
            </div>
          ))}
        </header>
      </div>
    );
  }
}

export default App;
