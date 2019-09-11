import React from 'react'
import { Redirect } from 'react-router-dom'
import './GroupCreator.css'

import { LoginRedirect } from '../redirect/Redirect'
import { RoundedSmallImage, PLACEHOLDER_USER_CIRCLE } from '../image/Image'

import Api from '../../services/api/Api'
import AvatarHeader from '../avatar_header/AvatarHeader'
import {LargeFloatingButton} from "../floating_button/FloatingButton"
import ScrollableMenu from '../menu/ScrollableMenu'

let routes = require('../../services/routes/Routes')

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class GroupCreator extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            name: "",
            friends: new Set(),
            redirectGroups: false
        }
    }

    changeName = ev => {
        this.setState({name: capitalizeFirstLetter(ev.target.value)})
    }

    onFriendChange = (id, adding) => {
        if(adding){
            this.setState(prevState => {
                prevState.friends.add(id)
                return prevState
            })
        } else {
            this.setState(prevState => {
                prevState.friends.delete(id)
                return prevState
            })
        }
    }

    submitForm = (ev) => {
        ev.preventDefault()
        if(!this.state.name){
            this.props.onError("Devi inserire il nome del gruppo!")
        } else if(this.state.friends.size === 0) {
            this.props.onError("Devi selezionare almeno un amico per creare un gruppo!")
        } else {
            Api.createGroup(
                this.state.name,
                Array.from(this.state.friends),
                () => this.props.onError("Errore durante la creazione del gruppo, riprova"),
                (group) => {
                    let groups = this.props.user.groups
                    groups.push(group)
                    this.props.updateUserInfo([[groups, "groups"]])
                    this.setState({redirectGroups: true})
                }
            )
        }
    }

    redirectToGroups = () => {
        return this.state.redirectGroups ? 
            <Redirect from={this.props.from} to={routes.myGroups} /> : <div/>
    }

    render = () => {
        return (
            <div className="main-container">
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                {this.redirectToGroups()}

                <form onSubmit={this.submitForm} className="row mt-3">

                    <div className={"col-12 col-xl-6"}>
                        <AvatarHeader
                            elem={{
                                name: this.state.name ?
                                    this.state.name : "Scegli nome gruppo"
                            }}
                            isGroup={true}
                        />
                        <button className={"d-none d-xl-block btn btn-primary btn-block button-size mx-auto w-50 mt-4"} type={"submit"}>
                            Crea gruppo
                        </button>
                    </div>

                    <div className={"col-12 col-xl-6"}>
                        <div className={"row"}>
                            <div className={"col-12 col-xl-9"}>
                                <div className="form-group">
                                    <label htmlFor="groupName group-creator-title">Nome del gruppo:</label>
                                    <input
                                        type="text"
                                        className="form-control group-creator-text"
                                        id="groupName"
                                        placeholder="Nome del gruppo"
                                        value={this.state.name}
                                        onChange={this.changeName}
                                    />
                                </div>
                                <div className="form-group">
                                    <ScrollableMenu title={"Amici"}>
                                        {
                                            this.props.user.linkedUsers
                                                .filter(user => !user.organization)
                                                .map(user =>
                                                    <SelectableFriendBanner
                                                        key={"pippo_" + user._id}
                                                        id={"pippo_" + user._id}
                                                        elem={user}
                                                        border={true}
                                                        name={"friend" + user._id}
                                                        addFriend={id => this.onFriendChange(id, true)}
                                                        removeFriend={id => this.onFriendChange(id, false)}
                                                    />
                                                )
                                        }
                                    </ScrollableMenu>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"d-xl-none"}>
                        <LargeFloatingButton
                            isSubmit={true}
                            text={"Crea gruppo"}
                            onClick={() => {}}
                        />
                    </div>
                </form>
            </div>
        )
    }
}

function SelectableFriendBanner(props){
    
    let handleChange = (check) => {
        if(check.checked){
            props.addFriend(props.elem._id)
        } else {
            props.removeFriend(props.elem._id)
        }
    }
    
    let toggleCheck = () => {
        let check = document.getElementById(props.id)
        check.checked = !check.checked
        handleChange(check)
    }

    return (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <div 
                className={"col-4 col-md-2 col-xl-3" + (props.elem.avatar ? "" : " d-flex align-self-stretch")}
                onClick={toggleCheck}>
                <RoundedSmallImage 
                    imageName={props.elem.avatar} 
                    placeholderType={PLACEHOLDER_USER_CIRCLE}/>
            </div>
            <div className="col" onClick={toggleCheck}>
                <div className="font-weight-bold text-dark group-name">{props.elem.name + " " + props.elem.surname}</div>
                <div className="text-muted small group-info">
                    {props.elem.organization ? "Organizzazione" : "Utente"} - {props.elem.address.city}
                </div>
            </div>
            <div className="col-2 col-md-2 d-flex align-items-center justify-content-end">
                <input
                    id={props.id} 
                    className="checkbox-size" 
                    type="checkbox" 
                    name={props.name} value={props.elem._id} 
                    aria-label={props.elem.name + " " + props.elem.surname}
                    onClick={ev => handleChange(ev.target)}
                />
            </div>
        </div>
    )
}
