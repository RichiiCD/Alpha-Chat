import { useEffect } from "react"
import { API_ADDRESS } from '../apiConfig'



function Notification({notification, latestsNotifications, setLatestsNotifications}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            setLatestsNotifications(arr => arr.filter((noti) => noti.id !== notification.id)) // *
        }, 2500);
      
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="notification">
            <div className="row">
                <div className="noti-image flex-vh-alings">
                    <div className="userprofile-img" style={{'backgroundImage': `url('${API_ADDRESS + notification.sender.userprofile.image}')`}}></div>
                </div>
                <div className="noti-info flex-h-alings flex-column-direction gap-0">
                    <p><strong>{notification.sender.username}</strong></p>
                    <p>{notification.content}</p>
                </div>
            </div>
        </div>
    )
}


export default Notification 