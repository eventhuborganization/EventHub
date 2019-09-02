import React from "react"
import {FriendsTab} from "../menu_tab/MenuTab"
import {LoginRedirect} from "../redirect/Redirect"
import ApiService from "../../services/api/Api"
import {Redirect} from "react-router-dom"
import {LinkMakerBanner, INVITE_BUTTON, INVITED_BUTTON} from "../link_maker_banner/LinkMakerBanner"
import LocalStorage from "local-storage"
import {EventHeaderBanner} from "../event/Event"
import { SimpleSearchBar } from "../search_bar/SearchBar"

let routes = require("../../services/routes/Routes")

class Invite extends React.Component {

    buttonId = "friendGroupBtn"
    #inviteEventStateLocalStorageName = "invite-event"

    constructor(props) {
        super(props)
        let localSavedEvent = LocalStorage(this.#inviteEventStateLocalStorageName)
        let event = props.location.event || undefined
        if (!event && localSavedEvent)
            event = localSavedEvent
        this.state = {
            filter: "",
            linkedUsers: [],
            groups: [],
            event: event,
            redirectHome: false
        }
        if (props.isLogged && event) {
            LocalStorage(this.#inviteEventStateLocalStorageName, this.state.event)
            ApiService.getUserInformation(props.user._id, () => {},user => {
                let users = user.linkedUsers
                    .filter(friend => !friend.organization)
                    .sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                this.setState({linkedUsers: users})
            })
            ApiService.getGroups(() => {}, groups => this.setState({groups: groups}))
        }
    }

    componentDidMount() {
        if (!(this.props.isLogged && this.state.event)) {
            this.props.onError(
                "Non sei autorizzato, verrai ridirezionato alla homepage", () => {},
                () => this.setState({redirectHome: true})
            )
        }
    }

    onFilter = (event) => {
        this.setState({filter: event.target.value})
    }

    cannotInvite = (friend) => {
        return !this.props.isLogged || (friend && friend.eventsSubscribed && friend.eventsSubscribed.includes(this.state.event._id))
    }

    inviteFriend = friend => {
        this.setButtonEnabled(friend, false)
        ApiService.inviteGroup(friend._id, this.state.event._id,
            () => {
                this.props.onError("Non è stato possibile invitare il tuo amico all'evento, riprovare.")
                this.setButtonEnabled(friend, true)
            },() => {})
    }

    inviteGroup = group => {
        this.setButtonEnabled(group, false)
        ApiService.inviteGroup(group._id, this.state.event._id,
            () => {
                this.props.onError("Non è stato possibile invitare questo gruppo all'evento, riprovare.")
                this.setButtonEnabled(group, true)
            },() => {})
    }

    setButtonEnabled = (elem, enabled) => {
        let button = document.getElementById(this.buttonId + elem._id)
        if (enabled) {
            button.innerHTML = "Invita"
            button.classList.remove("disabled")
        } else {
            button.innerHTML = "Invitato"
            button.classList.add("disabled")
        }
        button.blur()
    }

    getAllFriends = () => {
        return this.getFriends(
            elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()),
            elem => !this.cannotInvite(elem),
            elem => this.inviteFriend(elem)
        )
    }

    getAllGroups = () => {
        return this.getGroups(
            elem => elem.name.toLowerCase().includes(this.state.filter.toLowerCase()) && this.cannotInvite(elem),
            () => true,
            elem => this.inviteGroup(elem)
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
                                     buttonType={enabled ? INVITE_BUTTON : INVITED_BUTTON}
                                     buttonId={this.buttonId + elem._id}
                                     buttonDisabled={!enabled}
                    />
                )
            })
    }

    getGroups = (filterFun, showFun, fun) => {
        let x = 0;
        return this.state.groups
            .filter(elem => filterFun(elem))
            .map(elem => {
                let id = "group" + x++
                return (
                    <LinkMakerBanner key={id}
                                     border={true}
                                     elem={elem}
                                     onClick={() => fun(elem)}
                                     showButton={showFun(elem)}
                                     buttonType={INVITE_BUTTON}
                                     isGroup={true}
                                     buttonId={this.buttonId + elem._id}
                    />
                )
            })
    }

    createSingleTab = (tag, elem) => {
        return Object.freeze({ tag: tag, elem: elem})
    }

    redirectToHome = () => {
        return this.state.redirectHome ? <Redirect to={routes.home} /> : <div/>
    }

    render() {
        let tabs = []
        if(this.props.isLogged){
            tabs.push(
                this.createSingleTab("Amici", this.getAllFriends()),
                this.createSingleTab("Gruppi", this.getAllGroups())
            )
        }
        return (
            <div className="main-container">
                {this.redirectToHome()}
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                <EventHeaderBanner event={this.state.event} hidePlace={true} />
                <SimpleSearchBar
                    placeholder="Cerca"
                    value={this.state.filter}
                    onChange={this.onFilter}
                />
                <FriendsTab tabs={tabs} />
            </div>
        )
    }
}

export default Invite