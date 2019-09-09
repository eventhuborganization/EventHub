import React from 'react'
import './AvatarHeader.css'

import {
    RoundedBigImage,
    BORDER_PRIMARY,
    PLACEHOLDER_GROUP_CIRCLE,
    PLACEHOLDER_USER_CIRCLE,
    RoundedSmallImage
} from '../image/Image'

/**
 * @param props {{
 *     elem: {
 *         name: string,
 *         surname: string,
 *         avatar: string,
 *         address: {
 *             city: string
 *         },
 *         organization: boolean
 *     },
 *     isGroup: boolean,
 *     smallImage: boolean
 * }}
 */
export default function AvatarHeader(props){
    return (
        <div className="row mt-3">
            <div className="col d-flex justify-content-center">
                <div className="d-flex flex-column text-center">
                    <div className="col d-flex justify-content-center">
                        {
                            props.smallImage ?
                                <RoundedSmallImage
                                    imageName={props.elem.avatar}
                                    borderType={BORDER_PRIMARY}
                                    placeholderType={props.isGroup ? PLACEHOLDER_GROUP_CIRCLE : PLACEHOLDER_USER_CIRCLE}
                                    alt={"Avatar"}
                                /> :
                                <RoundedBigImage
                                    imageName={props.elem.avatar}
                                    borderType={BORDER_PRIMARY}
                                    placeholderType={props.isGroup ? PLACEHOLDER_GROUP_CIRCLE : PLACEHOLDER_USER_CIRCLE}
                                    alt={"Avatar"}
                                />
                        }
                    </div>
                    <h5 className="mt-1 font-weight-bold name">
                        {
                            props.isGroup ? 
                                props.elem.name : 
                                (
                                    props.elem.organization ? 
                                    props.elem.name :
                                    props.elem.name + " " + props.elem.surname
                                )  
                        }
                    </h5>
                </div>
            </div>
        </div>
    )
}