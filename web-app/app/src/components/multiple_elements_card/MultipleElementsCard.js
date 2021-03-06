import React from 'react'
import "./MultipleElementsCard.css"

export default class MultipleElementsCard extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            lastElement: this.numberOfElementsToShow
        }
    }

    incrementElements = () => {
        this.setState((prevState) => {
            return {
                lastElement: prevState.lastElement + this.numberOfElementsToShow
            }
        })
    }

    numberOfElementsToShow = 4

    render() { 
        return !!this.props.show ? (
            <div className={"row " + (!!this.props.margin ? this.props.margin : "")}>
                <div className="card border-primary shadow mx-auto col-11 col-xl-8">
                    <div className="card-body px-1 py-3">
                        <h5 className="card-title">{this.props.title}</h5>
                        {this.props.showAll ? this.props.elements : this.props.elements.slice(0,this.state.lastElement)}
                        {
                            !this.props.showAll && this.props.elements.length > this.state.lastElement ? 
                                <div className="text-right small text-primary" onClick={this.incrementElements}>
                                    Mostra altri
                                </div> : ""
                        }
                    </div>
                </div>
            </div>
        ) : ""
    }
}