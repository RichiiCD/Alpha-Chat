import {useState} from 'react'
import UserProfile from '../../../Utils/UserProfile'



function MemberItem({member, addKickedMembers}) {
    
    //COMPONENT STATE FOR DISPLAY MEMBER OPTIONS
    const [showMemberOptions, setShowMemberOptions] = useState(false)

    //OBJECT FOR STORAGE THE X AND Y MOUSE POSITION
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0})


    //FUNCTION FOR DISPLAY MEMEBER OPTIONS (showMemberOptions, mousePosition)
    const displayMemberOptions = (e) => {
        setShowMemberOptions(!showMemberOptions)
        setMousePosition({x: e.pageX, y: e.pageY})
    }


    return (
        <div className='settings-item flex-v-alings'>
            <div className="userprofile-img" style={{'backgroundImage': `url('http://127.0.0.1:8000${member.userprofile.image}')`}}></div>
            <div className='user'>
                <p className='title'>{member.username}</p>
                <p className='subtitle'>#{member.userprofile.code}</p>
            </div>
            {localStorage.getItem('username') != member.username ?
                <i onClick={(e) => displayMemberOptions(e)} className="fas fa-ellipsis-v options clickable"></i>
            : null}
            <div style={{top: mousePosition.y, left: mousePosition.x}} className={`settingsmenu contextual-menu ${showMemberOptions ? 'visible' : ''}`}>
                <ul className="menu">
                    <li onClick={() => addKickedMembers(member)} className="item highlight">Kick user</li>
                </ul>
            </div>
        </div>
    )
}

export default MemberItem