import { useState } from "react"
import axios from 'axios'
import NewActionMessage from "../Utils/NewActionMessage"
import UserFinder from "../Utils/UserFinder"
import EditCommunityApp from "./EditCommunity/EditCommunityApp"
import SubmitButton from "../Utils/SubmitButton"
import AlertMessage from "../Utils/AlertMessage"
import { API_ADDRESS } from "../apiConfig"



function CurrentCommunityPanel({isAdmin, currentCommunity, getCommunities, communityChatsList, setCurrentChat, getCommunityChatsMessages, getCommunityChats, sendMessage}) {

    //COMPONENT STATE FOR VISIBILITY OF COMMUNITY OPTIONS MENU
    const [showCommunityOptions, setShowCommunityOptions] = useState(false)

    //COMPONENT STATE TO SHOW/HIDE COMMUNITY EDIT APP
    const [editCommunity, setEditCommunity] = useState(false)

    //COMPONENT STATE TO SHOW/HIDE INVITE USER
    const [inviteUser, setInviteUser] = useState(false)

    //COMPONENT STATE TO SHOW/HIDE NEW CHAT
    const [newChat, setNewChat] = useState(false)

    //COMPONENT STATE TO SHOW/HIDE LEAVE COMMUNITY
    const [leaveCommunity, setLeaveCommunity] = useState(false)

    //MESSAGES CONTAINER DOM OBJECT
    const messageContainer = document.querySelector('#messages-list')


    //FUNCTION TO CHANGE THE CURRENT COMMUNITY CHAT (currentChat, getCommunityChatsMessages)
    const handleChangeCurrentChat = (chat) => {
        setCurrentChat(chat)
        getCommunityChatsMessages(chat.code)
        setTimeout(() => {messageContainer.scrollTop = messageContainer.scrollHeight}, 100)
    }


    //FUNCTION TO SHOW/HIDE OPTIONS MENU
    const changeCommunityOptionsVisibility = () => {
        setShowCommunityOptions(!showCommunityOptions)
    }


    //FUNCTION TO HIDE THE COMMUNITY CHAT LIST DOM OBJECT
    const hideCommunityChats = () => {
        setShowCommunityOptions(false)
        document.getElementsByClassName('community-chats')[0].style.width = 0;
        document.getElementsByClassName('current-chat-container')[0].style.width = '100%';
        document.querySelector('.open-menu-container').style.display = "flex"
        document.querySelector('#desplegable').style.display = "none"
    }


    //API FUNCTION FOR INVITE USER TO COMMUNITY
    const sendUserInvitation = async (user) => {
        await axios({method: "POST", 
                    url: `${API_ADDRESS}/api/community/invitations/`,
                    data: {community: currentCommunity.id, receiver: user.id, sender: localStorage.getItem('userid')},
                    headers: { "Content-Type": "application/json" }})
              .then(() => setInviteUser(false))
    }


    //API FUNCTION FOR CREATE NEW CHAT
    const createNewChat = async () => {
        let chatname = document.getElementById('newchatinput').value;
        await axios({method: "POST", 
                    url: `${API_ADDRESS}/api/community/chat/`,
                    data: {community: currentCommunity.id, name: chatname, type: 'community'},
                    headers: { "Content-Type": "application/json" }})
              .then((res) => {
                setNewChat(false)
                getCommunityChats()
                sendMessage(JSON.stringify({
                    'type': 'newchat',
                    'group': res.data.code
                }));
              })
    }


    //API FUNCTION FOR LEAVE THE COMMUNITY
    const userLeaveCommunity = async () => {
        await axios({method: "PUT", 
                    url: `${API_ADDRESS}/api/community/leave/`,
                    data: {code: currentCommunity.code},
                    headers: { "Content-Type": "application/json" }})
               .then(() => {
                   getCommunities()
                   setLeaveCommunity(false)
               })
    }


    return (
        <div className="community-chats">
            <div className="community-info">
                <button onClick={changeCommunityOptionsVisibility} className="community-name flex-vh-alings clickable">
                    <p><strong>{currentCommunity.name}</strong> </p>
                    <i className="fas fa-caret-down"></i>
                </button>
                <div className="close-menu-container flex-vh-alings">
                    <button onClick={hideCommunityChats} className="btn-displaymenu" >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div className="chats-list flex-v-alings flex-column-direction">
                {communityChatsList.map((chat, index) => (
                     <div className="chat-item-container" key={chat.code}>
                        <input onChange={() => handleChangeCurrentChat(chat)} className="item-check" id={`chat-${index}`} name="select-chat" type="radio" readOnly={true} defaultChecked={index===0 ? true : false} />
                        <label htmlFor={`chat-${index}`} className="chat-item">
                            <div className="chat-name flex-v-alings">
                                <i className="fas fa-inbox svg-icon"></i>
                                <p>{chat.name}</p>
                            </div>
                        </label>
                    </div>
                ))}
            </div>

            <div className={`currentcommunity-menu contextual-menu ${showCommunityOptions ? 'visible' : ''}`}>
                <ul className="menu">
                    {isAdmin ? 
                        <li className="item" onClick={() => {setEditCommunity(true); setShowCommunityOptions(false)}}>Edit community <i className="fas fa-cogs"></i></li>
                    : null}
                    {isAdmin ?
                        <li className="item" onClick={() => {setInviteUser(true); setShowCommunityOptions(false);}}>Invite user <i className="fas fa-user-plus"></i></li>
                    : null}
                    {isAdmin ?
                        <li className="item" onClick={() => {setNewChat(true); setShowCommunityOptions(false);}}>Add chat <i className="fas fa-inbox"></i></li>
                    : null}
                    <li className="item highlight" onClick={() => {setLeaveCommunity(true); setShowCommunityOptions(false);}}>Leave community <i className="fas fa-door-open"></i></li>
                </ul>
            </div>
            
            {editCommunity ?
                <EditCommunityApp setEditCommunity={setEditCommunity}
                                  getCommunities={getCommunities}
                                  currentCommunity={currentCommunity}
                                  getCommunityChats={getCommunityChats} />
            : null}

            {inviteUser ?
                <NewActionMessage>
                    <h3>Invite user to current community</h3>
                    <UserFinder userFunction={sendUserInvitation} cancelFindUser={setInviteUser} />
                </NewActionMessage>
            : null}

            {newChat ?
                <NewActionMessage>
                    <h3>Add a new chat to the community</h3>
                    <div className="defaultform flex-v-alings flex-column-direction">
                        <input className="styled-input" 
                               id="newchatinput"
                               name="name"
                               placeholder="Chat name..." />
                        <div className="flex-h-alings">
                            <SubmitButton label="Create"
                                          onClick={() => createNewChat()} />
                            <SubmitButton label="Cancel" 
                                          type="action"
                                          onClick={() => setNewChat(false)} />
                        </div>
                    </div>
                </NewActionMessage>
            : null}

            {leaveCommunity ?
                <AlertMessage accept={userLeaveCommunity} cancel={setLeaveCommunity}>
                    <p>Are you sure you want to leave the community?</p>
                </AlertMessage>
            : null}

        </div>
    )
}

export default CurrentCommunityPanel