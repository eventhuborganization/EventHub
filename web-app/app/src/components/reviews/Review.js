import React from "react"
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image"
import ShowMore from "react-show-more"
import ApiService from "../../services/api/Api"
import {Link} from "react-router-dom";
import TrackVisibility from "react-on-screen";
import {EventHeaderBanner} from "../event/Event"

let routes = require("../../services/routes/Routes")

let REVIEW_FOR_EVENT = 0
let MY_REVIEW = 1
let RECEIVED_REVIEW = 2

class Review extends React.Component {

    constructor(props) {
        console.log(props)
        super(props)
        this.state = {
            writer: undefined,
            event: undefined
        }
    }

    render() {
        return (
            <TrackVisibility key={"review-tracker-" + this.props.review._id} partialVisibility={true} once={true}>
                {({ isVisible }) => {
                    if (isVisible) {
                        if ((this.props.type === RECEIVED_REVIEW || this.props.type === MY_REVIEW) && !this.state.event) {
                            ApiService.getEventInformation(this.props.review.eventId,
                                () => {},
                                event => this.setState({event: event})
                            )
                        }
                        if ((this.props.type === RECEIVED_REVIEW || this.props.type === REVIEW_FOR_EVENT) && !this.state.writer) {
                            ApiService.getUsersInformation([this.props.review.writer],
                                () => {},
                                users => this.setState({writer: users[0]}))
                        }
                    }
                    return (
                        <div className={"row mt-2 px-3"}>
                            <div className="col-12 card shadow">
                                <div className="card-body container-fluid">
                                    {
                                        this.props.type === MY_REVIEW
                                            ? <ReviewEventInfo
                                                event={this.state.event}
                                                evaluation={this.props.review.evaluation}
                                            />
                                            : <ReviewUserInfo
                                                user={this.state.writer}
                                                evaluation={this.props.review.evaluation}
                                            />
                                    }
                                    <div className={"row mt-2"}>
                                        <div className={"col-12 px-1 border"} style={{minHeight: "6rem"}}>
                                            <ShowMore
                                                lines={5}
                                                more='Altro'
                                                less='Mostra meno'
                                            >
                                                {this.props.review.text}
                                            </ShowMore>
                                        </div>
                                    </div>
                                    {
                                        this.props.type === RECEIVED_REVIEW ?
                                            <ReviewEventInfo
                                                event={this.state.event}
                                                eventId={this.props.review.eventId}
                                            /> : <div/>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }}
            </TrackVisibility>
        )
    }
}

/**
 * @param props {{
 *     evaluation: number
 * }}
 * @return {*}
 * @constructor
 */
let ReviewEvaluation = props => {
    let stars = []
    for (let i = 0; i < 5; i++)
        stars.push(
            <em className={(i < props.evaluation ? " fas " : " far ") + " fa-star text-warning pr-2"}
                key={"star-" + i}>
            </em>)
    return (
        <div className={"d-flex justify-content-start align-items-center"}>
            {stars}
        </div>
    )
}

/**
 * @param props {{
 *     user: {
 *         name: string,
 *         surname: string,
 *         avatar: string
 *     },
 *     evaluation: number
 * }}
 * @return {*}
 * @constructor
 */
let ReviewUserInfo = props => {
    return (
        props.user ?
            <div className={"row"}>
                <div className="col-3 px-0 my-auto">
                    <RoundedSmallImage placeholderType={PLACEHOLDER_USER_CIRCLE} alt={"Immagine profilo utente"} />
                </div>
                <div className="col-9 d-flex flex-column justify-content-center px-1">
                    <span className="text-invited font-weight-bold">{props.user.name} {props.user.surname}</span>
                    <ReviewEvaluation evaluation={props.evaluation}/>
                </div>
            </div> :
            <h4>Caricamento informazioni recensore</h4>
    )
}

/**
 * @param props {{
 *         event: {
 *             _id: string,
 *             name: string,
 *             typology: string
 *         },
 *         eventId: string,
 *         evaluation: number
 * }}
 * @constructor
 */
let ReviewEventInfo = props => {
    return (
        <div className={"row mt-2"}>
            <div className={"col-12"}>
                <Link to={routes.event + "/" + props.eventId}>
                    {props.event ?
                        <EventHeaderBanner isLite={true} event={props.event} />
                        : "Vai all'evento"
                    }
                </Link>
            </div>
            <div className={"col-12 mt-1 px-0"}>
                {props.evaluation ? <ReviewEvaluation evaluation={props.evaluation} /> : <div/>}
            </div>
        </div>
    )
}

export {Review, REVIEW_FOR_EVENT, MY_REVIEW, RECEIVED_REVIEW}