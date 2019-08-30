import React from 'react'
import {Link} from 'react-router-dom'

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
                        <em className={"col-1 " + iconClass}></em>
                        <span className={(props.showBadge ? "col-10" : "col") + " text-dark my-0 h5"}>{props.name}</span>
                        {
                            props.showBadge ? 
                                <div className="d-flex align-items-center px-0"> <span className="badge badge-danger">{props.badgeInfo}</span> </div>
                                : <div/> 
                        }
                    </div>
            </Link>
        </li>
    )
}



export default function Menu(props){
    let logout = props.isLogged ?
    <div>
        <LinkToPage 
            page="/settings"
            icon={{name: "cog", size: "lg"}}
            name="Impostazioni"/>
        <LinkToPage 
            page="/"
            onClick={props.onLogout}
            icon={{name: "sign-out-alt", size: "lg"}}
            name="Logout"/>
    </div> 
    : <div/>
    return (
        <div className="main-containers">
            <ul className="px-0 my-2" style={{listStyle: "none"}}>
                <LinkToPage 
                    page="/notifications"
                    icon={{style: "far", name: "bell", size: "lg"}}
                    name="Le mie notifiche" 
                    showBadge={props.isLogged && props.notifications && props.notifications.length > 0}
                    badgeInfo={props.notifications.length}/>
                <LinkToPage 
                    page="/groups"
                    icon={{style: "far", name: "address-book", size: "lg"}}
                    name="I miei gruppi"/>
                <LinkToPage 
                    page="/myEvents"
                    icon={{style: "far", name: "calendar-alt", size: "lg"}}
                    name="I miei eventi"/>
                <LinkToPage 
                    page="/reviews"
                    icon={{name: "pen", size: "lg"}}
                    name="Le mie recensioni"/>
                {logout}
            </ul>
        </div>
    )
}