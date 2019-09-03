import React from 'react'
import { RoundedBigImage, BORDER_PRIMARY, PLACEHOLDER_GROUP_CIRCLE, PLACEHOLDER_USER_CIRCLE } from '../image/Image';

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
 *     isGroup: boolean
 * }}
 */
export default function AvatarHeader(props){
    return (
        <div className="row mt-2">
            <div className="col d-flex justify-content-center">
                <div className="d-flex flex-column text-center">
                    <div className="col d-flex justify-content-center">
                        <RoundedBigImage
                            imageName={props.elem.avatar}
                            borderType={BORDER_PRIMARY} 
                            placeholderType={props.isGroup ? PLACEHOLDER_GROUP_CIRCLE : PLACEHOLDER_USER_CIRCLE}
                        />
                    </div>
                    <h5 className="mt-1 font-weight-bold">
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