import { useState, useEffect } from "react"
import axios from 'axios'
import UserProfile from "../../Utils/UserProfile"
import CurrentFriendsChat from "./CurrentFriendsChat"
import UserFinder from "../../Utils/UserFinder"
import NewActionMessage from "../../Utils/NewActionMessage"
import { API_ADDRESS } from "../../apiConfig"



function FriendsChat({setCurrentChat, getCommunityChatsMessages, currentChatMessages, handleKeyPressDown, handleKeyPressUp, sendMessage}) { 

    //COMPONENT STATE TO SET ALL THE USER FRIENDS CHAT
    const [friendsChatList, setFriendsChatList] = useState([])

    //COMPONENT STATE TO SET SELECTED CHAT
    const [selectedChat, setSelectedChat] = useState()

    //COMPONENT STATE TO SHOW/DISPLAY FRIENDS OPTIONS
    const [showFriendsOptions, setShowFriendsOptions] = useState(false)

    //COMPONENT STATE TO SHOW/DISPLAY NEW CHAT MESSAGE
    const [showNewChat, setShowNewChat] = useState(false)

    //COMPONENT STATE TO SHOW/DISPLAY SEND FRIEND REQUEST
    const [showSendFriendRequest, setShowSendFriendRequest] = useState(false)

    //COMPONENT STATE TO SHOW/HIDE LOADING SPINNER
    const [isLoading, setIsLoading] = useState(true)


    //API FUNCTION TO GET ALL USER FRIENDS CHATS
    const getFriendChats = async () => {
        await axios.get(`${API_ADDRESS}/api/community/chat/`, {params: {type: 'friends'}})
            .then((res) => {
                if (res.data.length > 0) {
                    getCommunityChatsMessages(res.data[0].code)
                    setCurrentChat(res.data[0])
                    setSelectedChat(res.data[0])
                    setFriendsChatList(res.data)
                    setIsLoading(false)
                }
            })
    }

    
    //FUNCTION TO CALL THE FRIENDS CHATS API WHEN THE COMPONENT IS RENDERED
    useEffect(() => {
        getFriendChats()
    }, [])


    //API FUNCTION TO CREATE NEW FRIENDS CHAT
    const createNewFriendsChat = async (user) => {
        await axios({method: "POST", 
                    url: `${API_ADDRESS}/api/community/chat/`,
                    data: {type: "friends", friends: [user.id]},
                    headers: { "Content-Type": "application/json" }})
                .then((res) => {
                    sendMessage(JSON.stringify({
                        'type': 'newchat',
                        'group': res.data.code
                    }));
                    getFriendChats();
                    setShowNewChat(false);
                })
    }


    //API FUNCTION TO SEND FRIEND REQUEST
    const sendFriendRequest = async (user) => {
        await axios({method: "POST", 
                    url: `${API_ADDRESS}/api/user/friends/request/`,
                    data: {receiver: user.id},
                    headers: { "Content-Type": "application/json" }})
                .then(() => {
                    setShowSendFriendRequest(false);
                })
    }


    //FUNCTION TO HIDE THE FRIENDS CHAT LIST DOM OBJECT
    const hideCommunityChats = () => {
        setShowFriendsOptions(false);
        document.getElementsByClassName('friends-chats')[0].style.width = 0;
        document.getElementsByClassName('current-chat-container')[0].style.width = '100%';
        document.querySelector('.open-menu-container').style.display = "flex";
        document.querySelector('#desplegable').style.display = "none";
    }

    
    return (
        <div className="friendchats-container">
            <div className="friends-chats">
                <div className="friends-info">
                    <button onClick={() => setShowFriendsOptions(!showFriendsOptions)} className="friends-name flex-vh-alings clickable">
                        <p><strong>FRIENDS</strong> </p>
                        <i className="fas fa-caret-down"></i>
                    </button>
                    {friendsChatList.length > 0 ? 
                        <div className="close-menu-container flex-vh-alings">
                            <button onClick={hideCommunityChats} className="btn-displaymenu" >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    : null}
                </div>
                <div className="chats-list flex-v-alings flex-column-direction">
                    {friendsChatList.map((chat, index) => (
                        <div className="chat-item-container" key={chat.code}>
                            <input onChange={() => {setSelectedChat(chat); setCurrentChat(chat); getCommunityChatsMessages(chat.code)}} className="item-check" id={`chat-${index}`} name="select-chat" type="radio" readOnly={true} defaultChecked={index===0 ? true : false} />
                            <label htmlFor={`chat-${index}`} className="chat-item">
                                <div className="chat-name flex-v-alings">
                                    <UserProfile user={chat.friends[0].username == localStorage.getItem('username') ? chat.friends[1] : chat.friends[0]} />
                                    <p>{chat.friends[0].username == localStorage.getItem('username') ? chat.friends[1].username : chat.friends[0].username}</p>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className={`currentcommunity-menu contextual-menu ${showFriendsOptions ? 'visible' : ''}`}>
                    <ul className="menu">
                        <li onClick={() => {setShowNewChat(true); setShowFriendsOptions(false);}} className="item">New message <i className="fas fa-comment"></i></li>
                        <li onClick={() => {setShowSendFriendRequest(true); setShowFriendsOptions(false)}} className="item">Send friend request <i className="fas fa-paper-plane"></i></li>
                    </ul>
                </div>
            </div>

            {showNewChat ? 
                <NewActionMessage>
                    <h3>New Message</h3>
                    <UserFinder userFunction={createNewFriendsChat} cancelFindUser={setShowNewChat} />
                </NewActionMessage>
            : null}

            {showSendFriendRequest ? 
                <NewActionMessage>
                    <h3>Send friend request</h3>
                    <UserFinder userFunction={sendFriendRequest} cancelFindUser={setShowSendFriendRequest} />
                </NewActionMessage>
            : null}

            {friendsChatList.length > 0 ?
                <CurrentFriendsChat chat={selectedChat}
                                    currentChatMessages={currentChatMessages}
                                    handleKeyPressUp={handleKeyPressUp}
                                    handleKeyPressDown={handleKeyPressDown}
                                    sendMessage={sendMessage}
                                    isLoading={isLoading} />
            : null}
        </div>
    )
}

export default FriendsChat