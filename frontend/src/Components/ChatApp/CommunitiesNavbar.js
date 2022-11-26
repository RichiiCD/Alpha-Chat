import { useState, useEffect } from 'react'
import axios from 'axios'
import NewActionMessage from '../Utils/NewActionMessage'
import SubmitButton from '../Utils/SubmitButton'
import { API_ADDRESS } from '../apiConfig'



function CommunitiesNavbar({changeCurrentCommunity, communities, getCommunities, sendMessage}) {

    //COMPONENT STATE TO SHOW/HIDDE NEW COMMUNITY MESSAGE
    const [showNewCommunity, setShowNewCommunity] = useState(false)


    //API FUNCTION TO CREATE NEW COMMUNITY
    const createNewCommunity = async () => {
        let name = document.getElementById('newcommunityinput').value;
        await axios({method: 'POST',
                     url: `${API_ADDRESS}/api/community/`,
                     headers: { "Content-Type": "application/json"},
                     data: {community: {name: name}}})
              .then((res) => {
                sendMessage(JSON.stringify({
                    'type': 'newcommunity',
                    'community': res.data.code
                }));
                setShowNewCommunity(false)
                getCommunities()
              })
    }

   
    return (
        <div className="community-navbar flex-v-alings">
            <input className="item-check" id='community-0' name="select-community" type="radio" onChange={() => changeCurrentCommunity('friends')}/>
            <label htmlFor='community-0' style={{'backgroundImage': `url(${process.env.PUBLIC_URL}/img/friends.svg)`}} className='community-card friends-item'></label>
            <div className='friends-separator'></div>
            {communities ? 
                communities.map((elm, index) => (
                    <div key={elm.code} className='community-item flex-v-alings'>
                        <input onChange={() => changeCurrentCommunity(elm)} className="item-check" id={`community-${index+1}`} name="select-community" type="radio" defaultChecked={ index===0 ? true : false } />
                        <label style={{'backgroundImage': `url(${API_ADDRESS + elm.image})`}} htmlFor={`community-${index+1}`} className="community-card"></label>
                    </div>
                ))
            : null}
            <label onClick={() => setShowNewCommunity(true)} className="community-card add-community flex-vh-alings clickable">
                <i className="fas fa-plus"></i>
            </label>


            {showNewCommunity ?
                <NewActionMessage>
                    <h3 className='newaction-title'>Create a new Community</h3>
                        <div className="defaultform flex-v-alings flex-column-direction">
                            <input className="styled-input"
                                    type="text"
                                    id="newcommunityinput"
                                    name="name"
                                    placeholder="Community name..." />
                            <div className="flex-h-alings">
                                <SubmitButton label="Create"
                                              onClick={() => createNewCommunity()} />
                                <SubmitButton label="Cancel" 
                                              type="action"
                                              onClick={() => setShowNewCommunity(false)} />
                            </div>
                        </div>
                </NewActionMessage>
            : null}

        </div>
        
    )
}

export default CommunitiesNavbar