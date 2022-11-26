import {useState, useEffect} from 'react'
import axios from 'axios'
import ChatItem from './ChatItem'
import AlertMessage from '../../../Utils/AlertMessage'
import { API_ADDRESS } from '../../../apiConfig'



function ChatManagement({currentCommunity, getCommunityChats}) {

    //COMPONENT STATE FOR SET ALL THE COMMUNITY CHATS
    const [communityChats, setCommunityChats] = useState([])

    //COMPONENT STATE FOR SELECTED CHAT
    const [selectedChat, setSelectedChat] = useState('')

    //COMPONENT STATE FOR DISPLAY ALERT MESSAGE
    const [showAlertMessage, setShowAlertMessage] = useState(false)

    
    //API FUNCTION TO GET ALL THE COMMUNITY CHATS (communityChats)
    const getCommunityChatList = async () => {
        await axios.get(`${API_ADDRESS}/api/community/chat/`, {params: {community: currentCommunity.code, type: 'community'}})
              .then((res) => setCommunityChats(res.data))
    }


    //FUNCTION TO CALL THE COMMUNITY CHATS API WHEN THE COMPONENT IS RENDERED (communityChats)
    useEffect(() => {
        getCommunityChatList()
    }, [])


    //FUNCTION TO SHOW ALERT MESSAGE (selectedChat, showAlertMessage)
    const displayAlertMessage = (chat) => {
        setShowAlertMessage(true)
        setSelectedChat(chat)
    }


    //API FUNCTION TO DELETE THE SELECTED CHAT
    const handleDeleteChat = async () => {
        await axios({method: "DELETE", 
                     url: `${API_ADDRESS}/api/community/chat/`,
                     data: {code: selectedChat},
                     headers: { "Content-Type": "application/json" }})
              .then(() => {
                  setCommunityChats(communityChats.filter(chat => chat.code !== selectedChat))
                  setShowAlertMessage(false)
                  getCommunityChats()
                })
    }


    return (
        <div className="chatmanagement rightpanel-animation">
            <h2>Chat management</h2>
            <p>Manage all chats in the community.</p>
            <div className='settings-list'>
                {communityChats.map(chat => (
                    <ChatItem key={chat.id}
                              chat={chat}
                              displayAlertMessage={displayAlertMessage}
                              getCommunityChats={getCommunityChats}
                              isUnique={communityChats.length<2} />
                ))}
            </div>

            {showAlertMessage ? 
                <AlertMessage accept={handleDeleteChat} cancel={setShowAlertMessage} >
                    <p>Are you sure you want to delete this chat?</p>
                </AlertMessage>
            : null}
        </div>
    )
}

export default ChatManagement