import React from 'react';
import styles from './UserProfile.module.css'
import {Link} from "react-router-dom"
import EventCard from '../event_card/EventCard'
import {MultipleElementsBanner, MultipleUsersBanner } from '../multiple_elements_banner/MultipleElementsBanner'
import {AVATAR, ImageForCard, RoundedBigImage} from '../image/Image'
import ResizeService from "../../services/Resize/Resize"

let routes = require("../../services/routes/Routes")

export function LinkedUsersBanner(props){
    return <MultipleUsersBanner
            level={"h6"} 
            users={props.linkedUsers}
            emptyLabel={props.emptyLabel}
            typology={props.typology}
            moreUsersLink={props.moreLinkedUsersLink}
            iconName={"user-friends"}
        />
}

export function ProfileBadge(props){
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    return (
        <div className={"text-primary border border-primary rounded-pill d-flex justify-content-between px-3 py-1 align-items-center " + styles.profileBadge}>
            <em className={iconClass}></em>
            <span className="ml-3">{props.number.toString().padStart(4, '0')}</span>
        </div>
    )
}

export function ProfileAction(props){
    let iconClass = props.iconName ? "fas fa-" + props.iconName : ""
    return props.show ? (
        <div id={props.id}>
            <button className="btn btn-lg btn-primary rounded-circle" onClick={props.actionSelected}>
                <em className={iconClass} aria-hidden="true"></em>
            </button>
        </div>
    ) : ""
}

export function BadgeBanner(props) {
    let badge = props.badge ? [
        <div className="col-12 d-flex align-items-center" key="lastBadge">
            <div className="row">
                <div className="col-4">
                    <RoundedBigImage
                        imageName={props.badge.icon}
                        alt={props.badge.description}
                        badge={true}
                    />
                </div>
                <div className="col-8 d-flex align-items-center">
                    <div>
                        <h4 className="mb-0">{props.badge.name}</h4>
                        <div>{props.badge.description}</div>
                    </div>
                </div>
            </div>
        </div>]: 
        []
    return (
        <MultipleElementsBanner
            level={"h6"}
            elements={badge}
            title={"Ultimo badge ottenuto"}
            iconName={"award"}
            emptyLabel={props.emptyLabel}
        />
    ) 
}

export function EventsBanner(props) {
    let events = props.events.map(event =>
        <div key={event._id} className={"col-12 col-md-6 col-xl-3"}>
            <EventCard  eventInfo={event}
                        user={props.user}
                        onError={props.onError}
                        showReviewModal={props.showReviewModal}
                        isLogged={props.isLogged}
                        location={props.location}
            />
        </div>)
    let elements = events.length > 0 ?
        [
            <div key={props.title + "-elems"} className="container-fluid">
                <div className={"row"}>
                    {events}
                </div>
            </div>
        ] : []
    return (
        <MultipleElementsBanner
            level={"h6"}
            elements={elements}
            title={props.title}
            iconName={"glass-cheers"}
            emptyLabel={props.emptyLabel}
        />
    )
}

export function ProfileControls(props){
    return !props.isLocalUser && !props.isMyFriend ? "" : (
        <div className="container-fluid">
            <div className="row">
                {
                    props.isMyFriend ? 
                        <div className="col d-flex justify-content-start align-items-center px-2">
                            <div className={"border border-danger rounded-pill px-2 py-1 " + styles.friendRemove} onClick={props.removeClicked}>
                                <em className="fas fa-minus"></em> Rimuovi
                            </div>
                        </div>
                    : <div/>
                }
                
                {
                    props.isLocalUser ?
                    <div className={"col d-flex justify-content-end align-items-center px-2"}> 
                        <Link to={props.settingsLink}>
                            <em className={"fas fa-cog fa-lg " + styles.settingsIcon}></em>
                        </Link>
                    </div>
                    : <div/>
                }
            </div>
        </div>
    )
}

export class ProfileHeader extends React.Component {

    code = undefined

    constructor(props){
        super(props)
        let mode = this.displayWindowSize()
        this.state = {
            mode: mode
        }
    }

    displayWindowSize = () => {
        let width = window.innerWidth;
        let data = 0
        if(width < 768){
            data = 0
        } else if (width >= 768 && width < 992) {
            data = 1
        } else if (width >= 992 && width < 1200) {
            data = 2
        } else {
            data = 3
        }
        return data
    }

    componentDidMount = () => {
        this.code = ResizeService.addSubscription(() => {
            let mode = this.displayWindowSize()
            this.setState({mode: mode})
        })
    }

    componentWillUnmount() {
        if (this.code >= 0)
            ResizeService.removeSubscription(this.code)
    }

