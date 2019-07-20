import Axios from 'axios'
import Properties from '../../utils/Properties'

let createNewEvent = (event, onError, onSuccess) => {
    Axios.post(Properties.apiServer + '/event', event)
        .catch(error => onError(error))
        .then(response => {
            if (!response || response.status !== 201)
                onError(response)
            else
                onSuccess(response)
        })
}

export default {createNewEvent}