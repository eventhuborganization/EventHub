import React from 'react';

function MenuTab(props) {
    let count = -1
    let navigationBar = props.tabs.map(element => {
        count++
        return (
            <li className="nav-item" key={"li" + count + "_id"}>
                <a  className={"nav-link" + (count === 0 ? " active" : "")} 
                    id={"tab-" + count} 
                    data-toggle="pill" 
                    href={"#elem-" + count} 
                    role="tab" aria-controls={"elem-" + count} aria-selected={count === 0 ? true : false}>
                    {element.tag}
                </a>
            </li>
        )
    })
    count = -1
    let tabBar = props.tabs.map(element => {
        count ++
        return (
            <div className={"tab-pane fade h-100" + (count === 0 ? " show active" : "")} 
                 id={"elem-" + count} 
                 role="tabpanel" aria-labelledby={"tab-" + count}
                 key={"div" + count + "_id"}>
                {element.elem}
            </div>
        )
    })
    return (
        <div>
            <ul className={"row nav " + props.styleOptions} id="user-selection" role="tablist">
                {navigationBar}
            </ul>
            <div className="tab-content" id="user-selection-content">
                {tabBar}
            </div>
        </div>
    );
}

function ScrollableMenuTab(props){
    let count = -1
    let navigationBar = props.tabs.map(element => {
        count++
        return (
            <li className="nav-item" key={"li" + count + "_id"}>
                <a className={"nav-link " + props.style.link + (count === 0 ? " active" : "")}
                    id={"tab-scroll-" + count} 
                    data-toggle="pill" 
                    href={"#scroll-elem-" + count}
                    role="tab" aria-controls={"scroll-elem-" + count} aria-selected={count === 0}
                    onClick={element.onClick instanceof Function ? element.onClick : () => {}}>
                    {element.tag}
                </a>
            </li>
        )
    })
    count = -1
    let tabBar = props.tabs.map(element => {
        count ++
        return (
            <div className={"tab-pane fade h-100" + (count === 0 ? " show active" : "")} 
                 id={"scroll-elem-" + count} 
                 role="tabpanel" aria-labelledby={"tab-scroll-" + count}
                 key={"div" + count + "_id"}>
                {element.elem}
            </div>
        )
    })
    return (
        <div>
            <nav className={"row navbar navbar-dark " + props.style.navbarBackground}>
                    <button 
                        className={"navbar-toggler " + props.style.button} type="button" 
                        data-toggle="collapse" data-target="#navbarToggleExternalContent" 
                        aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation"
                    >
                        <em className="navbar-toggler-icon"></em>
                    </button>
                    <h5 className={"col text-left mb-0 " + props.style.title}> {props.title} </h5>
                </nav>
            <div className="row collapse" id="navbarToggleExternalContent">
                <div className={"col-12 py-2 " + props.style.navbarBackground}>
                    <ul className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        {navigationBar}
                    </ul>
                </div>
            </div>
            <div className="tab-content" id="v-pills-tabContent">
                {tabBar}
            </div>
        </div>
    )
}


function RegistrationTab(props) {
    return <MenuTab {...props} styleOptions="nav-pills justify-content-center mb-3" />
}

function FriendsTab(props) {
    return <MenuTab {...props} styleOptions="nav-pills justify-content-center mb-1" />
}

export {RegistrationTab, ScrollableMenuTab, FriendsTab, MenuTab}