import React from "react";

let Contacts = props => {
    return (
        <section className="row mt-2">
            <div className="col-12">
                <h5>Contatti</h5>
                <div className="container-fluid px-1">
                    <div className="row">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <em className="fas fa-phone fa-2x text-secondary"></em>
                        </div>
                        <p className="col my-0 d-flex align-items-center">{props.event.organizator.phoneNumber}</p>
                    </div>
                    <div className="row">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <em className="fas fa-envelope fa-2x rounded text-secondary"></em>
                        </div>
                        <p className="col my-0 d-flex align-items-center">{props.event.organizator.email}</p>
                    </div>
                    <div className="row">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <em className="fas fa-comments fa-2x rounded text-secondary"></em>
                        </div>
                        <p className="col my-0 d-flex align-items-center">Facci una domanda!</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contacts