import React from 'react'
import './ScrollableMenu.css'

export default class ScrollableMenu extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            menuId: this.props.id ? this.props.id : "toggableMenuContent",
            arrowId: "menuArrow-" + (this.props.id ? this.props.id : "toggableMenuContent")
        }
    }

    toggleArrow = () => {
        let arrowClass = document.getElementById(this.state.arrowId).classList
        if(arrowClass.contains("fa-angle-down")){
            arrowClass.remove("fa-angle-down")
            arrowClass.add("fa-angle-up")
        } else {
            arrowClass.remove("fa-angle-up")
            arrowClass.add("fa-angle-down")
        }  
    }

    render = () => {
        return (
            <div>
                <div className="row">
                    <div 
                        data-toggle="collapse" 
                        data-target={"#" + this.state.menuId} 
                        aria-controls={this.state.menuId} 
                        aria-expanded="false" 
                        aria-label="menu a scrolling"
                        className="col-12"
                        onClick={this.toggleArrow}>
                        <em id={this.state.arrowId} className="fas fa-angle-down"/>
                        <span className="ml-2 h5 title">{this.props.title}</span>
                    </div>
                </div>
                <div className="collapse" id={this.state.menuId}>
                    <div className="col-12">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }


}