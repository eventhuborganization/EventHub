import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

import {CallableComponent} from '../redirect/Redirect'
import ScrollToTop from '../scroll_to_top/ScrollToTop'

import './App.css'
import Home from '../home/Home'
import Login from '../login/Login'
import EventInfo from '../event_info/EventInfo'
import Registration from '../registration/Registration'
import Notifications from '../notifications/Notifications'
import EventCreator from '../event_creator/EventCreator'
import { PersonalProfile, UserProfile } from '../profile/ProfileType'
import Friends from '../friends/Friends'
import Map from '../map/Map'
import Settings from '../settings/Settings'
import NotificationService from "../../services/notification/Notification"
import ApiService from "../../services/api/Api"
import LocalStorage from "local-storage"

class App extends React.Component {

    #notificationServiceSubscriptionCode = undefined
    #applicationStateLocalStorageName = "application-state"

  constructor(props) {
      super(props)
      let applicationState = LocalStorage(this.#applicationStateLocalStorageName) || undefined
      this.state = {
          isLogged: applicationState && applicationState.isLogged,
          user: applicationState && applicationState.user ? applicationState.user : {},
          showMessageElement: undefined,
          notifications: []
      }
      ApiService.setNotAuthenticatedBehaviour(this.onNotAuthenticated)
  }

  componentDidMount() {
      let applicationState = LocalStorage(this.#applicationStateLocalStorageName) || undefined
      if (applicationState)
          this.setState({
              isLogged: applicationState.isLogged,
              user: applicationState.user
          })
  }

    componentWillUnmount() {
        this.removeSubscriptions()
    }

    saveUserDataToLocalStorage = () => {
        LocalStorage(this.#applicationStateLocalStorageName,{
            isLogged: this.state.isLogged,
            user: this.state.user
        })
    }

    showMessageElement = (elem) => {
      this.setState((prevState, props) => {
          let state = prevState
          state.showMessageElement = elem
          return state
      })
  }

  onError = (message) => {
    this.state.showMessageElement.showModal({body: message, title: "Errore"})
  }

  onSuccess = (message) => {
    this.state.showMessageElement.showModal({body: message, title: "Operazione completata!"})
  }

  onLoginSuccessfull = (user_data) => {
    this.setState((prevState) =>{
        let state = prevState
        state.isLogged = true
        state.user = user_data
        state.user.linkedUsers = state.user.linkedUsers.map(id => {return {_id: id, name: ""}})
        return state
      }, () => {
        this.#notificationServiceSubscriptionCode = NotificationService.addSubscription(this.onNotificationLoaded)
        this.saveUserDataToLocalStorage()
    })
  }

  logout = () => {
        ApiService.logout(
            () => {},
            () => {
                this.removeSubscriptions()
                this.setState({
                    user: {},
                    isLogged: false
                }, () => this.saveUserDataToLocalStorage())
            }
        )
  }
  
  updateUserInfo = (user) => {
      this.setState((prevState) => {
          let state = prevState
          state.user = user
          return state
      }, () => this.saveUserDataToLocalStorage())
  }

  manageLinkedUser = (user, add) => {
    this.setState((prevState) =>{
      let state = prevState
      if (add) {
        state.user.linkedUsers.push(user)
      } else {
        state.user.linkedUsers = state.user.linkedUsers.filter(u => u._id !== user._id)
      }
      return state
    }, () => this.saveUserDataToLocalStorage())
  }

  onNotificationLoaded = (notifications) => {
        this.setState({notifications: notifications})
  }

  removeSubscriptions = () => {
      NotificationService.removeSubscription(this.#notificationServiceSubscriptionCode)
      this.#notificationServiceSubscriptionCode = undefined
  }

    onNotAuthenticated = () => {
        this.removeSubscriptions()
        this.setState({isLogged: false}, () => this.saveUserDataToLocalStorage())
    }

  render() {
    return (
        <Router>
          <ScrollToTop />
          <Modal
            onRef={this.showMessageElement}
            closeLabel="Chiudi"
          /> 
          <Switch>
            <Route path="/" exact render={(props) => 
                <Home {...props}
                  user={{
                      _id: this.state.user._id
                  }}
                  isLogged={this.state.isLogged} 
                  onError={this.onError}
                  onSuccess={this.onSuccess} 
                />} 
            />
            <Route path="/event/new" exact render={(props) =>
                <EventCreator {...props}
                    isLogged={this.state.isLogged}
                    onError={this.onError}
                    loggedUser={this.state.user}
                />}
            />
            <Route path="/event/:id/update" exact render={(props) => 
                <EventCreator {...props}
                    isLogged={this.state.isLogged}
                    onError={this.onError}
                    loggedUser={this.state.user}
                />} 
            />
            <Route path="/event/:id" exact render={(props) => 
                <EventInfo {...props} 
                   isLogged={this.state.isLogged}
                   onError={this.onError}
                   user={{
                       _id: this.state.user._id
                   }}
                />} 
            />
            <Route path="/login" exact render={(props) => 
                <Login {...props}
                  onError={this.onError} 
                  onLoginSuccessfull={this.onLoginSuccessfull} 
                />} 
            />
            <Route path="/register" exact render={(props) => 
                <Registration {...props} 
                  onError={this.onError}
                  onLoginSuccessfull={this.onLoginSuccessfull}
                />} 
            />
            <Route path="/notification" exact render={(props) =>
                <Notifications {...props}
                    isLogged={this.state.isLogged}
                    onError={this.onError}
                    onFriendAdded={(elem) => this.manageLinkedUser(elem, true)}
                    user={{
                        _id: this.state.user._id
                    }}
                />}
            />
            <Route path="/profile" exact render={(props) =>
                <PersonalProfile {...props}
                    isLogged={this.state.isLogged}
                    userId={this.state.user._id}
                    onError={this.onError}
                />}
            />
            <Route path="/users/:id" render={(props) => 
                <UserProfile {...props}
                    isLogged={this.state.isLogged}
                    user={{
                      _id: this.state.user._id,
                      linkedUsers: this.state.user.linkedUsers ? this.state.user.linkedUsers : [],
                      organization: this.state.user.organization
                    }}
                    onError={this.onError}
                    onSuccess={this.onSuccess}
                    manageLinkedUser={this.manageLinkedUser}
                />} 
            />
            <Route path="/friends" exact render={(props) =>
                <Friends {...props}
                    isLogged={this.state.isLogged}
                    loggedUser={this.state.user}  
                    onError={this.onError}
                />}
              />
            <Route path="/map" exact render={(props) =>
                <Map {...props}
                    onError={this.onError}
                />}
              />
            <Route path="/settings" exact render={(props) =>
                <Settings {...props}
                    isLogged={this.state.isLogged}
                    user={this.state.user}
                    onChangeUserInfo={this.updateUserInfo}
                    onError={this.onError}
                    onSuccess={this.onSuccess}
                    logout={this.logout}
                />}
              />
          </Switch>
          <footer id="footer" className="row fixed-bottom bg-light border-top border-primary mx-0 py-2">
              <div className="col text-center my-auto"><Link to="/map"><em className="fas fa-map-marked-alt fa-lg" /></Link></div>
              <div className="col text-center my-auto"><Link to={"/profile"}><em className="fas fa-user fa-lg" /></Link></div>
              <div className="col text-center my-auto"><Link to="/"><em className="fas fa-home fa-2x bg-primary text-white rounded-circle p-2" /></Link></div>
              <div className="col text-center my-auto"><Link to="/friends"><em className="fas fa-users fa-lg" /></Link></div>
              <div className="col text-center my-auto"><Link to="/notification"><em className="fas fa-bell fa-lg" /></Link></div>
          </footer>
        </Router>
    )
  }
}

class Modal extends CallableComponent {

  constructor(props){
    super(props)
    this.state = { body: undefined, title: undefined }
  }

  showModal = (data) => {
      this.setState((prevState, props) => {
          let state = prevState
          state.body = data.body
          state.title = data.title
          return state
      })
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
                <h5 className="modal-title" id="exampleModalCenterTitle">{this.state.title}</h5>
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
