const EventServiceAPI = require('../API/EventServiceAPI.js')
const UserService = require('../API/UserServiceAPI')

const EventService = new EventServiceAPI.EventService(EventServiceHost, EventServicePort)

exports.partecipateActions = () => {
    let temp = Date.now()
    let data = {
        date:{
            operator: '=',
            value: `${temp.getUTCMonth()}-${temp.getUTCDate()-1}-${temp.getUTCMonth()}`
        }
    }
    EventService.getEvent(data,
        response => {
            response.data.forEach(event => {
                event.participants.forEach(user => {
                    addParticipationAction(user)
                })
            })
        }
    )
}

exports.reviewActions = () => {
    let temp = Date.now()
    let data = {
        date:{
            operator: '=',
            value: `${temp.getUTCMonth()}-${temp.getUTCDate() - 2}-${temp.getUTCMonth()}`
        }
    }
    EventService.getEvent(data,
        response => {
            response.data.forEach(event => {
                UserService.getEventReviews(event._id)
                .then(response => {
                    let reviews = response.data
                    let counter = 0
                    let all_value = 0
                    reviews.forEach(review => {
                        counter++
                        all_value += review.evaluation
                    })
                    if(all_value/counter >= 3){
                        addScoreMeanAction(event.organizator, true)
                    } else{
                        addScoreMeanAction(event.organizator, false)
                    }
                })
            })
        }
    )
}

let addParticipationAction = (user, counter = 3) => {
    UserService.addAction(user, 2)
    .catch(() => {
        if(counter !== 0)
            addParticipationAction(user, --counter)
    })
}

let addScoreMeanAction = (organizator, isScorePositive = true, counter = 3) => {
    UserService.addAction(organizator, isScorePositive ? 4 : 5)
    .catch(() => {
        if(counter !== 0)
        addScoreMeanAction(organizator, isScorePositive, --counter)
    })
}