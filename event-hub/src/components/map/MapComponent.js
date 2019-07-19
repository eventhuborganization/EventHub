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

export default GoogleMap