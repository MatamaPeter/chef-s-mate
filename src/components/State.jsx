/* eslint-disable react/prop-types */
import { useState } from "react";

export default function State() {
    const [unreadMessages, setUnreadMessages] = useState([])
    return (
        <div>
            
            {   
                unreadMessages.length > 0 &&
                <h5>You have {unreadMessages.length} Message(s)!</h5>
            }
            {
                unreadMessages.length == 0 &&
                <h5>You are all caught up!</h5>
            }
            
        </div>
    )
}