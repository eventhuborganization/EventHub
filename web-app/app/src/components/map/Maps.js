import React from 'react'
import ReactDOMServer from 'react-dom/server';
import GoogleMapsProperties from '../../services/google_cloud/Properties'
import {EventHeaderBanner} from '../event/Event'
import {PARTY, MEETING, SPORT} from "../event/Event";
import GoogleApi from "../../services/google_cloud/GoogleMaps";
import GeoLocation from "../../services/location/GeoLocation";
import {CallableComponent} from "../redirect/Redirect";

let images = require.context("../../assets/images", true)

class EventsMap extends CallableComponent {

    constructor(props) {
        super(props)
        this.googleMapDivId = "google-map"
        this.infoWindows = []
        this.currentPosition = {
            lat: 0,
            lng: 0
        }
    }

    updateCenterPosition = location => {
        if (location && location.lat && location.lng) {
            this.currentPosition = {
                lat: location.lat,
                lng: location.lng
            }
            this.updateMap()
        }
    }


    updateMap = () => {
        this.infoWindows = []
        let map = this.createGoogleMap()
        this.props.events.forEach(event => this.createEventMarker(event, map))
    }

    componentDidMount() {
        super.componentDidMount()
        GoogleApi.loadGoogleMapsScript(() => {
            GeoLocation.getCurrentLocation(
                () => this.props.onError("Per poter usufruire della mappa è necessario condividere la propria posizione"),
                position => {
                    this.currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    this.updateMap()
                    this.props.onCenterChanged(this.currentPosition)
                }
            )
        })
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
            zoom: 12,
            center: this.currentPosition,
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', noPoiMapName]
            }
        })
        map.addListener('center_changed', () => {
            let center = map.getCenter()
            let location = {
                lat: center.lat(),
                lng: center.lng()
            }
            this.currentPosition = location
            this.props.onCenterChanged(location)
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
        mapSrc = q ? "https://www.google.com/maps/embed/v1/place?" + q + "&zoom=18&key=" + GoogleMapsProperties.key : ""
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