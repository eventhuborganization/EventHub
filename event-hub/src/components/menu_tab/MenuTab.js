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

function RegistrationTab(props) {
    return <MenuTab {...props} styleOptions="nav-pills justify-content-center mb-3" />
}

function FriendsTab(props) {
    return <MenuTab {...props} styleOptions="nav-pills justify-content-center mb-1" />
}

export {RegistrationTab, FriendsTab, MenuTab}