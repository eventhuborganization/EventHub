let getCurrentLocation = (onError, onSuccess) => {
    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
            position => onSuccess(position),
            error => onError(error)
        )
    }
}

export default {
    getCurrentLocation
}