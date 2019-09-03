import React from 'react'
import Api from '../../services/api/Api'

import { Redirect } from "react-router-dom"
import LocalStorage from "local-storage"
import { UserBanner } from '../link_maker_banner/LinkMakerBanner'
import { RoundedBigImage, BORDER_PRIMARY, PLACEHOLDER_GROUP_CIRCLE } from '../image/Image'
import { SimpleSearchBar } from '../search_bar/SearchBar'

let routes = require("../../services/routes/Routes")

export default class GroupInfo extends React.Component {

    groupInfoStateLocalStorageName = "group-info"

    constructor(props){
        super(props)
        let localSavedEvent = LocalStorage(this.groupInfoStateLocalStorageName)
        let group = props.location && props.location.group ? props.location.group : undefined
        if (!group && localSavedEvent){
            let groupSaved = localSavedEvent
            if(groupSaved._id === props.match.params.id){
                group = localSavedEvent
            }
        }
        this.state = {
            filter: "",
            group: group || {members: []},
            isMember: props.isLogged && group && group.members.findIndex(user => user._id === this.props.user._id) >= 0
        }
        if(this.state.isMember){
            LocalStorage(this.groupInfoStateLocalStorageName, this.state.group)
            Api.getGroupInfo(
                props.match.params.id,
                () => this.props.onError("Errore nel caricare le info del gruppo"),
                group => {
                    group.members.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                    this.setState({group : group})
                }
            )
        }
    }

    componentDidMount() {
        if (!(this.props.isLogged && this.state.group && this.state.isMember)) {
            this.props.onError(
                "Non sei autorizzato, verrai ridirezionato alla homepage", () => {},
                () => this.setState({redirectHome: true})
            )
        }
    }

    onFilterChange = (event) => {
        this.setState({filter: event.target.value})
    }

    addFriend = (friend) => {
       Api.sendFriendshipRequest(
            friend._id,
            () => this.props.onError("Si è verificato un errore durante la richesta, riprova"),
            () => {
                let button = document.getElementById("friendBtn" + friend._id)
                button.innerHTML = "In attesa"
                button.classList.add("disabled")
                button.blur()
            }
        )
    }

    renderMembers = () => {
        if(this.state.group.members.length > 0){
            return this.state.group.members
                    .filter(user => user.name.toLowerCase().includes(this.state.filter.toLowerCase()) && user._id !== this.props.user._id)
                    .map(user => 
                        <UserBanner 
                            key={user._id}
                            border={true}
                            user={user}
                            showButton={true}
                            onAddFriend={() => this.addFriend(user)}
                            showAddFriendButton={this.props.user.linkedUsers.findIndex(elem => elem._id === user._id) < 0}
                        /> 
                    )
        }
    }

    redirectToHome = () => {
        return this.state.redirectHome ? <Redirect to={routes.home} /> : <div/>
    }

    render = () => {
        return (
            <div className="main-container">

                {this.redirectToHome()}

                <div className="row mt-2">
                    <div className="col d-flex justify-content-center">
                        <div className="d-flex flex-column text-center">
                            <div className="col d-flex justify-content-center">
                                <RoundedBigImage
                                    borderType={BORDER_PRIMARY} 
                                    placeholderType={PLACEHOLDER_GROUP_CIRCLE}
                                />
                            </div>
                            <h5 className="mt-1 font-weight-bold">{this.state.group.name}</h5>
                        </div>
                    </div>
                </div>

                <div className="row my-2">
                    <div className="col-12 d-flex justify-content-around">
                        <button className="btn btn-danger">Esci dal gruppo</button>
                        <button className="btn btn-primary">Aggiungi membri</button>
                    </div>
                </div>

                <SimpleSearchBar
                    placeholder="Cerca partecipante"
                    value={this.state.filter}
                    onChange={this.onFilterChange}
                />

                {this.renderMembers()}

            </div>
        )
    }
} 