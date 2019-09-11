import React from 'react'
import {Link, Redirect} from 'react-router-dom'

import Api from '../../services/api/Api'

import { LoginRedirect } from '../redirect/Redirect'
import {CreateNewGroupButton} from "../floating_button/FloatingButton"
import { LinkMakerBanner } from '../link_maker_banner/LinkMakerBanner'
import {SIMPLE_SEARCH_BAR, SimpleSearchBar} from '../search_bar/SearchBar'
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
            groups: this.props.user.groups || [],
            searchBarData: {
                placeholder: "Cerca gruppo",
                onChange: this.onFilterChange
            }
        }
        props.setSearchBar(SIMPLE_SEARCH_BAR, this.state.searchBarData)
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

    componentDidMount() {
        this.props.setSearchBar(SIMPLE_SEARCH_BAR, this.state.searchBarData)
    }

    componentWillUnmount() {
        this.props.unsetSearchBar()
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

                <div className={"row d-flex justify-content-center align-items-center"}>
                    <div className={"col-12 col-xl-8"}>
                        <div className={"d-xl-none"}>
                            <AvatarHeader
                                elem={this.props.user}
                                isGroup={false}
                            />
                        </div>

                        <div className={"d-none d-xl-inline"}>
                            <div className={" row mt-2 "}>
                                <div className={"col-8 page-title"}>
                                    I tuoi gruppi
                                </div>
                                <div className={"col-4 d-flex justify-content-end align-items-center"}>
                                    <Link to={routes.newGroup} className={"btn btn-primary button-size"}>Crea gruppo</Link>
                                </div>
                            </div>
                        </div>

                        <CreateNewGroupButton location={this.props.location} isLogged={this.props.isLogged} />

                        <SimpleSearchBar
                            placeholder={this.state.searchBarData.placeholder}
                            value={this.state.filter}
                            onChange={this.onFilterChange}
                        />

                        {this.renderGroups()}
                    </div>
                </div>

                <LoginRedirect {...this.props} redirectIfNotLogged={true} />
            </div>
        )
    }
}