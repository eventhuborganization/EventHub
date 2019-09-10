import React from 'react'
import {Link} from 'react-router-dom'
import "./Menu.css"

function LinkToPage(props){
    let iconClass = "text-secondary " + 
                    (props.icon.style ? props.icon.style : "fas") + 
                    " fa-" + props.icon.name + (props.icon.size ? " fa-" + props.icon.size : "")
    return (
        <li className="row">
            <Link
                to={props.page}
                onClick={props.onClick ? props.onClick : () => {}}
                className={"col-11 py-2 border border-secondary rounded mx-auto mb-2"} 
                style={{textDecoration: "none"}}>
                    <div className="row d-flex align-items-center">
                        <em className={"col-1 menu-item-icon " + iconClass}></em>
                        <span className={(props.showBadge ? "col-10" : "col") + " text-dark my-0 menu-item-text"}>{props.name}</span>
                        {
                            props.showBadge ? 
                                <div className="d-flex align-items-center px-0"> <span className="badge badge-danger notification-badge">{props.badgeInfo}</span> </div>
                                : <div/> 
                        }
                    </div>
            </Link>
        </li>
    )
}



export default function Menu(props){
    let routes = require('../../services/routes/Routes')
    let logout = props.isLogged ?
    <div>
        <LinkToPage 
            page={routes.settings}
            icon={{name: "cog", size: "lg"}}
            name="Impostazioni"/>
        <LinkToPage 
            page={routes.home}
            onClick={props.onLogout}
            icon={{name: "sign-out-alt", size: "lg"}}
            name="Logout"/>
    </div> 
    : <LinkToPage 
        page={routes.login}
        icon={{name: "sign-in-alt", size: "lg"}}
        name="Login"/>
    let showBadge = props.isLogged && props.location && props.location.notifications && props.location.notifications.length > 0
    let isOrganization = props.isLogged && props.user && props.user.organization
    let optionalTabs = isOrganization ? <div/> :
        <div>
            <LinkToPage
                page={routes.myGroups}
                icon={{style: "far", name: "address-book", size: "lg"}}
                name="I miei gruppi"/>
            <LinkToPage
                page={routes.myProgresses}
                icon={{name: "trophy", size: "lg"}}
                name="I miei badge"/>
            <LinkToPage
                page={routes.subscribedEvents}
                icon={{style: "far", name: "calendar-check", size: "lg"}}
                name="Eventi di interesse"/>
            <LinkToPage
                page={routes.myEvents}
                icon={{style: "far", name: "calendar-alt", size: "lg"}}
                name="I miei eventi"/>
            <LinkToPage
                page={{
                    pathname: routes.reviews,
                    myReview: true
                }}
                icon={{name: "pen", size: "lg"}}
                name="Le mie recensioni"/>
        </div>
    return (
        <div className="main-containers">
            <ul className="px-0 my-2" style={{listStyle: "none"}}>
                {
                    props.hideNotifications ? <div/> :
                        <LinkToPage
                            page={routes.myNotifications}
                            icon={{style: "far", name: "bell", size: "lg"}}
                            name="Le mie notifiche"
                            showBadge={showBadge}
                            badgeInfo={showBadge ? props.location.notifications.length : 0}
                        />
                }
                {optionalTabs}
                <LinkToPage
                    page={{
                        pathname: routes.reviews,
                        receivedReviews: true
                    }}
                    icon={{style: "far", name: "comment", size: "lg"}}
                    name="Recensioni ricevute"/>
                {logout}
            </ul>
        </div>
    )
}