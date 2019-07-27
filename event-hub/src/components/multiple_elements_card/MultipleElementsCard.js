import React from 'react'

export default class MultipleElementsCard extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            lastUser: this.numberOfUsersToShow
        }
    }

    incrementUsers = () => {
        this.setState((prevState) => {
            return {
                lastUser: prevState.lastUser + this.numberOfUsersToShow
            }
        })
    }

    numberOfUsersToShow = 6

    render() { 
        return !!this.props.show ? (
            <div className={"row " + (!!this.props.margin ? this.props.margin : "")}>
                <div className="card border-primary shadow mx-auto col-11">
                    <div className="card-body">
                        <h5 className="card-title">{this.props.title}</h5>
                        {this.props.showAll ? this.props.users : this.props.users.slice(0,this.state.lastUser)}
                        {
                            !this.props.showAll && this.props.users.length > this.state.lastUser ? 
                                <div className="text-right small text-primary" onClick={this.incrementUsers}>
                                    Mostra altri
                                </div> : ""
                        }
                    </div>
                </div>
            </div>
        ) : ""
    }
}