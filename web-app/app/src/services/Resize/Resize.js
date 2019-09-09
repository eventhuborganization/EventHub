import {interval} from "rxjs";
import ApiService from "../api/Api";

class ResizeService {

    #removedSubscriptionCode = -1
    #subscriptions = []
    #started = false

    /**
     * @param onData {function}
     * @return {number} the code that identify this subscription.
     */
    addSubscription = onData => {
        let subscriptionCode = undefined
        if (onData && onData instanceof Function) {
            if (this.#removedSubscriptionCode >= 0) {
                this.#subscriptions[this.#removedSubscriptionCode] = onData
                this.#removedSubscriptionCode = -1
                subscriptionCode = this.#removedSubscriptionCode
            } else {
                this.#subscriptions.push(onData)
                subscriptionCode = this.#subscriptions.length - 1
            }
            this.#start()
        }
        return subscriptionCode
    }

    /**
     * @param subscriptionCode {number} the code returned from the subscription.
     */
    removeSubscription = subscriptionCode => {
        if (subscriptionCode >= 0 &&
            this.#subscriptions.length > 0 &&
            this.#subscriptions[subscriptionCode]) {
            this.#subscriptions[subscriptionCode] = undefined
            if (this.#subscriptions.filter(subscription => subscription !== undefined).length === 0)
                this.#stop()
            else
                this.#removedSubscriptionCode = subscriptionCode
        }
    }

    #start = () => {
        if (!this.#started) {
            window.onresize = () => {
                this.#subscriptions
                    .filter(subscription => !!subscription)
                    .forEach(subscription => subscription())
            }
            this.#started = true
        }
    }

    #stop = () => {
        if (this.#started) {
            this.#started = false
            window.onresize = () => {}
        }
    }
}

let resizeService = new ResizeService()

export default resizeService