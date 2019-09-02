import React from 'react'
import { LoginRedirect } from '../redirect/Redirect'
import { RoundedSmallImage, PLACEHOLDER_USER_CIRCLE, PLACEHOLDER_GROUP_CIRCLE, RoundedBigImage, BORDER_PRIMARY } from '../image/Image'

let routes = require('../../services/routes/Routes')

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class GroupCreator extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            name: ""
        }
    }

    changeName = ev => {
        this.setState({name: capitalizeFirstLetter(ev.target.value)})
    }

    render = () => {
        return (
            <div className="main-container">
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />

                <form onSubmit={ev => ev.preventDefault()} className="mt-3">

                    <div className="row mt-2">
                        <div className="col d-flex justify-content-center">
                            <div className="d-flex flex-column text-center">
                                <div className="col d-flex justify-content-center">
                                    <RoundedBigImage
                                        borderType={BORDER_PRIMARY} 
                                        placeholderType={PLACEHOLDER_GROUP_CIRCLE}
                                    />
                                </div>
                                <h5 className="mt-1 font-weight-bold">
                                    {
                                        this.state.name ? 
                                        this.state.name : "Scegli nome gruppo"
                                    }
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="groupName">Nome del gruppo:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="groupName" 
                            placeholder="Nome del gruppo"
                            value={this.state.name}
                            onChange={this.changeName}
                        />
                    </div>
                    <div className="form-group">
                        <ToggableMenu
                            title={"Amici"}
                            children = {
                                this.props.user.linkedUsers
                                    .filter(user => !user.organization)
                                    .map(user => 
                                        <SelectableFriendBanner 
                                            key={"pippo_" + user._id}
                                            id={"pippo_" + user._id}
                                            elem={user}
                                            border={true}
                                            name={"friend" + user._id}
                                        />
                                    )
                            }
                        />
                    </div>
                    <input 
                        type="submit" 
                        className="fixed-bottom btn btn-primary" 
                        value="Crea gruppo" 
                        style={{marginBottom: "22%", width: "94%", marginLeft: "3%", marginRight: "3%"}}
                    />
                </form>
            </div>
        )
    }
}

class ToggableMenu extends React.Component {

    toggleArrow = () => {
        let arrowClass = document.getElementById("menuArrow").classList
        if(arrowClass.contains("fa-angle-down")){
            arrowClass.remove("fa-angle-down")
            arrowClass.add("fa-angle-up")
        } else {
            arrowClass.remove("fa-angle-up")
            arrowClass.add("fa-angle-down")
        }  
    }

    render = () => {
        return (
            <div>
                <div className="row">
                    <div 
                        data-toggle="collapse" 
                        data-target="#friendsContent" 
                        aria-controls="friendsContent" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                        className="col-12"
                        onClick={this.toggleArrow}>
                        <em id="menuArrow" className="fas fa-angle-down"/>
                        <span className="ml-2 h5">{this.props.title}</span>
                    </div>
                </div>
                <div className="collapse" id="friendsContent">
                    {this.props.children}
                </div>
            </div>
        )
    }


}

function SelectableFriendBanner(props){
    
    let toggleCheck = () => {
        let check = document.getElementById(props.id)
        check.checked = !check.checked
    }

    return (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <div 
                className={"col-4 col-md-2 col-lg-1" + (props.elem.avatar ? "" : " d-flex align-self-stretch")}
                onClick={toggleCheck}>
                <RoundedSmallImage 
                    imageName={props.elem.avatar} 
                    placeholderType={PLACEHOLDER_USER_CIRCLE}/>
            </div>
            <div className="col-6 px-0" onClick={toggleCheck}>
                <div className="font-weight-bold text-dark">{props.elem.name + " " + props.elem.surname}</div>
                <div className="text-muted small">
                    {props.elem.organization ? "Organizzazione" : "Utente"} - {props.elem.address.city}
                </div>
            </div>
            <div className="col-2 d-flex align-items-center justify-content-end">
                <input
                    id={props.id} 
                    className="" 
                    type="checkbox" 
                    name={props.name} value={props.elem._id} 
                    aria-label={props.elem.name + " " + props.elem.surname}
                />
            </div>
        </div>
    )
}
