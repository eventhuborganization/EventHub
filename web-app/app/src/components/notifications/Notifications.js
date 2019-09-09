import React from 'react'
import Notification from "./Notification"
import {LoginRedirect} from "../redirect/Redirect"
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import ApiService from "../../services/api/Api"
import TrackVisibility from 'react-on-screen'
import NotificationService from "../../services/notification/Notification"
import {LargeFloatingButton} from "../floating_button/FloatingButton";

class Notifications extends React.Component {

    #notificationServiceSubscriptionCode = undefined
    #isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            notificationsRead: []
        }
    }

    componentDidMount() {
        this.#isMounted = true
        if (this.props.isLogged) {
            ApiService.getNotifications(0,() => {},notifications => {
                this.setState({
                    notifications: notifications,
                    notificationsRead: []
                },() => this.#notificationServiceSubscriptionCode = NotificationService.addSubscription(this.onNotificationLoaded))
            })
        }
    }

    componentWillUnmount() {
        NotificationService.removeSubscription(this.#notificationServiceSubscriptionCode)
        this.#notificationServiceSubscriptionCode = undefined
        this.#isMounted = false
    }

    renderNoNotificationPlaceHolder = () => {
        if (this.state.notifications.length <= 0 && this.state.notificationsRead.length <=0)
            return <NoItemsPlaceholder placeholder={"Nessuna notifica ricevuta"} />
    }

    deleteNotification = (notificationId) => {
        this.setState((prevState) => {
            let state = prevState
            state.notifications = prevState.notifications.filter(not => not._id !== notificationId)
            return state
        })
    }

    isNotificationToBeReadOnce = (type) => {
        return type === 2 || type === 3 || type === 8 || type === 10
    }

    onNotificationLoaded = notifications => {
        if(this.#isMounted)
            this.setState({notifications: notifications})
    }

    setAllNotificationsAsRead = () => {
        let notifications = []
        let count = 0
        notifications = notifications.concat(this.state.notificationsRead)
        notifications = notifications.concat(this.state.notifications)
        notifications.forEach(notification => 
            ApiService.notificationRead(notification._id, () => {}, () => {
                count++
                if(count === notifications.length){
                    this.setState({notifications: [], notificationsRead: []})
                }
            })
        )
    }

    render() {
        let notificationsToShow = this.state.notifications.concat(this.state.notificationsRead)
            .sort((n1,n2) => n2.timestamp - n1.timestamp)
        return (
            <div>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                <section className="row sticky-top shadow bg-white border-bottom border-primary text-center">
                    <h2 className="col ml-1 page-title">Notifiche</h2>
                </section>

                <main className="main-container">
                    {
                        <div>
                            {
                                notificationsToShow.map(notification => {
                                    let notificationComponent = <Notification {...this.props}
                                                                            key={notification._id}
                                                                            notification={notification}
                                                                            deleteNotification={this.deleteNotification}
                                                                />
                                    return this.isNotificationToBeReadOnce(notification.typology) ?
                                        (<TrackVisibility key={"tracker-" + notification._id} once>
                                            {({ isVisible }) => {
                                                if (isVisible && this.state.notificationsRead.filter(n => n._id === notification._id).length <= 0) {
                                                    this.setState(prevState => {
                                                        let state = prevState
                                                        state.notificationsRead.push(notification)
                                                        state.notifications = prevState.notifications.filter(n => n._id !== notification._id)
                                                        return state
                                                    }, () => ApiService.notificationRead(notification._id, () => {}, () => {}))
                                                }
                                                return notificationComponent
                                            }}
                                        </TrackVisibility>)
                                        : notificationComponent

                                })
                            }

                            {
                                notificationsToShow.length > 0 ?
                                    <LargeFloatingButton
                                        text={"Segna tutte le notifiche come lette"}
                                        onClick={this.setAllNotificationsAsRead}
                                    /> : <div/>
                            }
                        </div>
                    }
                    {this.renderNoNotificationPlaceHolder()}
                </main>
            </div>
        )
    }
}

export default Notifications