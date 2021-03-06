const network = require('./network');
const axios = require('axios');
const event = require('../API/EventServiceAPI.js')
const UserService = require('../API/UserServiceAPI')

const EventService = new event.EventService(EventServiceHost, EventServicePort)


exports.getEventReviews = (req, res) => {
    axios.get(`${UserServiceServer}/events/${req.params.uuid}/reviews`)
        .then(response => network.replayResponse(response, res))
        .catch(error => network.replayError(error, res))
}

exports.newReview = (req, res) => {
    EventService.getEventById(req.params.uuid, 
        result => {
            if (new Date(result.data.eventDate) < new Date()) {
                let review = {}
                review.writer = req.user._id
                review.date = Date.now()
                review.event = req.params.uuid
                review.eventOrganizator = result.data.organizator
                if (req.body.text)
                    review.text = req.body.text
                if (req.body.evaluation && req.body.evaluation >= 0 && req.body.evaluation <= 5) {
                    review.evaluation = req.body.evaluation
                    axios.post(`${UserServiceServer}/users/${req.user._id}/reviews/written`, review)
                        .then(response => {
                            let tryAddReviewToEvent = (eventId, reviewId, counter) => {
                                EventService.addEventReviews(eventId, reviewId,
                                    () => {},
                                    () => {tryAddReviewToEvent(eventId,reviewId, --counter)})
                            }
                            tryAddReviewToEvent(review.event, response.data._id, 5)
                            UserService.addAction(req.user._id, 1)
                            network.replayResponse(response, res)
                        })
                        .catch(error => network.replayError(error, res))
                } else {
                    network.badRequest(res)
                }
            } else {
                network.badRequest(res)
            }
        }, () => network.badRequest(res))
}

exports.getUserReviewsDone = (req, res) => {
    axios.get(`${UserServiceServer}/users/${req.params.uuid}/reviews/written`)
        .then(response => network.replayResponse(response, res))
        .catch(error => network.replayError(error, res))
}

exports.getUserReviewsReceived = (req, res) => {
    axios.get(`${UserServiceServer}/users/${req.params.uuid}/reviews/received`)
        .then(response => network.replayResponse(response, res))
        .catch(error => network.replayError(error, res))
}