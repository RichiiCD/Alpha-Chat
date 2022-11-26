import {useState} from 'react'



function InvitationItem({invitation, displayAlertMessage}) {

    //COMPONENT STATE FOR DISPLAY INVITATION OPTIONS
    const [showInvitationOptions, setShowInvitationOptions] = useState(false)

    //OBJECT FOR STORAGE THE X AND Y MOUSE POSITION
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0})

    //FUNCTION FOR DISPLAY INVITATION OPTIONS (showInvitationOptions, mousePosition)
    const displayInvitationOptions = (e) => {
        setShowInvitationOptions(!showInvitationOptions)
        setMousePosition({x: e.pageX, y: e.pageY})
    }


    return (
        <div className='settings-item flex-v-alings'>
            <i className="fas fa-envelope svg-icon"></i>
            <div className='user'>
                <p className='title'>{invitation.receiver.username}</p>
                <p className='subtitle'>#{invitation.receiver.userprofile.code}</p>
            </div>
            <i onClick={(e) => displayInvitationOptions(e)} className="fas fa-ellipsis-v options clickable"></i>
            <div style={{top: mousePosition.y, left: mousePosition.x}} className={`settingsmenu contextual-menu ${showInvitationOptions ? 'visible' : ''}`}>
                <ul className="menu">
                    <li onClick={() => displayAlertMessage(invitation.code)} className="item highlight">Delete invitation</li>
                </ul>
            </div>
        </div>
    )
}

export default InvitationItem