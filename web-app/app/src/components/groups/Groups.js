import React from 'react'
import { Redirect } from 'react-router-dom'

import Api from '../../services/api/Api'

import { LoginRedirect } from '../redirect/Redirect'
import {CreateNewGroupButton} from "../floating_button/FloatingButton"
import { LinkMakerBanner } from '../link_maker_banner/LinkMakerBanner'
import { SimpleSearchBar } from '../search_bar/SearchBar'
import NoItemsPlaceholder from '../no_items_placeholder/NoItemsPlaceholder'
import AvatarHeader from '../avatar_header/AvatarHeader'
import LoadingSpinner from '../loading_spinner/LoadingSpinner'

let routes = require("../../services/routes/Routes")

export default class Groups extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            filter: "",
            displayGroups: true,
            groups: this.props.user.groups || []
        }

        if(props.isLogged){
            Api.getGroups(
                err => {
                    if(err.response.status !== 404) {
                        this.props.onError("Errore nel caricare i gruppi a cui sei iscritto, ricarica la pagina")
                    }
                    this.setState({groups: [], displayGroups: false})
                },
                groups => {
                    groups.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                    this.setState({groups : groups})
                }
            )
        }
    }

    onFilterChange = (event) => {
        this.setState({filter: event.target.value})
    }

    renderGroups = () => {
        if(this.state.displayGroups && this.state.groups.length > 0){
            return this.state.groups.filter(group => group.name.toLowerCase().includes(this.state.filter.toLowerCase()))
                    .map(group => <LinkMakerBanner key={group._id}
                                    border={true}
                                    elem={group}
                                    showButton={false}
                                    isGroup={true} /> )
        } else if(this.state.displayGroups){
            return <LoadingSpinner personalizedMargin="mt-3"/>
        } else {
            return <NoItemsPlaceholder placeholder="Al momento non fai parte di nessun gruppo" />
        }
    }

    redirectHome = () => {
        return this.props.user.organization ? <Redirect to={routes.home} /> : <div/>
    }

    render = () => {
        return (
            <div className="main-container">

                {this.redirectHome()}

                <AvatarHeader
                    elem={this.props.user}
                    isGroup={false}
                />

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