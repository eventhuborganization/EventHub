import Axios from 'axios';
import Properties from './Properties'


class GoogleMaps {

    getLocationByAddress(address, onError, onSuccess) {
        Axios.get(Properties.mapsApiServer + "/maps/api/geocode/json?address=" + address + "&key=" + Properties.key)
            .catch(error => onError(error))
            .then(response => {
                if (!response || response.status !== 200)
                    onError(response)
                else
                    onSuccess(response.data.results)
            })
    }
}

export {GoogleMaps}