import React from 'react';
import './Home.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLogged: false,
            showNavbar: true
        }
    }

    render() {
        return (
            <div>
                <nav className="sticky-top row navbar navbar-light bg-light border-bottom border-primary px-0">
                    <h1 className="col-2 navbar-brand text-primary mx-0 mb-0 font-weight-bold">EH</h1>
                    <form className="col-10 form-inline container-fluid px-1">
                        <div className="row w-100 mx-0">
                            <label htmlFor="tf-search" className="d-none">Search field</label>
                            <label htmlFor="btn-search" className="d-none">Search button</label>
                            <input id="tf-search" name="tf-search" type="search" placeholder="Cerca qualcosa"
                                   className="col-9 form-control"/>
                            <button id="btn-search" name="btn-search" className="col-auto ml-auto btn btn-success "
                                    type="submit">
                                <em className="fas fa-search" aria-hidden="true"></em>
                            </button>
                            <button id="btn-filter" name="btn-filter" className="col-auto ml-auto btn btn-link"
                                    type="submit">
                                <em className="fas fa-sliders-h" aria-hidden="true"></em>
                            </button>
                        </div>
                    </form>
                </nav>

                <button className="btn btn-lg btn-primary rounded-circle floating-button fixed-bottom" type="submit">
                    <em className="fas fa-plus" aria-hidden="true"></em>
                </button>

                <main className="main-container">
                    <div className="row">
                        <div className="col-11 card shadow my-2 mx-auto px-0">
                            <div className="card bg-dark" id="locandina&evento">
                                <img src="" className="card-img" alt="locandina evento" />
                                    <div className="card-img-overlay text-white">
                                        <div className="d-flex align-items-start flex-column h-100">
                                            <div className="container-fluid">
                                                <div className="row">
                                                    <div className="col-8">
                                                        <h5 className="card-title event-name">Evento della Madonna</h5>
                                                        <h6 className="card-subtitle text-muted event-text">Organizzazione SPA</h6>
                                                    </div>
                                                    <div className="col-4 d-flex justify-content-end">
                                                        <h5 className="card-title event-name">0000</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="container-fluid mt-auto mb-2">
                                                <div className="row">
                                                    <div className="col-12 card-text event-text">
                                                        Lorem ipsum dolor sit amet, soluta regione urbanitas vis in, qui
                                                        elit populo ut.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="card-body container-fluid py-2" id="bottoni&tag">
                                <div className="row">
                                    <div className="col-3 my-auto">
                                        <div className="badge badge-pill festa festaBadge">#Festa</div>
                                    </div>
                                    <div className="col-9 d-flex justify-content-end">
                                        <a href="#" className="btn festaButton festaButtonSecondary">Segui</a>
                                        <a href="#" className="btn festaButton festaButtonPrimary ml-2">Partecipa</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}