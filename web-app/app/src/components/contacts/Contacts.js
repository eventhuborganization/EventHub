import React from "react";

let Contacts = props => {

    return props.event && props.event.organizator ? (
        <section className="row mt-2">
            <div className="col-12">
                {props.hideTitle ? <div/> : <h5 className={"event-info-section-title"}>Contatti</h5>}
                <div className="container-fluid px-1">
                    <div className={"row"}>
                        <div className={props.center ? "col-8" : "col-12"}>
                            {
                                props.event.organizator.phone ?
                                    <div className="row">
                                        <div className="col-2 d-flex align-items-center justify-content-center">
                                            <em className="fas fa-phone fa-2x text-secondary"></em>
                                        </div>
                                        <p className="col my-0 d-flex align-items-center event-info-text">{props.event.organizator.phone}</p>
                                    </div>
                                    : <div/>
                            }
                            <div className="row">
                                <div className="col-2 d-flex align-items-center justify-content-center">
                                    <em className="fas fa-envelope fa-2x rounded text-secondary"></em>
                                </div>
                                <p className="col my-0 d-flex align-items-center event-info-text">{props.event.organizator.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    ) : <div />
}

export default Contacts