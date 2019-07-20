import React from 'react'
import GoogleMapsProperties from '../../services/google_cloud/Properties'

class GoogleMap extends React.Component {

    googleMapRef = React.createRef()

    updateMapRef = () => {
        this.googleMapRef = this.createGoogleMap()
        let marker = this.createMarker()
    }

    componentDidMount() {
        let googleMapScript = document.createElement('script')
        googleMapScript.src = "https://maps.googleapis.com/maps/api/js?key=" + GoogleMapsProperties.key + "&libraries=places"
        window.document.body.appendChild(googleMapScript)
        googleMapScript.onload = this.updateMapRef
    }

    createGoogleMap = () => {
        return new window.google.maps.Map(this.googleMapRef.current, {
            zoom: 16,
            center: {
                lat: 43.642567,
                lng: -79.387054
            },
            disableDefaultUI: true,
            fullscreenControl: true
        })
    }

    createMarker = () => {
        return new window.google.maps.Marker({
            position: {
                lat: 43.642567,
                lng: -79.387054
            },
            map: this.googleMapRef
        })
    }

    render () {
         return (
             <div
               id={"google-map"}
               ref={this.googleMapRef}
               style={{width: '100%', height: '100%'}}
             />
         )
    }
}

/**
 *
 * @param props: {
 *     place: {
 *         place_id: String
 *     }
 * }
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

export {GoogleMap, LocationMap}