import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import './App.css'
import Home from '../home/Home'
import Login from '../login/Login'
import EventInfo from '../event_info/EventInfo'
import Registration from '../registration/Registration'
import Notifications from '../notifications/Notifications'
import EventCreator from '../event_creator/EventCreator'
import UserProfile from '../profile/UserProfile'
import { CallableComponent } from '../redirect/Redirect';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogged: false,
      showNavbar: true
    }
  }

  errorElement = (elem) => {
    this.setState({errorElement: elem})
  }

  onError = (message) => {
    this.state.errorElement.showModal(message)
  }

  onLoginSuccessfull = (userId) => {
    this.setState({
      isLogged: true, 
      userId: userId
    })
  }

  render() {
    return (
        <Router>
            <ErrorModal
              onRef={this.errorElement}
              title="Errore"
              closeLabel="Chiudi"
            /> 
            <Switch>
              <Route path="/" exact render={(props) => 
                  <Home {...props} 
                    isLogged={this.state.isLogged} 
                    mainServer={this.props.mainServer} 
                    onError={this.onError} 
                  />} 
              />
              <Route path="/event/new" exact render={(props) =>
                  <EventCreator {...props}
                                isLogged={this.state.isLogged}
                                mainServer={this.props.mainServer}
                                onError={this.onError}
                                loggedUser={{
                                    name: "Stefano",
                                    surname: "Righini",
                                    email: "rigo96.imola@gmail.com",
                                    phoneNumber: "+39 3472284853",
                                    avatar: "user-profile-image.jpg"
                                }}
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
              <Route path="/register" exact render={(props) => 
                  <Registration {...props} 
                    mainServer={this.props.mainServer} 
                    onError={this.onError} 
                    onRegistration={this.onLoginSuccessfull} 
                  />} 
              />
              <Route path="/notification" exact render={(props) =>
                  <Notifications {...props}
                      mainServer={this.props.mainServer}
                      isLogged={this.state.isLogged}
                      onError={this.onError}
                  />}
              />
              <Route path="/profile" exact render={(props) =>
                  <UserProfile {...props}
                      mainServer={this.props.mainServer}
                      userId={this.state.userId}
                      onError={this.onError}
                      isLocalUser={true}
                  />}
              />
              <Route path="/users/:id" exact render={(props) => 
                  <UserProfile {...props}
                      mainServer={this.props.mainServer}
                      userId={this.state.userId}
                      onError={this.onError}
                      isLocalUser={false}
                  />} 
              />
            </Switch>

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

class ErrorModal extends CallableComponent {

  constructor(props){
    super(props)
    this.state = { body: undefined }
  }

  showModal = (message) => {
    this.setState({body: message})
    document.getElementById("triggerButton").click()
  }

  render = () => {
    return (
      <div>
        <button type="button" id="triggerButton" hidden={true} data-toggle="modal" data-target="#errorLog">Launch modal</button>
        <div className="modal fade" id="errorLog" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalCenterTitle">{this.props.title}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.state.body}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-dismiss="modal">{this.props.closeLabel}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
