import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useWebSocket from 'react-use-websocket';
import CommunitiesNavbar from "./CommunitiesNavbar";
import CurrentCommunity from "./CurrentCommunity";
import UserNavbar from './UserNavbar/UserNavbar';
import FriendsChat from './FriendsChat/FriendsChat';
import Notification from '../Utils/Notification';
import './ChatAppStyles.css'
import '../Utils/UtilsStyles.css'
import '../../fontawesome/css/all.css'
import { API_ADDRESS, WS_ADDRESS } from '../apiConfig';



function ChatApp() {
  
    //SET AXIOS AUTHORIZATION TOKEN HEADER
    axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('token')

    //CUSTOM HOOK WEB SOCKET
    const {sendMessage, lastMessage, readyState} = useWebSocket(`${WS_ADDRESS}/ws/chat/?token=${localStorage.getItem('token')}`);
    
    //CUSTOM HOOK REDIRECTION
    const navigate = useNavigate()

    //COMPONENT STATE FOR SET ALL THE USER COMMUNITIES
    const [communities, setCommunities] = useState([])
    
    //COMPONENT STATE FOR SET THE CURRENT COMUNNITY THE USER IS IN
    const [currentCommunity, setCurrentCommunity] = useState({code: '', name: ''})
    
    //COMPONENT STATE FOR SET THE CURRENT COMUNNITY CHAT THE USER IS IN
    const [currentChat, setCurrentChat] = useState({code: '', name: ''})
    
    //COMPONENT STATE FOR SET ALL THE MESSAGES OF THE CURRENT USER COMUNNITY CHAT THE USER IS IN
    const [currentChatMessages, setCurrentChatMessages] = useState([])

    //COMPONENT STATE TO STORAGE REPLAYED MESSAGE
    const [replayedMessage, setReplayedMessage] = useState(null)

    //COMPONENT STATE TO SET IF FRIENDS CHATS IS SELECTED
    const [showFriendsChat, setShowFriendsChats] = useState(false)

    //COMPONENT STATE FOR SET IF THE USER IS THE COMMUNITY ADMIN
    const [isAdmin, setIsAdmin] = useState(false)
    
    //ARRAY FOR STORAGE TEMPORARILY THE KEYS THAT THE USER PRESSES
    const [keysPressed, setKeysPressed] = useState([])

    //TIMEOUT WHEN THE USER SEND A MESSAGE TO WAIT TO SEND ANOTHER
    const [sendTimeout, setSendTimeout] = useState(true)

    //COMPONENT STATE TO STORAGE THE LATESTS NOTIFICATIONS
    const [latestsNotifications, setLatestsNotifications] = useState([]);
    
    //COMPONENT STATE WHEN IT COMMUNITY IS LOADING
    const [isLoading, setIsLoading] = useState(true)
    
    //MESSAGES CONTAINER DOM OBJECT
    const messageContainer = document.querySelector('#messages-list')


    //FUNCTION TO RECIVE MESSAGES VIA THE WEB SOCKET HOOK (lastMessage, currentChatMessages)
    useEffect(() => {
        if (lastMessage != null) {
            let data = JSON.parse(lastMessage.data)
            if (data.type == 'message') {
                if (data.content.chat.id == currentChat.id) {
                    let time = new Date(data.content.datetime);
                    time = time.getHours() + ':' + time.getMinutes() + ' - ' + time.toLocaleDateString();
                    let message = {...data.content, datetime: time}
                    let newMessage = currentChatMessages.concat(message)
                    setCurrentChatMessages(newMessage)
                    setTimeout(() => {messageContainer.scrollTop = messageContainer.scrollHeight}, 100)
                } else {
                    setLatestsNotifications([data.content].concat(latestsNotifications))
                }
            } else if (data.type == 'deletedmessage') {
                setCurrentChatMessages(currentChatMessages.filter((message) => message.id != data.id))
            } else if (data.type == 'editedmessage') {
                setCurrentChatMessages(currentChatMessages.map((message) => {
                    if (message.id == data.id) {
                        return {...message, content: data.content, edited: true};
                    }
                    return message;
                }
                ))
            }
        }
    }, [lastMessage])


    //FUNCTION TO SEND MESSAGES VIA THE WEB SOCKET HOOK (sendMessage, sendTimeout)
    useEffect(() => {
        if (currentCommunity) {
            if (sendTimeout) {
                let inputElement = document.querySelector('#btn-message')
                if (keysPressed.includes('Escape')) {
                    setReplayedMessage(null)
                }
                if (keysPressed.includes('Shift') && keysPressed.includes('Enter')) {
                    document.execCommand('insertLineBreak');
                } else {
                    if (keysPressed.includes('Enter')) {
                        if (inputElement.innerHTML) {
                            let message = inputElement.innerHTML.replaceAll('<br>', '\r');
                            sendMessage(JSON.stringify({
                                'type': 'message',
                                'message': message,
                                'replayed': replayedMessage ? replayedMessage.id : null,
                                'group': currentChat.code
                            }));
                            inputElement.innerText = "";
                            setReplayedMessage(null)
                            setSendTimeout(false)
                            setTimeout(() => {setSendTimeout(true)}, 300)
                        }          
                    }
                }
            }
        }
    }, [keysPressed])


    //API FUNCTION TO GET ALL USER COMMUNITIES (communities)
    const getCommunities = async () => {
        await axios({method: "GET", 
                    url: `${API_ADDRESS}/api/community/`, 
                    headers: { "Content-Type": "application/json" }})
                .then((res) => {
                    if ((res.data && !currentCommunity.code) || communities.length > res.data.length) {
                        changeCurrentCommunity(res.data[0])
                    }
                    setCommunities(res.data)
                })
    }


    //FUNCTION TO CALL THE COMMUNITY API WHEN THE COMPONENT IS RENDERED (communities)
    useEffect(() => {
        getCommunities()
    }, [])


    //API FUNCTION TO GET ALL USER COMMUNITY CHAT MESSAGES (currentChatMessages, messageContainer)
    const getCommunityChatsMessages = async (chat) => {
        axios.get(`${API_ADDRESS}/api/community/chat/messages/`, {params: {chat: chat}}).then((res) => {
            setCurrentChatMessages(res.data.map((message => {
                let time = new Date(message.datetime);
                time = time.getHours() + ':' + time.getMinutes() + ' - ' + time.toLocaleDateString();
                return {...message, datetime: time}
            })));
        })
    }


    //FUNCTION TO CHANGE THE CURRENT COMMUNITY IN WHICH THE USER IS (currentCommunity, isLoading)
    const changeCurrentCommunity = (community) => {
        if (community) {
            if (community === 'friends') {
                setShowFriendsChats(true)
            } else {
                setShowFriendsChats(false)
                if (community.admin_user.username == localStorage.getItem('username')) {
                    setIsAdmin(true)
                } else {
                    setIsAdmin(false)
                }
                setCurrentCommunity(community)
            }
        }
        setIsLoading(false)
    }


    //FUNCTION TO ADD THE KEY THAT THE USER PRESSES (keysPressed)
    const handleKeyPressDown = (event) => {
        setKeysPressed([...keysPressed, event.key])
        if (event.key == "Enter") {
            event.preventDefault()
        }
    }


    //FUNCTION TO REMOVE THE KEY THAT THE USER STOPS PRESSING (keysPressed)
    const handleKeyPressUp = (event) => {
        setKeysPressed(keysPressed.filter(key => key !== event.key))
    }


    //FUNCTION TO HANDLE THE USER LOGOUT (navigate)
    const handleLogout = async () => {
        await axios({method: "POST", 
                    url: `${API_ADDRESS}/api/logout/`, 
                    headers: { "Content-Type": "application/json" }})
            .then(() => {
                localStorage.setItem('isAuthenticated', 'false')
                localStorage.removeItem('username')
                localStorage.removeItem('token')
                localStorage.removeItem('userid')
                localStorage.removeItem('image')
                localStorage.removeItem('userobj')
                navigate('/login/')
            })
    }


    return (
        <div className="root-app">

            <CommunitiesNavbar changeCurrentCommunity={changeCurrentCommunity}
                                communities={communities}
                                getCommunities={getCommunities}
                                sendMessage={sendMessage} />

            {!isLoading ? showFriendsChat ? 

                <FriendsChat handleKeyPressDown={handleKeyPressDown} 
                            handleKeyPressUp={handleKeyPressUp}
                            setCurrentChat={setCurrentChat}
                            getCommunityChatsMessages={getCommunityChatsMessages} 
                            currentChatMessages={currentChatMessages}
                            sendMessage={sendMessage} />
        
            : currentCommunity.code ?  

                <CurrentCommunity isAdmin={isAdmin}
                                currentCommunity={currentCommunity}
                                getCommunities={getCommunities}
                                setCurrentChat={setCurrentChat}
                                currentChat={currentChat}
                                currentChatMessages={currentChatMessages}
                                setCurrentChatMessages={setCurrentChatMessages}
                                getCommunityChatsMessages={getCommunityChatsMessages}
                                handleKeyPressDown={handleKeyPressDown} 
                                handleKeyPressUp={handleKeyPressUp}
                                sendMessage={sendMessage}
                                setReplayedMessage={setReplayedMessage}
                                replayedMessage={replayedMessage} />

            : 
                <div className='welcome-container'>
                    <img src={process.env.PUBLIC_URL + "/img/logoname.svg"} />
                    <p>¡Welcome to Alpha new user!</p>
                    <p>To start interacting with other users, add a friend or join a community.</p>
                </div>

            : null}

            <UserNavbar handleLogout={handleLogout}
                        getCommunities={getCommunities}
                        sendMessage={sendMessage} />
            
            
            {latestsNotifications.length > 0 ?
                <div className='notifications-list'>
                    {latestsNotifications.map((notification) => (
                        <Notification key={notification.id}
                        notification={notification}
                        latestsNotifications={latestsNotifications}
                        setLatestsNotifications={setLatestsNotifications} />
                        ))}
                </div>
            : null}
        </div>

    )
}


export default ChatApp;
