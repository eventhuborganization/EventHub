import React from 'react'
import Api from '../../services/api/Api'

import './Friends.css'
import {UserBanner} from '../link_maker_banner/LinkMakerBanner'
import MultipleElementsCard from '../multiple_elements_card/MultipleElementsCard'

class Friends extends React.Component {

    constructor(props){
        super(props)

        let user = props.loggedUser
        if(!user.linkedUsers) {
            user.linkedUsers = []
        }

        this.state = {
            loggedUser : user,
            filter: "",
            searchComplete: false,
            friendsArray: user.linkedUsers.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
            friends: [],
            organizations: [],
            users: []
        }
        this.state.friends = this.getAllFriends(() => true)
        if(this.state.friends.length <= 0){
            this.state.friends = <EmptyList description={user.organization ? 
                <div>Non hai follower</div> : 
                <div>La tua lista amici è vuota.<br/>Incontra nuova gente!</div>}
            />
        } else {
            Api.getUsersInformation(
                this.state.friendsArray,
                () => {},
                result => {
                    result.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                    let friends = this.mapArrayToUserBanner(
                        result,
                        () => false,
                        () => {}
                    )
                    this.setState({
                        friendsArray: result,
                        friends: friends
                    })
                    this.props.updateUser([[result, "linkedUsers"]])
                })
        }
    }

    onFilter = (event) => {
        let value = event.target.value
        if(value === ""){
            this.setState({
                filter: value, 
                searchComplete: false, 
                friends: this.getAllFriends(() => true)
            })
        } else {
            this.setState({filter: value})
        }
    }

    searchPeople = (event) => {
        event.preventDefault()
        Api.searchUsers(
            this.state.filter,
            () => {
                let friends = this.getAllFriends(elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()))
                this.setState({friends: friends})
                this.props.onError("Si è verificato un errore durante la ricerca, riprovare.")
            },
            result => {
                let users = []
                let organizations = []
                let friends = this.getAllFriends(elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()))
                result.users.forEach(user => {
                    if(user.organization){
                        organizations.push(user)
                    } else {
                        users.push(user)
                    }
                })
                users = this.fromUsersToUserBanner(users)
                organizations = this.fromUsersToUserBanner(organizations)

                this.setState({
                    friends: friends,
                    users: users,
                    organizations: organizations,
                    searchComplete: true
                })
            })
    }

    addFriend = (friend) => {
        let errorFun = () => this.props.onError("Si è verificato un errore durante la richesta, riprova")
        if(friend.organization){
            Api.followOrganization(
                friend._id,
                errorFun,
                () => {
                    this.disableFriendButton(friend, "Segui")
                    this.setState((prevState) => {
                        let state = prevState
                        state.friendsArray.push(friend)
                        state.friendsArray.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                        return state
                    })
                }
            )
        } else {
            Api.sendFriendshipRequest(
                friend._id,
                errorFun,
                () => this.disableFriendButton(friend, "In Attesa")
            )
        }
    }

    disableFriendButton = (friend, text) => {
        let button = document.getElementById("friendBtn" + friend._id)
        button.innerHTML = text
        button.classList.add("disabled")
        button.blur()
    }

    cantAddFriend = (friend) => {
        return !this.props.isLogged || this.state.loggedUser.organization || 
        this.state.friendsArray.includes(friend) || friend._id === this.state.loggedUser._id
    }

    getAllFriends = (filterFriends) => {
        return this.mapArrayToUserBanner(
                    this.state.friendsArray
                        .filter(filterFriends),
                    () => false,
                    () => {}
        )
    }

    fromUsersToUserBanner = (array) => {
        return this.mapArrayToUserBanner(
            array, 
            elem => !this.cantAddFriend(elem),
            elem => this.addFriend(elem)
        )
    }

    mapArrayToUserBanner = (array, showFun, onAddFriendFun) => {
        let x = 0;
        return array.map(elem => {
                        let id = "friend" + x++
                        return (
                            <UserBanner key={id}
                                user={elem}
                                showAddFriendButton={showFun(elem)}
                                onAddFriend={() => onAddFriendFun(elem)}
                            />
                        )
        })
    }

    render = () => {
        return (
            <div className="main-container">
                <nav className="sticky-top row navbar navbar-light bg-light border-bottom border-primary px-0">
                    <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold">EH</h1>
                    <form className="col form-inline container-fluid px-1" onSubmit={this.searchPeople}>
                        <div className="row w-100 mx-0 d-flex justify-content-between">
                            <label htmlFor="tf-search" className="d-none">Cerca persona</label>
                            <label htmlFor="btn-search" className="d-none">Bottone di ricerca</label>
                            <input
                                className="col-9 form-control"
                                id="tf-search" 
                                name="tf-search" 
                                type="search" 
                                placeholder="Cerca una persona"
                                value={this.state.filter}
                                onChange={this.onFilter}
                            />
                            <button id="btn-search" name="btn-search" className="col ml-1 btn btn-success" type="submit">
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </button>
                        </div>
                    </form>
                </nav>
                {
                    this.props.isLogged || this.state.searchComplete ? 
                        <div className="mt-1">
                            <MultipleElementsCard
                                title={"I tuoi " + (this.state.loggedUser.organization ? "follower" : "amici")}
                                elements={this.state.friends}
                                showAll={!this.state.searchComplete}
                                show={this.props.isLogged}
                            />
                            <MultipleElementsCard
                                title="Persone"
                                elements={this.state.users}
                                margin={"mt-2"}
                                showAll={false}
                                show={this.state.searchComplete}
                            />
                            <MultipleElementsCard
                                title="Organizzazioni"
                                elements={this.state.organizations}
                                margin={"mt-2"}
                                showAll={false}
                                show={this.state.searchComplete}
                            />
                        </div> : <EmptyList description="Esegui il login per vedere i tuoi amici" backAndBorder={true}/>
                }
            </div>
        )
    }
}

function EmptyList(props){
    return (
        <div className="row">
            <div className={"col-10 mx-auto p-3 " +  (props.backAndBorder ? "mt-2 empty-friend-custom-list" : "empty-friend-list")}>
                {props.description}
            </div>
        </div>
    )
}

export default Friends