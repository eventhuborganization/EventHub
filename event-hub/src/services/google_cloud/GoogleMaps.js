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

export {loadGoogleMapsScript}