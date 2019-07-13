import React from 'react';
import logo from '../../assets/images/logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function About() {
  return <h2>About</h2>;
}

class Users extends React.Component {
  state = {
    name: "pippo"
  }

  change = () =>{
    this.setState({name: "paolo"})
  }

  inputChanged = (event) => {
    this.setState({name: event.target.value})
  }

  render() {
    return <div>
      <h2>{this.state.name}</h2>
      <button onClick={this.change}>CHANGE</button>
      <input type="text" onChange={this.inputChanged} value={this.state.name}/>
    </div>
  }
}*/

class AppRouter extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogged: false,
      showNavbar: true
    }
  }

  render() {
    return (
        <Router>
            <Route path="/" exact component={EventCard} />
            <Route path="/profile" component={Profile} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/friends" component={Friends} />
            <Route path="/map" component={EventsMap} />
            <footer className={(this.state.showNavbar ? "" : "d-none ") + "row fixed-bottom bg-light border-top border-primary mx-0 py-2"}>
                <div className="col text-center my-auto"><Link to="/map"><em className="fas fa-map-marked-alt fa-lg" /></Link></div>
                <div className="col text-center my-auto"><Link to="/profile"><em className="fas fa-user fa-lg" /></Link></div>
                <div className="col text-center my-auto"><Link to="/"><em className="fas fa-home fa-2x bg-primary text-white rounded-circle p-2" /></Link></div>
                <div className="col text-center my-auto"><Link to="/friends"><em className="fas fa-users fa-lg" /></Link></div>
                <div className="col text-center my-auto"><Link to="/notifications"><em className="fas fa-bell fa-lg" /></Link></div>
            </footer>
        </Router>
    )
  }
}

export default AppRouter;
