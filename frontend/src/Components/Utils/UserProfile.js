import SubmitButton from "./SubmitButton"
import {useState} from 'react'
import { API_ADDRESS } from '../apiConfig'



function UserProfile({user}) {

    const [shwoUserProfile, setShowUserProfile] = useState(false)

    return (
        <div>
            
            <div className="userprofile-img clickable"
                 onClick={() => setShowUserProfile(true)}
                 style={{'backgroundImage': `url(${API_ADDRESS + user.userprofile.image})`}} data-tooltip="Profile"></div>

            {shwoUserProfile ? 
                <div className="userprofile">
                    <div className="backgroundhide"></div>
                    <div className="userprofile-container">
                        <div className="row">
                            <div className="column-2">
                                <div className="userprofile-img" style={{'backgroundImage': `url('${API_ADDRESS + user.userprofile.image}')`}}></div>
                                <h3 className="username">{user.username}</h3>
                                <p className="code">#{user.userprofile.code}</p>
                            </div>
                            <div className="column-2">
                                {user.username !== localStorage.getItem('username') ? 
                                    <SubmitButton label="Send friendship request" />
                                : null}
                            </div>
                        </div>
                        <div className="description row">
                            <p>{user.userprofile.description}</p>
                        </div>
                
                        <button onClick={() => setShowUserProfile(false)} className="closeprofile">
                            <i className="fas fa-times clickable"></i>
                        </button>
                    </div>
                </div>
            : null}
        </div>
    )
}

export default UserProfile