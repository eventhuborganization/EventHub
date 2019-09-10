import React from 'react'
import { Redirect } from 'react-router-dom'

import './Badges.css'

import { LoginRedirect } from '../redirect/Redirect'
import LoadingSpinner from '../loading_spinner/LoadingSpinner'
import AvatarHeader from '../avatar_header/AvatarHeader'
import ScrollableMenu from '../menu/ScrollableMenu'
import Api from '../../services/api/Api'
import { RoundedSmallImage } from '../image/Image'


let routes = require("../../services/routes/Routes")

export default class Badges extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            redirectHome: false,
            badges: [],
            showBadges: true
        }
        Api.getUserProgress(
            this.props.user._id,
            () => this.props.onError("Errore nel caricare i badge, ricarica."),
            result => {
                this.setState({badges: result})
            }
        )
    }

    componentDidMount() {
        if (this.props.user.organization) {
            this.props.onError(
                "Non sei autorizzato, verrai ridirezionato alla homepage", () => {},
                () => this.setState({redirectHome: true})
            )
        }
    }



    redirectToHome = () => {
        return this.state.redirectHome ? <Redirect to={routes.home} /> : <div/>
    }

    renderBadges = () => {
        if(this.state.showBadges && this.state.badges.length > 0){
            return (
                <div>
                    <AvatarHeader elem={this.props.user} />

                    <div className="mt-3">
                        <ScrollableMenu title={"I miei badge"} id="myBadges">    
                        {
                            this.state.badges
                                    .filter(badge => badge.acquired)
                                    .map(badge => 
                                        <div key={badge._id} className="border-bottom">
                                            <BadgeElement badge={badge} />
                                        </div>
                                    )
                        }
                        </ScrollableMenu>
                    </div>

                    <div className="mt-3">
                        <ScrollableMenu title={"Prossimi badge"} id="badges">    
                        {
                            this.state.badges
                                    .filter(badge => !badge.acquired)
                                    .map(badge => 
                                        <div key={badge._id} className="border-bottom">
                                            <BadgeElement badge={badge} addRequirements={true}/>
                                        </div>
                                    )
                        }
                        </ScrollableMenu>
                    </div>
                </div>)
        } else {
            return <LoadingSpinner />
        }
    }

    render = () => {
        return (
            <div className="main-container">

                {this.redirectToHome()}

                <section className="row sticky-top shadow bg-white border-bottom border-primary text-center">
                    <h2 className="col ml-1 page-title">I miei badge</h2>
                </section>

                {this.renderBadges()}
                
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />

            </div>
        )
    }

}

function BadgeElement(props){
    let x = 0
    return (
        <div className="border-bottom">
            <div className={"row py-2 d-flex align-items-center"}>
                <div className="col-4 col-md-2 d-flex justify-content-center">
                    <RoundedSmallImage 
                        imageName={props.badge.icon}
                        alt={props.badge.description}
                        badge={true}
                    />
                </div>
                <div className="col px-0">
                    <h4 className={"mb-0 badge-name"}>{props.badge.name}</h4>
                    <div className={"badge-description"}>{props.badge.description}</div>
                </div>
                
            </div>
            {
                props.addRequirements ? 
                    <div className={"row py-2 d-flex align-items-center"}>
                        <div className={"col-12"}>
                            <ul style={{listStyle: "none", paddingLeft: 0}}>
                                {
                                    props.badge.requirements.map(req => {
                                        x++
                                        let percentage = 0
                                        if(req.achieved)
                                            percentage = (req.achieved / req.quantity) * 100
                                        return (
                                        <li key={"cond-" + x}> 
                                            <div>
                                                <span className="badge-description">{req.action.desc_it}</span> <br/>
                                                <div className="progress badge-progress-bar">
                                                    <div className="progress-bar progress-bar-striped badge-description" role="progressbar"
                                                        style={{width: percentage + "%"}}
                                                        aria-valuemin="1"
                                                        aria-valuemax={req.quantity}
                                                        aria-valuenow={req.achieved ? req.achieved : 0}
                                                    >{req.achieved ? req.achieved : ""}</div>
                                                </div>
                                            </div>
                                        </li>
                                    )})
                                }
                            </ul>
                        </div>
                    </div> :
                    <div/>
            }
            
        </div>
    )
}

