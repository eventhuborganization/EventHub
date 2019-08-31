import React from "react"
import {FriendsTab} from "../menu_tab/MenuTab"
import {LoginRedirect} from "../redirect/Redirect"
import ApiService from "../../services/api/Api"
import { LinkMakerBanner, INVITE_BUTTON } from "../link_maker_banner/LinkMakerBanner"

class Invite extends React.Component {

    buttonId = "friendGroupBtn"

    constructor(props) {
        super(props)
        this.state = {
            filter: "",
            linkedUsers: [],
            groups: [],
            event: {
                _id: props.location.event ? props.location.event._id : undefined
            }
        }
        ApiService.getUserInformation(props.user._id, () => {},user => {
            this.setState({
                linkedUsers: user.linkedUsers.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
            })
        })
        ApiService.getGroups(() => {}, groups => this.setState({groups: groups}))
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
                return (
                    <LinkMakerBanner key={id}
                                     border={true}
                                     elem={elem}
                                     onClick={() => fun(elem)}
                                     showButton={showFun(elem)}
                                     buttonType={INVITE_BUTTON}
                                     buttonId={this.buttonId + elem._id}
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

    render = () => {
        let tabs = []
        if(this.props.isLogged){
            tabs.push(
                this.createSingleTab("Amici", this.getAllFriends()),
                this.createSingleTab("Gruppi", this.getAllGroups())
            )
        }
        return (
            <div className="main-container">
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                <form className="row mb-2 sticky-top bg-white py-2">
                    <label htmlFor="tf-search" className="d-none">Cerca amico</label>
                    <input
                        className="col-11 mx-auto form-control"
                        id="tf-search"
                        name="tf-search"
                        type="search"
                        placeholder="Cerca"
                        value={this.state.filter}
                        onChange={this.onFilter}/>
                </form>
                <FriendsTab tabs={tabs} />
            </div>
        )
    }
}

export default Invite