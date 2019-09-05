import React from 'react'
import LocalStorage from "local-storage"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import './App.css'
import ApiService from "../../services/api/Api"

import ScrollToTop from '../scroll_to_top/ScrollToTop'

import Home from '../home/Home'
import Login from '../login/Login'
import Menu from '../menu/Menu'
import EventInfo from '../event_info/EventInfo'
import Registration from '../registration/Registration'
import Notifications from '../notifications/Notifications'
import EventEditor from '../event_editor/EventEditor'
import { PersonalProfile, UserProfile } from '../profile/ProfileType'
import Friends from '../friends/Friends'
import Map from '../map/Map'
import Settings from '../settings/Settings'
import Invite from "../invite/Invite"
import Groups from '../groups/Groups'
import GroupCreator from '../group_creator/GroupCreator'
import Reviews from "../reviews/Reviews"
import { GroupInfo, GroupAdder } from '../group_info/GroupInfo'
import { ReviewModal, Modal } from '../modals/Modals'
import EventsByOrganizator from '../event/EventsByOrganizator'
import NavigationBar from '../navigation_bar/NavigationBar';

let routes = require("../../services/routes/Routes")

class App extends React.Component {

    #applicationStateLocalStorageName = "application-state"

    constructor(props) {
        super(props)
        let applicationState = LocalStorage(this.#applicationStateLocalStorageName) || undefined
        this.state = {
            isLogged: applicationState && applicationState.isLogged,
            user: applicationState && applicationState.user ? applicationState.user : {},
            events: applicationState && applicationState.events ? applicationState.events : [],
            showMessageElement: undefined,
            nextErrorToShow: undefined,
            reviewModalRef: undefined
        }
        //ApiService.setNotAuthenticatedBehaviour(this.saveToStateAndLocalStorage({isLogged: false}))
    }

  componentDidMount() {
      let applicationState = LocalStorage(this.#applicationStateLocalStorageName) || undefined
      if (applicationState)
          this.setState({
              isLogged: applicationState.isLogged,
              user: applicationState.user
          })
  }

    saveToStateAndLocalStorage = (newState) => {
        this.setState(newState, () => this.saveUserDataToLocalStorage())
    }

    saveUserDataToLocalStorage = () => {
        LocalStorage(this.#applicationStateLocalStorageName,{
            isLogged: this.state.isLogged,
            user: this.state.user,
            events: this.state.events
        })
    }

    showMessageElement = (elem) => {
      this.setState((prevState) => {
          let state = prevState
          state.showMessageElement = elem
          return state
      }, () => {
          let error = this.state.nextErrorToShow ? {...this.state.nextErrorToShow} : undefined
          this.setState({nextErrorToShow: undefined}, () => {
              if (error)
                  this.showModal(error.configurations, error.onConfirmFunction, error.onDiscardFunction, error.onExitFunction)
          })
      })
  }

  onReviewModalRef = ref => {
        this.setState({reviewModalRef: ref})
  }

  showReviewModal = (event, onSent) => {
        if (this.state.reviewModalRef)
            this.state.reviewModalRef.showModal({event: event, onSent: onSent})
  }

  onError = (message, onErrorFunction, onExitFunction) => {
      let configurations = {
          message: message,
          title: "Errore"
      }
      this.showModal(configurations, onErrorFunction, () => {}, onExitFunction)
  }

  onSuccess = (message) => {
        this.showModal({message: message, title: "Operazione completata!"})
  }

  showModal = (configurations, onConfirmFunction, onDiscardFunction, onExitFunction) => {
        if (this.state.showMessageElement)
            this.state.showMessageElement.showModal({
                body: configurations.message,
                title: configurations.title,
                confirmMessage: configurations.confirmMessage,
                discardMessage: configurations.discardMessage,
                okFun: onConfirmFunction,
                cancelFun: onDiscardFunction,
                exitFun: onExitFunction
            })
        else
            this.setState({
                nextErrorToShow: {
                    configurations: configurations,
                    onConfirmFunction: onConfirmFunction,
                    onDiscardFunction: onDiscardFunction,
                    onExitFunction: onExitFunction
                }
            })
  }

  onLoginSuccessfull = (user_data) => {
    this.setState((prevState) =>{
        let state = prevState
        state.isLogged = true
        state.user = user_data
        state.user.linkedUsers = state.user.linkedUsers.map(id => {return {_id: id, name: ""}})
        return state
      }, () => {
        ApiService.getUsersInformation(
          this.state.user.linkedUsers,
          () => {},
          users => this.saveToStateAndLocalStorage(prevState => {
            prevState.user.linkedUsers = users
            return prevState
          })
        )
        ApiService.getGroups(
            () => {},
            groups => this.saveToStateAndLocalStorage(prevState => {
              groups.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
              prevState.user.groups = groups
              return prevState
            })
          )
        this.saveUserDataToLocalStorage()
    })
  }

  logout = () => {
        ApiService.logout(
            () => {},
            () => {
                this.saveToStateAndLocalStorage({
                    user: {},
                    isLogged: false
                })
            }
        )
  }
  
  updateUserInfo = (user) => {
    this.saveToStateAndLocalStorage((prevState) => {
          let state = prevState
          state.user = user
          return state
    })
  }

  manageLinkedUser = (user, add) => {
    this.saveToStateAndLocalStorage((prevState) =>{
      let state = prevState
      if (add) {
        state.user.linkedUsers.push(user)
      } else {
        state.user.linkedUsers = state.user.linkedUsers.filter(u => u._id !== user._id)
      }
      return state
    })
  }

    updateUserChanges = (changes) => {
        this.saveToStateAndLocalStorage(prevState => {
            changes.forEach(change => {
                prevState.user[change[1]] = change[0]
            })
            return prevState
        })
    }

    updateEvents = (events) => {
        let moddedEvents = events.map(event => {
            delete event.creationDate
            event.followers = []
            event.participants = []
            delete event.reviews
            return event
        })
        this.saveToStateAndLocalStorage({events: moddedEvents})
    }

  render() {
    return (
        <Router>
          <ScrollToTop />
          <Modal
            onRef={this.showMessageElement}
            closeLabel="Chiudi"
          />
          <ReviewModal
              onRef={this.onReviewModalRef}
              user={this.state.user}
          />
          <Switch>
            <Route path={routes.home} exact render={(props) => 
                <Home {...props}
                  user={{
                      _id: this.state.user._id
                  }}
                  events={this.state.events}
                  isLogged={this.state.isLogged} 
                  onError={this.onError}
                  onSuccess={this.onSuccess}
                  showMessage={this.showModal}
                  showReviewModal={this.showReviewModal}
                  updateEvents={this.updateEvents}
                />} 
            />
            <Route path={routes.menu} exact render={(props) => 
                <Menu {...props}
                  isLogged={this.state.isLogged}
                  onLogout={this.logout}
                />
            } />
            <Route path={routes.newEvent} exact render={(props) =>
                <EventEditor {...props}
                             isLogged={this.state.isLogged}
                             onError={this.onError}
                             loggedUser={this.state.user}
                             onUpdate={false}
                />}
            />
            <Route path={routes.updateEvent} exact render={(props) => 
                <EventEditor {...props}
                             isLogged={this.state.isLogged}
                             onError={this.onError}
                             showMessage={this.showModal} 
                             loggedUser={this.state.user}
                             onUpdate={true}
                />} 
            />
            <Route path={routes.event} exact render={(props) => 
                <EventInfo {...props} 
                   isLogged={this.state.isLogged}
                   onError={this.onError}
                   showMessage={this.showModal}
                   showReviewModal={this.showReviewModal}
                   user={{
                       _id: this.state.user._id
                   }}
                />} 
            />
            <Route path={routes.login} exact render={(props) => 
                <Login {...props}
                  onError={this.onError} 
                  onLoginSuccessfull={this.onLoginSuccessfull} 
                />} 
            />
            <Route path={routes.registration} exact render={(props) => 
                <Registration {...props} 
                  onError={this.onError}
                  onLoginSuccessfull={this.onLoginSuccessfull}
                />} 
            />
            <Route path={routes.myNotifications} exact render={(props) =>
                <Notifications {...props}
                    isLogged={this.state.isLogged}
                    onError={this.onError}
                    onFriendAdded={(elem) => this.manageLinkedUser(elem, true)}
                    user={{
                        _id: this.state.user._id
                    }}
                    showReviewModal={this.showReviewModal}
                />}
            />
            <Route path={routes.myProfile} exact render={(props) =>
                <PersonalProfile {...props}
                    isLogged={this.state.isLogged}
                    user={this.state.user}
                    onError={this.onError}
                    showReviewModal={this.showReviewModal}
                    updateUser={this.updateUserInfo}
                />}
            />
            <Route path={routes.user} render={(props) => 
                <UserProfile {...props}
                    isLogged={this.state.isLogged}
                    user={this.state.user}
                    onError={this.onError}
                    onSuccess={this.onSuccess}
                    showReviewModal={this.showReviewModal}
                    manageLinkedUser={this.manageLinkedUser}
                />} 
            />
            <Route path={routes.myFriends} exact render={(props) =>
                <Friends {...props}
                    isLogged={this.state.isLogged}
                    loggedUser={this.state.user}  
                    onError={this.onError}
                    updateUser={this.updateUserChanges}
                />}
              />
            <Route path={routes.map} exact render={(props) =>
                <Map {...props}
                    onError={this.onError}
                />}
              />
            <Route path={routes.settings} exact render={(props) =>
                <Settings {...props}
                    isLogged={this.state.isLogged}
                    user={this.state.user}
                    onChangeUserInfo={this.updateUserInfo}
                    onError={this.onError}
                    onSuccess={this.onSuccess}
                />}
              />
              <Route path={routes.inviteEvent} exact render={(props) =>
                  <Invite {...props}
                          isLogged={this.state.isLogged}
                          user={this.state.user}
                          onError={this.onError}
                  />}
              />
              <Route path={routes.myGroups} exact render={(props) =>
                  <Groups {...props}
                          isLogged={this.state.isLogged}
                          user={this.state.user}
                          onError={this.onError}
                  />}
              />
              <Route path={routes.newGroup} exact render={(props) =>
                  <GroupCreator {...props}
                          isLogged={this.state.isLogged}
                          user={this.state.user}
                          onError={this.onError}
                          updateUserInfo={this.updateUserChanges}
                  />}
              />
              <Route path={routes.group} exact render={(props) =>
                  <GroupInfo {...props}
                          isLogged={this.state.isLogged}
                          user={this.state.user}
                          onError={this.onError}
                          updateUserInfo={this.updateUserChanges}
                  />}
              />
              <Route path={routes.inviteGroup} exact render={(props) =>
                  <GroupAdder {...props}
                          isLogged={this.state.isLogged}
                          user={this.state.user}
                          onError={this.onError}
                          updateUserInfo={this.updateUserChanges}
                  />}
              />
              <Route path={routes.reviews} exact render={(props) =>
                  <Reviews {...props}
                                isLogged={this.state.isLogged}
                                user={this.state.user}
                                onError={this.onError}
                  />}
              />
              <Route path={routes.myEvents} exact render={(props) =>
                  <EventsByOrganizator {...props}
                                isLogged={this.state.isLogged}
                                isLocalUser={true}
                                organizator={this.state.user}
                                onError={this.onError}
                                onSuccess={this.onSuccess}
                                showMessage={this.showModal}
                                showReviewModal={this.showReviewModal}
                  />}
              />
          </Switch>
          <NavigationBar isLogged={this.state.isLogged} />
        </Router>
    )
  }
}

export default App;
