import React from 'react'

import Api from '../../services/api/Api'

import { LoginRedirect } from '../redirect/Redirect'
import {CreateNewGroupButton} from "../floating_button/FloatingButton"
import { RoundedBigImage, BORDER_PRIMARY, PLACEHOLDER_USER_CIRCLE } from '../image/Image'
import { LinkMakerBanner } from '../link_maker_banner/LinkMakerBanner'
import { SimpleSearchBar } from '../search_bar/SearchBar'
import NoItemsPlaceholder from '../no_items_placeholder/NoItemsPlaceholder';

export default class Groups extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            filter: "",
            groups: []
        }
        Api.getGroups(
            () => this.props.onError("Errore nel caricare i gruppi a cui sei iscritto, riprova"),
            groups => this.setState({groups : groups})
        )
    }

    onFilterChange = (event) => {
        this.setState({filter: event.target.value})
    }

    renderGroups = () => {
        if(this.state.groups.length > 0){
            return this.state.groups.filter(group => group.name.toLowerCase().includes(this.state.filter.toLowerCase()))
                    .map(group => <LinkMakerBanner key={group._id}
                                    border={true}
                                    elem={group}
                                    showButton={false}
                                    isGroup={true} /> )
        } else {
            return <NoItemsPlaceholder placeholder="Al momento non fai parte di nessun gruppo" />
        }
    }

    render = () => {
        return (
            <div className="main-container">

                <div className="row mt-2">
                    <div className="col d-flex justify-content-center">
                        <div className="d-flex flex-column text-center">
                            <div className="col d-flex justify-content-center">
                                <RoundedBigImage 
                                    imageName={this.props.user.avatar}
                                    borderType={BORDER_PRIMARY} 
                                    placeholderType={PLACEHOLDER_USER_CIRCLE}
                                />
                            </div>
                            <h5 className="mt-1 font-weight-bold">{this.props.user.name + " " + this.props.user.surname}</h5>
                        </div>
                    </div>
                </div>

                <CreateNewGroupButton location={this.props.location} isLogged={this.props.isLogged} />

                <SimpleSearchBar
                    placeholder="Cerca gruppo"
                    value={this.state.filter}
                    onChange={this.onFilterChange}
                />

                {this.renderGroups()}

                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
            </div>
        )
    }
}