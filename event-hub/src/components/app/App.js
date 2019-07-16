import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import Home from "../home/Home";
import Login from "../login/Login";
import EventInfo from "../event_info/EventInfo";
import Notifications from "../notifications/Notifications";

/*

<Route path="/profile" component={Profile} />
<Route path="/notifications" component={Notification} />
<Route path="/friends" component={Friends} />
<Route path="/map" component={EventsMap} />

*/

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogged: false,
      showNavbar: true
    }
  }

  onError = (message) => {
    console.log(message)
  }

  onLoginSuccessfull = (userId) => {
    this.setState({
      isLogged: true, 
      userId: userId
    });
  }

  render() {
    return (
        <Router>
            <Route path="/" exact render={(props) => 
                <Home {...props} 
                  isLogged={this.state.isLogged} 
                  mainServer={this.props.mainServer} 
                  onError={this.onError} 
                />} 
            />
            <Route path="/event/:id" exact render={(props) => 
                <EventInfo {...props} 
                  isLogged={this.state.isLogged} 
                  mainServer={this.props.mainServer} 
                  onError={this.onError} 
                />} 
            />
            <Route path="/login" exact render={(props) => 
                <Login {...props} 
                  mainServer={this.props.mainServer} 
                  onError={this.onError} 
                  onLoginSuccessfull={this.onLoginSuccessfull} 
                />} 
            />

            <Route path="/notification" exact render={(props) =>
                <Notifications {...props}
                               mainServer={this.props.mainServer}
                               imageFolderPath={this.props.imageFolderPath}
                               onError={this.onError}
                />}
            />

            <footer className={(this.state.showNavbar ? "" : "d-none ") + "row fixed-bottom bg-light border-top border-primary mx-0 py-2"}>
                <div className="col text-center my-auto"><Link to="/map"><em className="fas fa-map-marked-alt fa-lg" /></Link></div>
                <div className="col text-center my-auto"><Link to={this.state.isLogged ? "/profile" : "/login"}><em className="fas fa-user fa-lg" /></Link></div>
                <div className="col text-center my-auto"><Link to="/"><em className="fas fa-home fa-2x bg-primary text-white rounded-circle p-2" /></Link></div>
                <div className="col text-center my-auto"><Link to="/friends"><em className="fas fa-users fa-lg" /></Link></div>
                <div className="col text-center my-auto"><Link to="/notification"><em className="fas fa-bell fa-lg" /></Link></div>
            </footer>
        </Router>
    )
  }
}

export default App;
