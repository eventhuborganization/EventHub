import React from 'react';
import Axios from 'axios';
import Notification from "./Notification";
import {LoginRedirect} from "../redirect/Redirect";

class Notifications extends React.Component {

    constructor(props) {
        super(props)
        let timestamp = new Date().toString()
        this.state = {
            notifications: [
                {
                    _id: "0",
                    typology: 0,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "1",
                    typology: 1,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "2",
                    typology: 2,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "3",
                    typology: 3,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "4",
                    typology: 4,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "5",
                    typology: 5,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "6",
                    typology: 6,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "7",
                    typology: 7,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "8",
                    typology: 8,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                },
                {
                    _id: "9",
                    typology: 9,
                    sender: {
                        _id: "2",
                        name: "Stefano",
                        surname: "Righini",
                        avatar: "gatto.jpeg"
                    },
                    event: {
                        name: "Evento della madonna",
                        thumbnail: "party.jpg",
                        _id: "3",
                        typology: "party"
                    },
                    timestamp: timestamp
                }
            ]
        }
        console.log(this.props.mainServer + "/notifications/" + this.props.match.params.fromIndex)
        if (true)
            Axios.get(this.props.mainServer + "/notifications/" + this.props.match.params.fromIndex)
                .then(response => {
                    let status = response.status
                    if (status !== 200) {
                        props.onError("Errore durante il caricamento delle notifiche.")
                    }
                    else
                        this.setState({ notifications: response })
                })
                .catch(error => props.onError("Errore durante il caricamento delle notifiche."))
    }

    render() {
        return (
            <div>
                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
                <section className="row sticky-top shadow bg-white border-bottom border-primary text-center">
                    <h1 className="col ml-1">Notifiche</h1>
                </section>

                <main className="main-container">
                    {
                        this.state.notifications.map(notification =>
                            <Notification {...this.props}
                                          key={notification._id}
                                          notification={notification}
                            />)
                    }
                </main>
            </div>
        )
    }
}

export default Notifications