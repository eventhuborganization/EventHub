import React from "react"
import { Redirect } from 'react-router-dom'

import ApiService from "../../services/api/Api"
import { EventHeaderBanner } from "../event/Event"
import {Review, REVIEW_FOR_EVENT, MY_REVIEW, RECEIVED_REVIEW} from "./Review"
import LocalStorage from "local-storage"
import NoItemsPlaceholder from "../no_items_placeholder/NoItemsPlaceholder"
import { LoginRedirect } from "../redirect/Redirect"
import LoadingSpinner from "../loading_spinner/LoadingSpinner"

let routes = require("../../services/routes/Routes")

class Reviews extends React.Component {

    #reviewsLocalStorageName = "reviews-data"

    constructor(props) {
        super(props)
        let eventId = props.location.event ? props.location.event._id : undefined
        let localData = LocalStorage(this.#reviewsLocalStorageName)
        let type = MY_REVIEW
        if (eventId)
            type = REVIEW_FOR_EVENT
        else if (props.location.receivedReviews)
            type = RECEIVED_REVIEW
        else if (props.location.myReview)
            type = MY_REVIEW
        else if (localData && localData.type >= 0) {
            type = localData.type
            eventId = localData.eventId
        }
        let dataToSave = {
            type: type,
            eventId: eventId
        }
        LocalStorage(this.#reviewsLocalStorageName, dataToSave)
        this.state = {
            eventId: eventId,
            event: undefined,
            displayReviews: true,
            reviews: [],
            type: type
        }
    }

    componentDidMount() {
        let errorFun = (err) => {
            if(err.response.status !== 404) {
                this.props.onError("Errore nel caricare le recensioni, ricarica la pagina")
            }
            this.setState({displayReviews: false})
        }

        let reviewsFun = (reviews) => {
            if(reviews.length > 0){
                this.setState({reviews: reviews})
            } else {
                this.setState({displayReviews: false})
            }
        }

        switch(this.state.type) {
            case REVIEW_FOR_EVENT:
                ApiService.getEventInformation(this.state.eventId,
                    () => {},
                    event => this.setState({event: event})
                )
                ApiService.getReviewsForEvent(this.state.eventId,
                    errorFun,
                    reviewsFun
                )
                break
            case MY_REVIEW:
                ApiService.getWrittenReviews(this.props.user._id,
                    errorFun,
                    reviewsFun
                )
                break
            case RECEIVED_REVIEW:
                ApiService.getReceivedReviews(this.props.user._id,
                    errorFun,
                    reviewsFun
                )
                break
            default: break
        }
    }

    renderHeader = () => {
        if (this.state.event && this.state.type === REVIEW_FOR_EVENT)
            return <EventHeaderBanner event={this.state.event} hidePlace={true} />
        else if (this.props.user && this.state.type === MY_REVIEW)
            return <div/>
        else
            return <div/>
    }

    renderTitle = () => {
        switch(this.state.type) {
            case MY_REVIEW: return <h2 className={"m-0 py-1 border-bottom border-primary"}>Le mie recensioni</h2>
            case RECEIVED_REVIEW: return <h2 className={"m-0 py-1 border-bottom border-primary"}>Recensioni ricevute</h2>
            case REVIEW_FOR_EVENT:
            default: return <div/>
        }
    }

    renderPlaceholder = () => {
        switch(this.state.type) {
            case MY_REVIEW: return "Non hai ancora scritto una recensione"
            case RECEIVED_REVIEW: return "Non hai ancora ricevuto nessuna recensione"
            case REVIEW_FOR_EVENT: return "Non sono state scritte recensioni per questo evento"
            default: return ""
        }
    }

    redirectHome = () => {
        return this.state.type === MY_REVIEW && this.props.user.organization ? <Redirect to={routes.home} /> : <div/>
    }

    renderReviews = () => {
        if(this.state.displayReviews && this.state.reviews.length > 0) {
            return this.state.reviews.map(review => 
                <Review type={this.state.type} key={"review " + review._id} review={review} />
            )
        } else if(this.state.displayReviews) {
            return <LoadingSpinner />
        } else {
            return <NoItemsPlaceholder placeholder={this.renderPlaceholder()} />
        }
    }

    render() {
        return (
            <main className={"main-container"}>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                {this.redirectHome()}

                <section className="row sticky-top shadow bg-white text-center">
                    <div className={"col-12"}>{this.renderHeader()}</div>
                    <div className={"col-12 text-center bg-white px-0"}>{this.renderTitle()}</div>
                </section>
                <div>
                    {this.renderReviews()}
                </div>
            </main>
        )
    }
}

export default Reviews