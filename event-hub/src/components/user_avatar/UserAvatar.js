import React from 'react'

let UserAvatar = props => {
    let images = require.context("../../assets/images", true)
    return (
        <img src={(props.user.avatar ? images(`./${props.user.avatar}`) : '')}
             className="img-fluid border rounded-circle"
             alt="Immagine profilo organizzatore"
        />
    )
}

export default UserAvatar