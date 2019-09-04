import React from 'react'

import { EventHeaderBanner } from "../event/Event"
import { CallableComponent } from '../redirect/Redirect'
import ApiService from '../../services/api/Api'

export class Modal extends CallableComponent {

    constructor(props){
      super(props)
      this.state = { body: undefined, title: undefined }
    }
  
    showModal = (data) => {
        this.setState((prevState) => {
            let state = prevState
            state.body = data.body
            state.title = data.title
            state.confirmMessage = data.confirmMessage
            state.discardMessage = data.discardMessage
            state.okFun = data.okFun
            state.exitFun = data.exitFun
            state.cancelFun = data.cancelFun
            return state
        }, () => {
            if (this.state.exitFun instanceof Function) {
                let modal = document.getElementById('errorLog')
                let config = { attributes: true}
                let state = this.state
                let callback = function(mutationsList, observer) {
                    for(let mutation of mutationsList) {
                        if (mutation.attributeName === "aria-hidden" && mutation.target.attributes["aria-hidden"]) {
                            state.exitFun()
                            observer.disconnect()
                        }
                    }
                }
                const observer = new MutationObserver(callback)
                observer.observe(modal, config)
            }
            document.getElementById("triggerButton").click()
        })
    }
  
    render = () => {
      return (
        <div>
          <button type="button" id="triggerButton" hidden={true} data-toggle="modal" data-target="#errorLog">Launch modal</button>
          <div className="modal fade" id="errorLog" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">{this.state.title}</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {this.state.body}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className={this.state.discardMessage ? "btn btn-outline-primary" : "d-none"} 
                    data-dismiss="modal" 
                    onClick={this.state.discardMessage ? this.state.cancelFun : () => {}}>
                    {this.state.discardMessage}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    data-dismiss="modal" 
                    onClick={this.state.okFun ? this.state.okFun : () => {}}>
                    {this.state.confirmMessage ? this.state.confirmMessage : this.props.closeLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
  
export class ReviewModal extends CallableComponent {
  
      title = "Scrivi una recensione"
      showReviewModalButtonId = "show-review-modal"
  
      constructor(props) {
          super(props)
          this.state = {
              event: undefined,
              onSent: undefined,
              text: "",
              evaluation: 0,
              error: ""
          }
      }
  
  
      /**
       * @param data {{
       *     event: object
       *     onSent: function
       * }}
       */
      showModal = (data) => {
          this.setState({
                  event : data.event,
                  onSent: data.onSent
              },this.toggleModal)
      }
  
      writeReview = () => {
          if (!this.checkErrors()) {
              let review = {
                  eventId: this.state.event._id,
                  text: this.state.text,
                  evaluation: this.state.evaluation
              }
              ApiService.writeReview(review,
                  () => this.showError("Si è verificato un errore, riprovare."),
                  () => {
                      this.toggleModal()
                      if (this.state.onSent instanceof Function)
                          this.state.onSent()
                  })
          }
      }
  
      toggleModal = () => {
          document.getElementById(this.showReviewModalButtonId).click()
      }
  
      showError = message => {
          this.setState({error: message})
      }
  
      checkErrors = () => {
          let errorFound = false
          let addErrorClassAndFocus = name => {
              let element = document.getElementById(name)
              element.classList.add("border")
              element.classList.add("border-danger")
              if (!errorFound) {
                  errorFound = true
                  element.focus()
                  element.scrollIntoView()
              }
          }
          if (!this.state.text) {
              addErrorClassAndFocus("review-text")
              this.showError("Non hai inserito nessun testo per la recensione!")
          } else if (this.state.evaluation === 0){
              errorFound = true
              this.showError("Non hai inserito un punteggio valido, devi inserire almeno una stellina!")
          }
  
          return errorFound
      }
  
      renderStars = () => {
          let stars = []
          for (let i = 0; i < 5; i++)
              stars.push(
                  <em className={(i < this.state.evaluation ? " fas " : " far ") + " fa-star text-warning pr-2"}
                      onClick={() => this.onStarClicked(i+1)}
                      key={"star-" + i}>
                  </em>)
          return (
              <div className={"d-flex justify-content-start align-items-center"}>
                  {stars}
              </div>
          )
      }
  
      onTextChange = event => {
          event.persist()
          this.setState({text: event.target.value})
      }
  
      onStarClicked = star => {
          if (star > 0 && star <= 5)
              this.setState({evaluation: star === this.state.evaluation ? star - 1 : star })
      }
  
      render() {
          return (
              this.state.event ?
              <div>
                  <button type="button" id={this.showReviewModalButtonId} hidden={true} data-toggle="modal" data-target="#reviewModal">Launch modal</button>
                  <div className="modal fade" id="reviewModal" tabIndex="-1" role="dialog" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered" role="document">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalCenterTitle">{this.title}</h5>
                              </div>
                              <div className="modal-body">
                                  <div className={"container-fluid"}>
                                      <EventHeaderBanner event={this.state.event} hidePlace={true} />
                                      <div className={"row mt-2"}>
                                          <div className={"col-12 px-0"}>
                                              {this.renderStars()}
                                          </div>
                                      </div>
                                      <div className={"row mt-2"}>
                                          <div className={"col-12 px-0"}>
                                              <textarea
                                                  id={"review-text"}
                                                  name={"review-text"}
                                                  className="w-100 form-control"
                                                  onChange={this.onTextChange}
                                              >
                                              </textarea>
                                          </div>
                                      </div>
                                      <div className={"row mt-2"}>
                                          <div className={"col-12 px-0"}>
                                              <p className={"text-danger"}>{this.state.error}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="modal-footer">
                                  <button
                                      type="button"
                                      className={"btn btn-danger review-modal-button"}
                                      data-dismiss="modal"
                                  >
                                      Annulla
                                  </button>
                                  <button
                                      type="button"
                                      className="btn btn-primary review-modal-button"
                                      onClick={this.writeReview}
                                  >
                                      Invia
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div> : <div/>
          )
      }
  }