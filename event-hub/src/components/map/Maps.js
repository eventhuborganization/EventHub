import React from 'react'
import ReactDOMServer from 'react-dom/server';
import GoogleMapsProperties from '../../services/google_cloud/Properties'
import {EventHeaderBanner} from '../event/Event'
import {PARTY, MEETING, SPORT} from "../event/Event";
import GoogleApi from "../../services/google_cloud/GoogleMaps";

let images = require.context("../../assets/images", true)

class EventsMap extends React.Component {

    constructor(props) {
        super(props)
        this.googleMapDivId = "google-map"
        this.infoWindows = []
    }

    updateMapRef = () => {
        this.infoWindows = []
        let map = this.createGoogleMap()
        this.props.events.forEach(event => this.createEventMarker(event, map))
    }

    componentDidMount() {
        GoogleApi.loadGoogleMapsScript(this.updateMapRef)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (window.google)
            this.updateMapRef()
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
            zoom: 16,
            center: this.props.centerPosition,
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', noPoiMapName]
            }
        })
        map.mapTypes.set(noPoiMapName, noPoiMap);
        map.setMapTypeId(noPoiMapName);
        return map
    }

    createEventMarker = (event, map) => {
        let eventBanner =
            <div className={"container-fluid"}>
                <a href={"/event/" + event._id}>
                    <EventHeaderBanner event={event}/>
                </a>
            </div>
        let contentString = ReactDOMServer.renderToString(eventBanner)
        var infoWindow = new window.google.maps.InfoWindow({
            content: contentString,
            maxWidth: window.screen.availWidth
        })
        var iconName = ""
        if (event.typology === PARTY)
            iconName = "party.png"
        if (event.typology === MEETING)
            iconName = "meeting.png"
        if (event.typology === SPORT)
            iconName = "sport.png"
        let marker = new window.google.maps.Marker({
            position: {
                lat: event.location.lat,
                lng: event.location.lng
            },
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
 * @param props {object}
 * @param props.place {object}
 * @param props.place.place_id {string}
 * @returns {*}
 * @constructor
 */
let LocationMap = props => {
    var mapSrc = ""
    if (props.place)
        mapSrc = "https://www.google.com/maps/embed/v1/place?q=place_id:" + (props.place ? props.place.place_id : "") + "&zoom=18&key=" + GoogleMapsProperties.key
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