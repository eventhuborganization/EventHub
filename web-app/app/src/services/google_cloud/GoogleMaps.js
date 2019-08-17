import Properties from './Properties'

let loadGoogleMapsScript = (onload) => {
    let googleMapScriptId = "google-maps-script"
    if (!document.getElementById(googleMapScriptId)) {
        let googleMapScript = document.createElement('script')
        googleMapScript.id = googleMapScriptId
        googleMapScript.src = Properties.mapsApiServer + "/maps/api/js?key=" + Properties.key + "&libraries=places"
        googleMapScript.onload = onload
        window.document.body.appendChild(googleMapScript)
    } else if (!window.google) {
        let oldLoad = document.getElementById(googleMapScriptId).onload
        document.getElementById(googleMapScriptId).onload = () => {
            oldLoad()
            onload()
        }
    } else {
        onload()
    }
}

/**
 * @param location {{
 *     lat: number,
 *     lng: number
 * }}
 * @param onError {function}
 * @param onSuccess {function}
 */
let getPlaceInformationByLocation = (location, onError, onSuccess) => {
    loadGoogleMapsScript(() => {
        new window.google.maps.Geocoder().geocode({location: location}, (results, status) => {
            if (status === 'OK' && results && results[0])
                onSuccess(results[0])
            else
                onError(results, status)
        });
    })
}

export default {loadGoogleMapsScript, getPlaceInformationByLocation}