    render() {
        return (
            <div>
                <section className="row">
                    <div className="col-12 col-md-6 card bg-dark px-0">
                        <div className="card-img px-0 text-center bg-dark" style={{minHeight: 150}}>
                            <ImageForCard imageName={this.props.user.avatar} type={AVATAR}/>
                        </div>
                        <div className={"card-img-overlay text-white" + (this.state.mode === 0 ? "" : " d-none ")}>
                            <div className="d-flex align-items-start flex-column h-100">
                                <ProfileControls
                                    {...this.props}
                                    isLocalUser={this.props.isLocalUser}
                                    isMyFriend={this.props.isMyFriend}
                                    _id={this.props.user._id}
                                    settingsLink={routes.settings}
                                    removeClicked={this.props.removeUser}
                                />
                                <div className="container-fluid mt-auto">
                                    <div className="row">
                                        <div className="col d-flex justify-content-between px-2 align-items-center font-weight-bold">
                                            <ProfileBadge
                                                iconName={"trophy"}
                                                number={this.props.user.points >= 0 ? this.props.user.points : 0}
                                            />
                                            <ProfileAction
                                                id="addButton"
                                                iconName={"plus"}
                                                show={!this.props.isLocalUser && !this.props.isMyFriend
                                                && this.props.isLogged && !this.props.localUser.organization}
                                                actionSelected={this.props.addUser}
                                            />
                                            <ProfileAction
                                                iconName={"street-view"}
                                                show={!this.props.isLocalUser && this.props.isMyFriend && !this.props.user.organization && !this.props.localUser.organization && this.props.isLogged}
                                                actionSelected={this.props.requestPosition}
                                            />
                                            <ProfileBadge
                                                iconName={"users"}
                                                number={this.props.user.linkedUsers.length}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"col-md-6" + ((this.state.mode > 0 ? "" : " d-none "))}>
                        <ProfileInfo {...this.props} mode={this.state.mode} />
                    </div>
                </section>
                <div className={this.state.mode === 0 ? "" : " d-none "}>
                    <ProfileInfo {...this.props} mode={this.state.mode} />
                </div>
            </div>
        )
    }
}

class ProfileInfo extends React.Component {
    render() {
        let result = <div/>
        let basicInfo =
                    <div>
                        <h2 className={"mb-0"}>
                            {
                                this.props.user.organization ?
                                    <div><em className="text-secondary fas fa-user-tie"></em> {this.props.user.name}</div> :
                                    <div>{this.props.user.name + " " + this.props.user.surname}</div>
                            }
                        </h2>
                        <p className={"text-muted" + (this.props.user.organization ? " h6 " : " h5 ")}>
                            {
                                this.props.user.organization ?
                                    this.props.user.address.address + ", " +
                                    this.props.user.address.city + ", " +
                                    this.props.user.address.province :
                                    this.props.user.address.city
                            }
                        </p>
                    </div>

        let canAddUser = !this.props.isLocalUser && !this.props.isMyFriend
            && this.props.isLogged && !this.props.localUser.organization
        let canRequestPosition = !this.props.isLocalUser && this.props.isMyFriend
            && !this.props.user.organization && !this.props.localUser.organization && this.props.isLogged
        let canRemoveUser = !this.props.isLocalUser && this.props.isMyFriend

        let otherInfos =
            <div>
                <div className={"row"}>
                    <div className={"col-12 d-flex justify-content-around"}>
                        <ProfileBadge
                            iconName={"trophy"}
                            number={this.props.user.points >= 0 ? this.props.user.points : 0}
                        />
                        <ProfileBadge
                            iconName={"users"}
                            number={this.props.user.linkedUsers.length}
                        />
                    </div>
                </div>
                <div className={"mt-3"}>
                </div>
                <div className={"row" + (this.props.isLocalUser ? "" : " d-none")}>
                    <div className={"col-12"}>
                        <Link className={"btn btn-block btn-primary button-size"} to={routes.settings}>
                            Impostazioni
                        </Link>
                    </div>
                </div>
                <div className={"row" + (canAddUser ? "" : " d-none")}>
                    <div className={"col-12"}>
                        <button className={"btn btn-block btn-primary button-size"} onClick={this.props.addUser}>
                            {this.props.user.organization ? "Segui" : "Aggiungi amico"}
                        </button>
                    </div>
                </div>
                <div className={"row" + (canRequestPosition ? "" : " d-none")}>
                    <div className={"col-12"}>
                        <button className={"btn btn-block btn-primary button-size"} onClick={this.props.requestPosition}> Richiedi posizione </button>
                    </div>
                </div>
                <div className={(canRequestPosition ? "mt-2 " : "") + "row " + (canRemoveUser ? "" : " d-none")}>
                    <div className={"col-12"}>
                        <button className={"btn btn-block btn-danger button-size"} onClick={this.props.removeUser}>
                            {this.props.user.organization ? "Smetti di seguire" : "Rimuovi amico"}
                        </button>
                    </div>
                </div>
            </div>
        switch(this.props.mode) {
            case 0: result = <div className="col-12 text-center">{basicInfo}</div>
                break
            case 1:
            case 2: result =
                    <div className="col-12 text-center mt-2">
                        {basicInfo}
                        {otherInfos}
                    </div>
                break
            default: break
        }
        return (<section className={"row mt-2"}>{result}</section>)
    }
}