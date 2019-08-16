import { interval } from 'rxjs'
import ApiService from '../api/Api'

class NotificationService {

    #fromIndex = 0
    #period = 5000
    #removedSubscriptionCode = undefined
    #subscriptions = []
    #started = false
    #notificationChecker = undefined
    #timer = interval(this.#period)

    /**
     * @param onData {function}
     * @return {number} the code that identify this subscription.
     */
    addSubscription = onData => {
        let subscriptionCode = undefined
        if (onData && onData instanceof Function) {
            if (this.#removedSubscriptionCode) {
                this.#subscriptions[this.#removedSubscriptionCode] = onData
                this.#removedSubscriptionCode = undefined
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
            if (this.#subscriptions.filter(subscription => subscription).length === 0)
                this.#stop()
            else
                this.#removedSubscriptionCode = subscriptionCode
        }
    }

    #start = () => {
        if (!this.#started) {
            this.#notificationChecker = this.#timer
                .subscribe(() => {
                    ApiService.getNotifications(this.#fromIndex,
                        () => {},
                        notifications =>
                            this.#subscriptions
                                .filter(subscription => subscription)
                                .forEach(subscription => subscription(notifications))
                    )
                })
            this.#started = true
        }
    }

    #stop = () => {
        if (this.#notificationChecker) {
            this.#notificationChecker.unsubscribe()
            this.#started = false
        }
    }
}

let notificationService = new NotificationService()

export default notificationService