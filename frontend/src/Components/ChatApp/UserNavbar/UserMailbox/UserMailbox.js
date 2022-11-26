import {useState, useEffect} from 'react'
import axios from 'axios'
import { API_ADDRESS } from '../../../apiConfig'



function UserMailbox({getCommunities, sendMessage}) {

    //COMPONENT STATE TO STORAGE FRIENDSHIP REQUESTS
    const [friendshipRequests, setFriendshipsRequests] = useState([])
    
    //COMPONENT STATE TO STORAGE COMMUNITY INVITATIONS
    const [communityInvitations, setCommunityInvitations] = useState([])

    //COMPONENT STATE TO STORAGE IF THE MAILBOX IS IN FRIENDS/COMMUNITY
    const [mailboxType, setMailboxType] = useState('friends')


    //API FUNCTION TO GET FRIENDSHIP REQUESTS (friendshipRequests)
    const getFriendshipRequest = async () => {
        await axios({method: "GET", 
                     url: `${API_ADDRESS}/api/user/friends/request/`, 
                     headers: { "Content-Type": "application/json" }})
              .then((res) => {
                    setFriendshipsRequests(res.data)
               })
    }


    //API FUNCTION TO GET COMMUNITY INVITATIONS (communityInvitations)
    const getCommunityInvitations = async () => {
        await axios.get(`${API_ADDRESS}/api/community/invitations/`, {params: {type: 'user'}})
                   .then((res) => setCommunityInvitations(res.data))
    }


    //HOOK TO CALL API FUNCTIONS WHEN COMPONENT RENDERED
    useEffect(() => {
        getFriendshipRequest()
        getCommunityInvitations()
    }, [])


    //API FUNCTION TO RESPONSE FRIENDSHIP REQUESTS
    const responseFriendshipRequest = async (id, response) => {
        await axios({method: "POST", 
                    url: `${API_ADDRESS}/api/user/friends/request/response/`, 
                    headers: { "Content-Type": "application/json" },
                    data: {id: id, response: response}})
              .then(() => {
                getFriendshipRequest()
              })
    }


    //API FUNCTION TO RESPONSE COMMUNITY INVITATIONS 
    const responseCommunityInvitation = async (code, response) => {
        await axios({method: "POST", 
                    url: `${API_ADDRESS}/api/community/invitations/response/`, 
                    headers: { "Content-Type": "application/json" },
                    data: {code: code, response: response}})
               .then((res) => {
                    getCommunityInvitations()
                    getCommunities()
                    if (response === 'accept') {
                        sendMessage(JSON.stringify({
                            'type': 'newcommunity',
                            'community': res.data.code
                        }));
                    }
               })
    }


    //FUNCTION TO CHANGE MAILBOX TYPE FRIENDS/COMMUNITIES
    const changeMailboxType = () => {
        let type = document.querySelector('input[name=mailbox-type]:checked').value
        setMailboxType(document.querySelector('input[name=mailbox-type]:checked').value)
        if (type == 'friends') {
            getFriendshipRequest()
        } else {
            getCommunityInvitations()
        }
    }


    return (
        <div className={`mailbox-menu contextual-menu visible`}>

            <div className='mailbox-type flex-v-alings'>
                <input onChange={() => changeMailboxType()} id="mailbox-friends" type="radio" name='mailbox-type' value='friends' defaultChecked />
                <label htmlFor='mailbox-friends'>Friends</label>
                <input onClick={() => changeMailboxType()} id="mailbox-communities" type="radio" name='mailbox-type' value='communities' />
                <label htmlFor='mailbox-communities'>Communities</label>
            </div>
            
            <ul className="menu">
                {mailboxType === 'friends' ? 
                
                    friendshipRequests.length > 0 ? 
                        friendshipRequests.map((request) => (
                            <li key={request.id} className="item flex-v-alings">
                                <div className="userprofile-img" style={{'backgroundImage': `url('${API_ADDRESS + request.sender.userprofile.image}')`}}></div>
                                <p>{request.sender.username}</p>
                                <div className='request-response-container flex-vh-alings'>
                                    <button onClick={() => responseFriendshipRequest(request.id, 'accept')} className='response-btn accept flex-vh-alings clickable'>
                                        <i className="fas fa-check"></i>
                                    </button>
                                    <button onClick={() => responseFriendshipRequest(request.id, 'reject')} className='response-btn reject flex-vh-alings clickable'>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </li>
                        ))
                    :
                    <p className='nothing-found'>Nothing found : (</p>

                : 
                    
                    communityInvitations.length > 0 ? 
                        communityInvitations.map((invitation) => (
                            <li key={invitation.id} className="item flex-v-alings">
                                <div className="userprofile-img" style={{'backgroundImage': `url('${API_ADDRESS + invitation.community.image}')`}}></div>
                                <p>{invitation.community.name}</p>
                                <div className='request-response-container flex-vh-alings'>
                                    <button onClick={() => responseCommunityInvitation(invitation.code, 'accept')} className='response-btn accept flex-vh-alings clickable'>
                                        <i className="fas fa-check"></i>
                                    </button>
                                    <button onClick={() => responseCommunityInvitation(invitation.code, 'reject')} className='response-btn reject flex-vh-alings clickable'>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </li>
                        ))
                    : 
                    <p className='nothing-found'>Nothing found : (</p>
                }
            </ul>


        </div>
    )
}



export default UserMailbox