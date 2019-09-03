import React from "react"
import {PLACEHOLDER_USER_CIRCLE, RoundedSmallImage} from "../image/Image"
import ShowMore from "react-show-more"
import ApiService from "../../services/api/Api"
import {Link} from "react-router-dom";
import TrackVisibility from "react-on-screen";
import {EventHeaderBanner} from "../event/Event";

let REVIEW_FOR_EVENT = 0
let MY_REVIEW = 1
let REVIEW_FOR_MY_EVENT = 2

class Review extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            event: undefined,
        }
    }

    render() {
        return (
            <TrackVisibility key={"review-tracker-" + this.props.review._id} partialVisibility={true} once={true}>
                {({ isVisible }) => {
                    if (isVisible) {
                        if ((this.props.type === REVIEW_FOR_MY_EVENT || this.props.type === MY_REVIEW) && !this.state.event) {
                            ApiService.getEventInformation(this.props.review.eventId,
                                () => this.setState(prevState => {
                                        let state = prevState
                                        state.event = {
                                            _id: "sfgdfgdf",
                                            name: "pipponi",
                                            avatar: "pipponi",
                                            typology: "sport"
                                        }
                                        return state
                                    }),
                                event => this.setState(prevState => {
                                    let state = prevState
                                    state.event = event
                                    return state
                                })
                            )
                        }
                    }
                    return (
                        <div className={"row mt-2 mx-1"}>
                            <div className="col-12 card shadow">
                                <div className="card-body container-fluid">
                                    {
                                        this.props.type === MY_REVIEW
                                            ? <ReviewEventInfo
                                                event={this.state.event}
                                                evaluation={this.props.review.evaluation}
                                            />
                                            : <ReviewUserInfo
                                                user={this.props.review.writer}
                                                evaluation={this.props.review.evaluation}
                                            />
                                    }
                                    <div className={"row mt-2"}>
                                        <div className={"col-12 px-1 border"} style={{minHeight: "8rem"}}>
                                            <ShowMore
                                                lines={5}
                                                more='Altro'
                                                less='Mostra meno'
                                            >
                                                {this.props.review.text}
                                            </ShowMore>
                                        </div>
                                    </div>
                                    <ReviewEventInfo data={this.state.footerData}/>
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
        props.data ? <div className={"row"}>
            <div className="col-3 px-0 my-auto">
                <RoundedSmallImage placeholderType={PLACEHOLDER_USER_CIRCLE} alt={"Immagine profilo utente"} />
            </div>
            <div className="col-9 d-flex flex-column justify-content-center px-1">
                <span className="text-invited font-weight-bold">{props.user.name} {props.user.surname}</span>
                <ReviewEvaluation evaluation={props.evaluation}/>
            </div>
        </div> : <div/>
    )
}

/**
 * @param props {{
 *         event: {
 *             _id: string,
 *             name: string,
 *             typology: string
 *         },
 *         showEvaluation: boolean,
 *         evaluation: number
 * }}
 * @constructor
 */
let ReviewEventInfo = props => {
    return (
        <div className={"row mt-2"}>
            <div className={"col-12"}>
                {
                    props.event ?
                        <Link to={""}>
                            <EventHeaderBanner isLite={true} event={props.event} />
                        </Link>
                        : <div/>
                }
            </div>
            <div className={"col-12 mt-1 px-0"}>
                {props.evaluation ? <ReviewEvaluation evaluation={props.evaluation} /> : <div/>}
            </div>
        </div>
    )
}

export {Review, REVIEW_FOR_EVENT, MY_REVIEW, REVIEW_FOR_MY_EVENT}