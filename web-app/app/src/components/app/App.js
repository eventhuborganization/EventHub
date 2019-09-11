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
import NavigationBar from '../navigation_bar/NavigationBar'
import EventsPartecipated from '../event/EventsParticipated'
import Badges from '../badges/Badges'
import NoMatch from '../no_match/NoMatch'
import {DesktopSearchBar} from "../search_bar/SearchBar";

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
            reviewModalRef: undefined,
            headerRef: undefined
        }
        ApiService.setNotAuthenticatedBehaviour(() => this.saveToStateAndLocalStorage({isLogged: false, user: {}}))
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
            user: this.state.user
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

    setSearchBar = (type, data, hideCreateEvent) => {
        this.setState({
            searchBarType: type,
            searchBarData: data,
            hideCreateEvent: hideCreateEvent
        })
    }

  render() {
    let commonProps = {
        onError: this.onError,
        isLogged: this.state.isLogged,
        onSuccess: this.onSuccess,
        showMessage: this.showModal,
        setSearchBar: this.setSearchBar,
        unsetSearchBar: () => this.setSearchBar(undefined, undefined),
        headerRef: this.state.headerRef
    }
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
            <DesktopSearchBar
                {...commonProps}
                user={this.state.user}
                data={this.state.searchBarData}
                searchBarType={this.state.searchBarType}
                onLogout={this.logout}
                hideCreateEvent={this.state.hideCreateEvent}
                onRef={ref => this.setState({headerRef: ref})}
            />
          <Switch>
            <Route path={routes.home} exact render={(props) => 
                <Home {...props}
                  {...commonProps}
                  user={this.state.user}
                  showReviewModal={this.showReviewModal}
                />} 
            />
            <Route path={routes.menu} exact render={(props) => 
                <Menu {...props}
                  isLogged={this.state.isLogged}
                  onLogout={this.logout}
                  user={this.state.user}
                />
            } />
            <Route path={routes.newEvent} exact render={(props) =>
                <EventEditor {...props}
                             {...commonProps}
                             loggedUser={this.state.user}
                             onUpdate={false}
                />}
            />
            <Route path={routes.updateEvent} exact render={(props) => 
                <EventEditor {...props}
                             {...commonProps}
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
                   user={this.state.user}
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
                             {...commonProps}
                             user={this.state.user}
                             showReviewModal={this.showReviewModal}
                             manageLinkedUser={this.manageLinkedUser}
                />} 
            />
            <Route path={routes.myFriends} exact render={(props) =>
                <Friends {...props}
                         {...commonProps}
                         loggedUser={this.state.user}
                         updateUser={this.updateUserChanges}
                />}
              />
            <Route path={routes.map} exact render={(props) =>
                <Map {...props}
                     {...commonProps}
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
                          {...commonProps}
                          user={this.state.user}
                  />}
              />
              <Route path={routes.myGroups} exact render={(props) =>
                  <Groups {...props}
                          {...commonProps}
                          user={this.state.user}
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
                          {...commonProps}
                          user={this.state.user}
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
                                {...commonProps}
                                isLocalUser={true}
                                organizator={this.state.user}
                                showReviewModal={this.showReviewModal}
                  />}
              />
            <Route path={routes.subscribedEvents} exact render={(props) =>
                  <EventsPartecipated {...props}
                                isLogged={this.state.isLogged}
                                user={this.state.user}
                                onError={this.onError}
                                onSuccess={this.onSuccess}
                                showMessage={this.showModal}
                                showReviewModal={this.showReviewModal}
                  />}
              />
              <Route path={routes.myProgresses} exact render={(props) =>
                  <Badges {...props}
                                isLogged={this.state.isLogged}
                                user={this.state.user}
                                onError={this.onError}
                  />}
              />
              <Route component={NoMatch} />
          </Switch>
          <NavigationBar user={this.state.user} isLogged={this.state.isLogged} />
        </Router>
    )
  }
}

export default App;
