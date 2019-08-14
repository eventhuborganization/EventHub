import React from 'react'
import Notification from "./Notification"
import {LoginRedirect} from "../redirect/Redirect"
import ApiService from '../../services/api/Api'
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder";

class Notifications extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            notifications: []
        }
        if (!!props.isLogged)
            ApiService.getNotifications(
                props.match.params.fromIndex, 
                () => this.props.onError("Si è verificato un errore durante il caricamento delle notifiche, riprova."),
                notifications => {
                    this.setState((prevState) => {
                        let state = prevState
                        state.notifications = notifications
                        return state
                    })
                }
            )
    }

    renderNoNotificationPlaceHolder = () => {
        if (this.state.notifications.length <= 0)
            return <NoItemsPlaceholder placeholder={"Nessuna notifica ricevuta"} />
    }

    deleteNotification = (notificationId) => {
        this.setState((prevState) => {
            let state = prevState
            state.notifications = prevState.notifications.filter(not => not._id !== notificationId)
            return state
        })
    }

    render() {
        return (
            <div>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                <section className="row sticky-top shadow bg-white border-bottom border-primary text-center">
                    <h1 className="col ml-1">Notifiche</h1>
                </section>

                <main className="main-container">
                    {
                        this.state.notifications.map(notification =>
                            <Notification {...this.props}
                                          key={notification._id}
                                          notification={notification}
                                          deleteNotification={this.deleteNotification}
                            />)
                    }
                    {this.renderNoNotificationPlaceHolder()}
                </main>
            </div>
        )
    }
}

export default Notifications