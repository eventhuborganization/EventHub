import React from 'react'
import { Link } from 'react-router-dom'

import NotificationService from "../../services/notification/Notification"

import "./NavigationBar.css"

let routes = require("../../services/routes/Routes")

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            notificationServiceSubscriptionCode: -1
        }
        if(this.props.isLogged){
            this.state.notificationServiceSubscriptionCode = NotificationService.addSubscription(this.onNotificationLoaded)
        }
    }

    componentDidUpdate = () => {
        if(this.props.isLogged && this.state.notificationServiceSubscriptionCode < 0){
            this.setState({notificationServiceSubscriptionCode: NotificationService.addSubscription(this.onNotificationLoaded)})
        } else if(!this.props.isLogged && this.state.notificationServiceSubscriptionCode >= 0){
            this.removeSubscriptions()
        }
    }

    componentWillUnmount() {
        this.removeSubscriptions()
    }

    removeSubscriptions = () => {
        NotificationService.removeSubscription(this.state.notificationServiceSubscriptionCode)
        this.setState({notifications: [], notificationServiceSubscriptionCode: -1})
    }

    onNotificationLoaded = (notifications) => {
        this.setState({notifications: notifications})
    }


    renderNotificationBadge = () => {
        return this.props.isLogged && this.state.notifications.length > 0 ? 
            <span className={"badge badge-danger align-top ml-1 notification-badge"}>{this.state.notifications.length}</span> : <div/>
    }

    render = () => {
        return (
            <footer id="footer" className="row fixed-bottom bg-light border-top border-primary mx-0 py-2">
                <div className="col text-center my-auto">
                  <Link to={routes.map}><em className="fas fa-map-marked-alt icon" /></Link>
                </div>
                <div className="col text-center my-auto">
                    <Link to={routes.myProfile}><em className="fas fa-user icon" /></Link>
                </div>
                <div className="col text-center my-auto">
                    <Link to={routes.home}><em className="fas fa-home homepage-icon bg-primary text-white rounded-circle p-2" /></Link>
                </div>
                <div className="col text-center my-auto">
                    {
                        this.props.isLogged && this.props.user && this.props.user.organization ?
                            <Link to={routes.myEvents}><em className="far fa-calendar-alt icon" /></Link> :
                            <Link to={routes.myFriends}><em className="fas fa-users icon" /></Link>
                    }
                </div>
                <div className="col text-center my-auto">
                    <Link to={
                        {
                            pathname: routes.menu, 
                            notifications: this.state.notifications
                        }
                    }><em className="fas fa-bars icon"/>{this.renderNotificationBadge()}</Link>
                </div>
            </footer>
        )
    }
}