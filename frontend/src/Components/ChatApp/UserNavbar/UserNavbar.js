import {useState} from 'react'
import UserConfigPanel from './UserConfigPanel/UserConfigPanel'
import UserMailbox from './UserMailbox/UserMailbox'
import { API_ADDRESS } from '../../apiConfig'



function UserNavbar({handleLogout, getCommunities, sendMessage}) {

    //COMPONENT STATE FOR SHOW/HIDE USER CONFIG
    const [showUserConfig, setShowUserConfig] = useState(false)

    const [showUserMailbox, setShwoUserMailbox] = useState(false)


    return (
        <div>
            <div className={`user-navbar ${showUserMailbox ? 'force-hover' : ''} flex-v-alings`}>
                <div className="userprofile-img" style={{'backgroundImage': `url('${API_ADDRESS + localStorage.getItem('image')}')`}}></div>
                <div className='flex-v-alings'>
                    <i onClick={() => setShwoUserMailbox(!showUserMailbox)} className="fas fa-envelope clickable"></i>
                    <i onClick={() => setShowUserConfig(true)} className="fas fa-cog clickable"></i>
                    <i onClick={handleLogout} className="fas fa-sign-out-alt clickable" ></i>
                </div>
            </div>

            {showUserConfig ? 
                <UserConfigPanel setShowUserConfig={setShowUserConfig}/>
            : null}

            {showUserMailbox ?
                <UserMailbox getCommunities={getCommunities}
                             sendMessage={sendMessage} />
            : null}

        </div>
        
    )
    
}

export default UserNavbar