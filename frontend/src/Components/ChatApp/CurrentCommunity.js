import { useEffect, useState } from 'react'
import axios from 'axios'
import CurrentCommunityPanel from "./CurrentCommunityPanel"
import CurrentCommunityChat from "./CurrentCommunityChat"
import { API_ADDRESS } from '../apiConfig'


function CurrentCommunity({isAdmin, currentChatMessages, getCommunities, getCommunityChatsMessages, setCurrentChat, currentChat, handleKeyPressDown, handleKeyPressUp, currentCommunity, sendMessage, setReplayedMessage, replayedMessage}) {
    
    //COMPONENT STATE TO SET ALL THE USER COMMUNITY CHAT
    const [communityChatsList, setCommunityChatsList] = useState([])

    //COMPONENT STATE TO SHOW/HIDE LOADING SPINNER
    const [isLoading, setIsLoading] = useState(true)


    //API FUNCTION TO GET ALL USER COMMUNITY CHATS
    const getCommunityChats = async () => {
        if (currentCommunity.code !== '') {
            await axios.get(`${API_ADDRESS}/api/community/chat/`, {params: {community: currentCommunity.code, type: 'community'}})
                .then((res) => {
                    setCommunityChatsList(res.data)
                    setCurrentChat(res.data[0])
                    getCommunityChatsMessages(res.data[0].code)
                    setIsLoading(false)
                })
        }   
    }


    //FUNCTION TO CALL THE COMMUNITY CHATS API WHEN THE COMPONENT IS RENDERED
    useEffect(() => {
        getCommunityChats()
    }, [currentCommunity])
    
    
    return (
        <div className="community-container">
            <CurrentCommunityPanel isAdmin={isAdmin}
                                   getCommunities={getCommunities}
                                   currentCommunity={currentCommunity} 
                                   communityChatsList={communityChatsList} 
                                   setCurrentChat={setCurrentChat}
                                   getCommunityChatsMessages={getCommunityChatsMessages}
                                   getCommunityChats={getCommunityChats}
                                   sendMessage={sendMessage} />
                                   
            <CurrentCommunityChat currentChat={currentChat} 
                                  currentChatMessages={currentChatMessages}
                                  handleKeyPressDown={handleKeyPressDown} 
                                  handleKeyPressUp={handleKeyPressUp}
                                  getCommunityChatsMessages={getCommunityChatsMessages} 
                                  sendMessage={sendMessage}
                                  setReplayedMessage={setReplayedMessage}
                                  replayedMessage={replayedMessage}
                                  isLoading={isLoading} />
        </div>
    )
}


export default CurrentCommunity