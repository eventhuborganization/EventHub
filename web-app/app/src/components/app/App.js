import React from 'react'
import LocalStorage from "local-storage"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

import './App.css'
import ApiService from "../../services/api/Api"

import {CallableComponent} from '../redirect/Redirect'
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
import NotificationService from "../../services/notification/Notification"
import Invite from "../invite/Invite"
import Groups from '../groups/Groups'
import {EventHeaderBanner} from "../event/Event"
import GroupCreator from '../group_creator/GroupCreator'

let routes = require("../../services/routes/Routes")

class App extends React.Component {

    #notificationServiceSubscriptionCode = undefined
    #applicationStateLocalStorageName = "application-state"

  constructor(props) {
      super(props)
      let applicationState = LocalStorage(this.#applicationStateLocalStorageName) || undefined
      this.state = {
          isLogged: applicationState && applicationState.isLogged,
          user: applicationState && applicationState.user ? applicationState.user : {},
          notifications: [],
          events: applicationState && applicationState.events ? applicationState.events : [],
          showMessageElement: undefined,
          nextErrorToShow: undefined,
          reviewModalRef: undefined
      }
      ApiService.setNotAuthenticatedBehaviour(this.onNotAuthenticated)
      if(applicationState && this.state.isLogged){
        this.#notificationServiceSubscriptionCode = NotificationService.addSubscription(this.onNotificationLoaded)
      }
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
        this.#notificationServiceSubscriptionCode = NotificationService.addSubscription(this.onNotificationLoaded)
        this.saveUserDataToLocalStorage()
    })
  }

  logout = () => {
        ApiService.logout(
            () => {},
            () => {
                this.removeSubscriptions()
                this.saveToStateAndLocalStorage({
                    user: {},
                    notifications: [],
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

  onNotificationLoaded = (notifications) => {
        this.setState({notifications: notifications})
  }

  removeSubscriptions = () => {
      NotificationService.removeSubscription(this.#notificationServiceSubscriptionCode)
      this.#notificationServiceSubscriptionCode = undefined
  }

    onNotAuthenticated = () => {
        this.removeSubscriptions()
        this.saveToStateAndLocalStorage({isLogged: false})
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
        this.saveToStateAndLocalStorage({events: events})
    }

  renderNotificationBadge = () => {
    return this.state.isLogged && this.state.notifications.length > 0 ? 
      <span className={"badge badge-danger align-top ml-1"}>{this.state.notifications.length}</span> : <div/>
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
            <Route path={routes.menu} exact render={() => 
                <Menu 
                  notifications={this.state.notifications}
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
                    updateUser={this.updateUserInfo}
                />}
            />
            <Route path={routes.user} render={(props) => 
                <UserProfile {...props}
                    isLogged={this.state.isLogged}
                    user={this.state.user}
                    onError={this.onError}
                    onSuccess={this.onSuccess}
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
              <Route path={routes.invite} exact render={(props) =>
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
                  />}
              />
          </Switch>
          <footer id="footer" className="row fixed-bottom bg-light border-top border-primary mx-0 py-2">
              <div className="col text-center my-auto"><Link to={routes.map}><em className="fas fa-map-marked-alt fa-lg" /></Link></div>
              <div className="col text-center my-auto"><Link to={routes.myProfile}><em className="fas fa-user fa-lg" /></Link></div>
              <div className="col text-center my-auto"><Link to={routes.home}><em className="fas fa-home fa-2x bg-primary text-white rounded-circle p-2" /></Link></div>
              <div className="col text-center my-auto"><Link to={routes.myFriends}><em className="fas fa-users fa-lg" /></Link></div>
              <div className="col text-center my-auto"><Link to={routes.menu}>
                <em className="fas fa-bars fa-lg"/>
                {this.renderNotificationBadge()}
              </Link></div>
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
      this.setState((prevState) => {
          let state = prevState
          state.body = data.body
          state.title = data.title
          state.confirmMessage = data.confirmMessage
          state.discardMessage = data.discardMessage
          state.okFun = data.okFun
          state.exitFun = data.exitFun
          state.cancelFun = data.cancelFun
          return state
      }, () => {
          if (this.state.exitFun instanceof Function) {
              let modal = document.getElementById('errorLog')
              let config = { attributes: true}
              let state = this.state
              let callback = function(mutationsList, observer) {
                  for(let mutation of mutationsList) {
                      if (mutation.attributeName === "aria-hidden" && mutation.target.attributes["aria-hidden"]) {
                          state.exitFun()
                          observer.disconnect()
                      }
                  }
              }
              const observer = new MutationObserver(callback)
              observer.observe(modal, config)
          }
          document.getElementById("triggerButton").click()
      })
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
                <button 
                  type="button" 
                  className={this.state.discardMessage ? "btn btn-outline-primary" : "d-none"} 
                  data-dismiss="modal" 
                  onClick={this.state.discardMessage ? this.state.cancelFun : () => {}}>
                  {this.state.discardMessage}
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  data-dismiss="modal" 
                  onClick={this.state.okFun ? this.state.okFun : () => {}}>
                  {this.state.confirmMessage ? this.state.confirmMessage : this.props.closeLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ReviewModal extends CallableComponent {

    title = "Scrivi una recensione"
    showReviewModalButtonId = "show-review-modal"

    constructor(props) {
        super(props)
        this.state = {
            event: undefined,
            onSent: undefined,
            text: "",
            evaluation: 0,
            error: ""
        }
    }


    /**
     * @param data {{
     *     event: object
     *     onSent: function
     * }}
     */
    showModal = (data) => {
        this.setState({
                event : data.event,
                onSent: data.onSent
            },this.toggleModal)
    }

    writeReview = () => {
        if (!this.checkErrors()) {
            let review = {
                writer: this.props.user._id,
                event: this.state.event._id,
                text: this.state.text,
                evaluation: this.state.evaluation
            }
            ApiService.writeReview(review,
                () => this.showError("Si è verificato un errore, riprovare."),
                () => {
                    this.toggleModal()
                    if (this.state.onSent instanceof Function)
                        this.state.onSent()
                })
        }
    }

    toggleModal = () => {
        document.getElementById(this.showReviewModalButtonId).click()
    }

    showError = message => {
        this.setState({error: message})
    }

    checkErrors = () => {
        let errorFound = false
        let addErrorClassAndFocus = name => {
            let element = document.getElementById(name)
            element.classList.add("border")
            element.classList.add("border-danger")
            if (!errorFound) {
                errorFound = true
                element.focus()
                element.scrollIntoView()
            }
        }
        if (!this.state.text) {
            addErrorClassAndFocus("review-text")
            this.showError("Non hai inserito nessun testo per la recensione!")
        }
        return errorFound
    }

    renderStars = () => {
        let stars = []
        for (let i = 0; i < 5; i++)
            stars.push(
                <em className={(i < this.state.evaluation ? " fas " : " far ") + " fa-star text-warning pr-2"}
                    onClick={() => this.onStarClicked(i+1)}
                    key={"star-" + i}>
                </em>)
        return (
            <div className={"d-flex justify-content-start align-items-center"}>
                {stars}
            </div>
        )
    }

    onTextChange = event => {
        event.persist()
        this.setState({text: event.target.value})
    }

    onStarClicked = star => {
        if (star > 0 && star <= 5)
            this.setState({evaluation: star === this.state.evaluation ? star - 1 : star })
    }

    render() {
        return (
            this.state.event ?
            <div>
                <button type="button" id={this.showReviewModalButtonId} hidden={true} data-toggle="modal" data-target="#reviewModal">Launch modal</button>
                <div className="modal fade" id="reviewModal" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">{this.title}</h5>
                            </div>
                            <div className="modal-body">
                                <div className={"container-fluid"}>
                                    <EventHeaderBanner event={this.state.event} hidePlace={true} />
                                    <div className={"row mt-2"}>
                                        <div className={"col-12 px-0"}>
                                            {this.renderStars()}
                                        </div>
                                    </div>
                                    <div className={"row mt-2"}>
                                        <div className={"col-12 px-0"}>
                                            <textarea
                                                id={"review-text"}
                                                name={"review-text"}
                                                className="w-100 form-control"
                                                onChange={this.onTextChange}
                                            >
                                            </textarea>
                                        </div>
                                    </div>
                                    <div className={"row mt-2"}>
                                        <div className={"col-12 px-0"}>
                                            <p className={"text-danger"}>{this.state.error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className={"btn btn-danger review-modal-button"}
                                    data-dismiss="modal"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary review-modal-button"
                                    onClick={this.writeReview}
                                >
                                    Invia
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <div/>
        )
    }
}

export default App;
