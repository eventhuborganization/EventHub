import React from 'react'
import ReactDOMServer from 'react-dom/server';
import GoogleMapsProperties from '../../services/google_cloud/Properties'
import {EventHeaderBanner} from '../event/Event'
import {PARTY, MEETING, SPORT} from "../event/Event"
import GoogleApi from "../../services/google_cloud/GoogleMaps"
import {CallableComponent} from "../redirect/Redirect"
import GeoLocation from "../../services/location/GeoLocation"
import LocalStorage from "local-storage"

let images = require.context("../../assets/images", true)
let routes = require("../../services/routes/Routes")

class EventsMap extends CallableComponent {

    defaultZoom = 14
    maxZoom = 16
    minZoom = 7

    constructor(props) {
        super(props)
        let data = LocalStorage("pippo")

        this.googleMapDivId = "google-map"
        this.infoWindows = []
        this.map = undefined
        this.zoom = data && data.zoom ? data.zoom : this.defaultZoom
    }

    getCurrentPosition = () => {
        if (this.map) {
            let center = this.map.getCenter()
            return {
                lat: center.lat(),
                lng: center.lng()
            }
        }
    }

    updateMap = () => {
        this.infoWindows = []
        this.map = this.createGoogleMap()
        this.props.events.forEach(event => this.createEventMarker(event, this.map))
        this.createCurrentLocationMarkerMarker(this.map)
    }

    componentDidMount() {
        super.componentDidMount()
        GoogleApi.loadGoogleMapsScript(this.updateMap)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (window.google)
            this.updateMap()
    }

    createGoogleMap = () => {
        let styles = [
            {
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];
        let noPoiMapName = 'no_poi_map'
        let noPoiMap = new window.google.maps.StyledMapType(styles,{name: noPoiMapName});
        let map = new window.google.maps.Map(document.getElementById(this.googleMapDivId), {
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            center: new window.google.maps.LatLng(this.props.center.lat, this.props.center.lng),
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', noPoiMapName]
            }
        })
        map.addListener("center_changed", () => {
            let center = map.getCenter()
            this.props.onCenterChanged({
                lat: center.lat(),
                lng: center.lng(),
            })
        })
        map.addListener("zoom_changed", () => {
            let zoom = map.getZoom()
            this.zoom = zoom
            LocalStorage("pippo", {zoom: zoom})
        })
        map.mapTypes.set(noPoiMapName, noPoiMap)
        map.setMapTypeId(noPoiMapName)
        return map
    }

    createEventMarker = (event, map) => {
        let eventBanner =
            <div className={"container-fluid"}>
                <a href={routes.eventFromId(event._id)}>
                    <EventHeaderBanner event={event}/>
                </a>
            </div>
        let contentString = ReactDOMServer.renderToString(eventBanner)
        var infoWindow = new window.google.maps.InfoWindow({
            content: contentString
        })
        var iconName = ""
        if (event.typology === PARTY)
            iconName = "party.png"
        if (event.typology === MEETING)
            iconName = "meeting.png"
        if (event.typology === SPORT)
            iconName = "sport.png"
        let marker = new window.google.maps.Marker({
            position: new window.google.maps.LatLng(event.location.lat, event.location.lng),
            icon: {
                url: images(`./${iconName}`),
                scaledSize: new window.google.maps.Size(24, 24),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(0, 24)
            },
            map: map
        })
        this.infoWindows.push(infoWindow)
        marker.addListener('click', () => {
            this.infoWindows.forEach(element => element.close())
            infoWindow.open(map, marker)
        })
    }

    createCurrentLocationMarkerMarker = (map) => {
        GeoLocation.getCurrentLocation(() => {}, position => {
            let location = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            new window.google.maps.Marker({
                position: location,
                icon: {
                    url: images(`./${"circle-solid.png"}`),
                    scaledSize: new window.google.maps.Size(14, 14),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(0, 14)
                },
                map: map,
                zIndex: 1000
            })
        })
    }

    render () {
        return (
            <div
                id={this.googleMapDivId}
                style={{width: '100%', height: '100%'}}
            />
        )
    }
}

/**
 * @param props {{
 *     place: {
 *         place_id: string,
 *         location: {
 *             lat: number,
 *             lng: number
 *         }
 *     }
 * }}
 * @returns {*}
 * @constructor
 */
let LocationMap = props => {
    let mapSrc = ""
    if (props.place) {
        let q = ""
        if (props.place.place_id)
            q = "q=place_id:" + props.place.place_id
        else if (props.place.location)
            q = "q=" + props.place.location.lat + "," + props.place.location.lng
        mapSrc = q ? "https://www.google.com/maps/embed/v1/place?" + q + "&zoom=16&key=" + GoogleMapsProperties.key : ""
    }
    return (
        <div className={"embed-responsive embed-responsive-16by9 " + (props.place ? "" : " d-none ")}>
            <div className={"embed-responsive-item"}>
                <iframe title={"location"}
                        width="100%" height="100%" style={{border: 0}}
                        src={mapSrc}
                        allowFullScreen
                />
            </div>
        </div>
    )
}

export {EventsMap, LocationMap}