import React from "react"
import ApiService from "../../services/api/Api"
import {EventHeaderBanner} from "../event/Event"
import {Review, REVIEW_FOR_EVENT, MY_REVIEW, REVIEW_FOR_MY_EVENT} from "./Review"
import {UserBanner} from "../link_maker_banner/LinkMakerBanner";

class Reviews extends React.Component {

    constructor(props) {
        super(props)
        let eventId = props.location.event ? props.location.event._id : undefined
        let type = MY_REVIEW
        if (eventId)
            type = REVIEW_FOR_EVENT
        else if (props.location.madeFromOthersToMe)
            type = REVIEW_FOR_MY_EVENT
        let dummyReviews = []
        for (let i = 0; i < 1; i++) {
            dummyReviews.push({
                _id: "r" + i,
                writer: {
                    name: "Stefano",
                    surname: "Righini",
                    avatar: "sdfgdfgfd"
                },
                eventId: "sdgdsfgdfgvsdfllikk",
                date: new Date(),
                text: "la recensione della vita delle vite gaiusfgiuasdghf asasgidgashdifu asdasiudghasiudgsai diasg diusaghiduhasiudhasoijdoashdoiashdabdchbiuew fcisdwaghfiuashdi usa hidfuhsaiudfh as",
                evaluation: 4
            })
        }
        this.state = {
            eventId: eventId,
            event: undefined,
            reviews: dummyReviews,
            reviewsToShow: [],
            lastReviewFilled: 0,
            type: type
        }
    }

    componentDidMount() {
        switch(this.state.type) {
            case REVIEW_FOR_EVENT:
                ApiService.getEventInformation(this.state.eventId,
                    () => {},
                    event => this.setState({event: event})
                )
                ApiService.getReviewsForEvent(this.state.eventId,
                    () => {},
                    reviews => this.setState({reviews: reviews})
                )
                break
            case MY_REVIEW:
                //get writtenReviews
                break
            case REVIEW_FOR_MY_EVENT:
                //get receivedReviews
                break
            default: break
        }
    }

    renderHeader = () => {
        if (this.state.event && this.state.type === REVIEW_FOR_EVENT)
            return <EventHeaderBanner event={this.state.event} />
        else if (this.props.user && this.state.type === MY_REVIEW)
            return <UserBanner user={this.props.user} isLite={true} />
        else
            return <div/>
    }

    renderTitle = () => {
        return "Recensioni"
    }

    render() {
        return (
            <main className={"main-container"}>
                <section className="row sticky-top shadow bg-white border-bottom border-primary text-center">
                    <div className={"col-12"}>{this.renderHeader()}</div>
                    <h1 className="col-12">{this.renderTitle()}</h1>
                </section>
                <div>
                    {this.state.reviews.map(review => <Review type={this.state.type} key={"review " + review._id} review={review} />)}
                </div>
            </main>
        )
    }
}

export default Reviews