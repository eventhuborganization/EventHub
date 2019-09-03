import React from 'react'
import Api from '../../services/api/Api'

import { Link, Redirect } from "react-router-dom"
import LocalStorage from "local-storage"
import { UserBanner, LinkMakerBanner, ADDED_FRIEND_BUTTON, ADD_FRIEND_BUTTON } from '../link_maker_banner/LinkMakerBanner'
import { SimpleSearchBar } from '../search_bar/SearchBar'
import AvatarHeader from '../avatar_header/AvatarHeader'

let routes = require("../../services/routes/Routes")

class GroupInfo extends React.Component {

     groupInfoStateLocalStorageName = "group-info"

    constructor(props){
        super(props)
        let localSavedGroup = LocalStorage(this.groupInfoStateLocalStorageName)
        let group = props.location && props.location.group ? props.location.group : undefined
        if (!group && localSavedGroup){
            let groupSaved = localSavedGroup
            if(groupSaved._id === props.match.params.id){
                group = localSavedGroup
            }
        }
        this.state = {
            filter: "",
            group: group !== undefined ? group : {members: []},
            isMember: props.isLogged && group && group.members.findIndex(user => user._id === this.props.user._id) >= 0,
            redirectGroups: false,
            redirectHome: false
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

    exitFromGroup = () => {
        Api.removeMemberFromGroup(
            this.state.group._id,
            this.props.user._id,
            () => this.props.onError("Non è stato possibile uscire dal gruppo, riprova"),
            () => {
                let groups = this.props.user.groups.filter(groups => groups._id !== this.state.group._id)
                this.props.updateUserInfo([[groups, "groups"]])
                this.setState({redirectGroups: true})
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

    redirectToGroups = () => {
        return this.state.redirectGroups ? 
            <Redirect from={this.props.from} to={routes.myGroups} /> : <div/>
    }

    render = () => {
        return (
            <div className="main-container">

                {this.redirectToHome()}
                {this.redirectToGroups()}

                <AvatarHeader
                    elem={this.state.group}
                    isGroup={true}
                />

                <div className="row my-2">
                    <div className="col-12 d-flex justify-content-around">
                        <button className="btn btn-danger" onClick={this.exitFromGroup}>Esci dal gruppo</button>
                        <Link 
                            to={{
                                pathname: routes.inviteGroup,
                                group: this.state.group
                            }} 
                            className="btn btn-primary">
                            Aggiungi membri
                        </Link>
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

class GroupAdder extends React.Component {

    addGroupStateLocalStorageName = "add-group"

    constructor(props) {
        super(props)
        let localSavedGroup = LocalStorage(this.addGroupStateLocalStorageName)
        let group = props.location.group || undefined
        if (!group && localSavedGroup)
            group = localSavedGroup
        this.state = {
            filter: "",
            linkedUsers: props.user.linkedUsers.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) || [],
            group: group || {_id: "", name: "", members: []},
            isAllowed: group !== undefined,
            redirectHome: false
        }

        if (props.isLogged && this.state.isAllowed) {
            LocalStorage(this.localSavedGroup, this.state.group)
            Api.getUserInformation(props.user._id, () => {},user => {
                let users = user.linkedUsers
                    .filter(friend => !friend.organization)
                    .sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                this.setState({linkedUsers: users})
            })
        }
    }

    componentDidMount() {
        if (!(this.props.isLogged && this.state.isAllowed)) {
            this.props.onError(
                "Non sei autorizzato, verrai ridirezionato alla homepage", () => {},
                () => this.setState({redirectHome: true})
            )
        }
    }

    onFilter = (event) => {
        this.setState({filter: event.target.value})
    }

    cannotAdd = (friend) => {
        return !friend && this.state.group.members.findIndex(user => user._id === friend._id) >= 0
    }

    inviteFriend = friend => {
        Api.addMemberToGroup(
            this.state.group._id,
            friend._id,
            () => this.props.onError("Non è stato possibile aggiungere il tuo amico al gruppo, riprova."),
            () => {
                this.setButtonEnabled(friend, false)
                this.state.group.members.push(friend)
                let groups = this.props.user.groups
                let index = groups.findIndex(group => group._id === this.state.group._id)
                groups[index] = this.state.group
                this.props.updateUserInfo([[groups, "groups"]])
            }
        )
    }

    setButtonEnabled = (elem, enabled) => {
        let button = document.getElementById(this.buttonId + elem._id)
        if (enabled) {
            button.innerHTML = "Aggiungi"
            button.classList.remove("disabled")
        } else {
            button.innerHTML = "Aggiunto"
            button.classList.add("disabled")
        }
        button.blur()
    }

    getAllFriends = () => {
        return this.getFriends(
            elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()),
            elem => !this.cannotAdd(elem),
            elem => this.inviteFriend(elem)
        )
    }

    getFriends = (filterFun, showFun, fun) => {
        let x = 0;
        return this.state.linkedUsers
            .filter(elem => filterFun(elem))
            .map(elem => {
                let id = "friend" + x++
                let enabled = showFun(elem)
                return (
                    <LinkMakerBanner key={id}
                                     border={true}
                                     elem={elem}
                                     onClick={() => fun(elem)}
                                     showButton={true}
                                     buttonType={enabled ? ADD_FRIEND_BUTTON : ADDED_FRIEND_BUTTON}
                                     buttonId={this.buttonId + elem._id}
                                     buttonDisabled={!enabled}
                    />
                )
            })
    }

    redirectToHome = () => {
        return this.state.redirectHome ? <Redirect to={routes.home} /> : <div/>
    }

    render() {
        return (
            <div className="main-container">
                {this.redirectToHome()}
                
                <AvatarHeader
                    elem={this.state.group}
                    isGroup={true}
                />

                <SimpleSearchBar
                    placeholder="Cerca amico"
                    value={this.state.filter}
                    onChange={this.onFilter}
                />

                {this.getAllFriends()}
            </div>
        )
    }
}

export { GroupInfo, GroupAdder }