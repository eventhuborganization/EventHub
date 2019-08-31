import React from "react"
import {FriendsTab} from "../menu_tab/MenuTab"
import {LoginRedirect} from "../redirect/Redirect"
import ApiService from "../../services/api/Api"
import {Link, Redirect} from "react-router-dom";
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image";

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
            },
            redirectHome: false
        }
        if (props.isLogged && props.location && props.location.event && props.location.event._id) {
            ApiService.getUserInformation(props.user._id, () => {},user => {
                this.setState({
                    linkedUsers: user.linkedUsers.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                })
            })
            ApiService.getGroups(() => {}, groups => this.setState({groups: groups}))
        }
    }

    componentDidMount() {
        if (!(this.props.isLogged && this.props.location && this.props.location.event && this.props.location.event._id)) {
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

    redirectToHome = () => {
        return this.state.redirectHome ? <Redirect to={"/"} /> : <div/>
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

const INVITE_BUTTON = 0
const ADD_FRIEND_BUTTON = 1

/**
 *
 * @param props {{
 *     elem: {
 *         _id: string,
 *         name: string,
 *         surname: string,
 *         avatar: string,
 *         organization: boolean,
 *         address: {
 *             city: string
 *         }
 *     }
 *     isGroup: boolean,
 *     onClick: function,
 *     showButton: boolean,
 *     buttonType: number,
 *     buttonId: string
 * }}
 * @return {*}
 * @constructor
 */
let LinkMakerBanner = props => {
    let buttonText = ""
    switch(props.buttonType) {
        case INVITE_BUTTON:
            buttonText = "Invita"
            break
        case ADD_FRIEND_BUTTON:
            buttonText = props.elem.organization ? "Segui" : "Aggiungi"
            break
        default: break
    }
    return props.elem.name && (props.isGroup ? props.buttonType !== ADD_FRIEND_BUTTON : true) ? (
        <div className={"row py-2 d-flex align-items-center" + (!!props.border ? " border-bottom" : "")}>
            <Link
                to={"/users/" + props.elem._id}
                className={"col-4 col-md-2 col-lg-1" + (props.elem.avatar ? "" : " d-flex align-self-stretch")}
                style={{textDecoration: "none"}}
            >
                <RoundedSmallImage imageName={props.elem.avatar} placeholderType={PLACEHOLDER_USER_CIRCLE}/>
            </Link>
            <Link to={"/users/" + props.elem._id} className="col px-0" style={{textDecoration: "none"}}>
                <div className="font-weight-bold text-dark">{props.elem.name}</div>
                {
                    props.isGroup
                        ? <div/>
                        : <div className="text-muted small">
                            {props.elem.organization ? "Organizzazione" : "Utente"} - {props.elem.city}
                        </div>
                }
            </Link>
            <div className="col-3 text-center px-0">
                {
                    props.showButton ?
                        <button id={props.buttonId} className="btn btn-sm btn-primary" onClick={props.onClick}>
                            {buttonText}
                        </button> : <div/>
                }
            </div>
        </div>
    ) : <div/>
}

export default Invite