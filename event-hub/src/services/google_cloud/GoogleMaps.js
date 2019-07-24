import Axios from 'axios';
import Properties from './Properties'


let getLocationByAddress = (address, onError, onSuccess) => {
    Axios.get(Properties.mapsApiServer + "/maps/api/geocode/json?address=" + address + "&key=" + Properties.key)
        .catch(error => onError(error))
        .then(response => {
            if (!response || response.status !== 200)
                onError(response)
            else
                onSuccess(response.data.results)
        })
}

let loadGoogleMapsScript = (onload) => {
    let googleMapScriptId = "google-maps-script"
    if (!document.getElementById(googleMapScriptId)) {
        let googleMapScript = document.createElement('script')
        googleMapScript.id = googleMapScriptId
        googleMapScript.src = Properties.mapsApiServer + "/maps/api/js?key=" + Properties.key + "&libraries=places"
        window.document.body.appendChild(googleMapScript)
        googleMapScript.onload = onload
    } else {
        onload()
    }
}

export {getLocationByAddress, loadGoogleMapsScript}