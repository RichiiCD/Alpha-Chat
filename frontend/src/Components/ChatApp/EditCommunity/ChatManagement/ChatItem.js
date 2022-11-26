import {useState} from 'react'
import axios from 'axios'



function ChatItem({chat, displayAlertMessage, getCommunityChats, isUnique}) {

    //COMPONENT STATE FOR DISPLAY CHAT OPTIONS
    const [showChatOptions, setShowChatOptions] = useState(false)

    //OBJECT FOR STORAGE THE X AND Y MOUSE POSITION
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0})

    //COMPONENT STATE FOR MODIFY THE CHAT
    const [modifyChat, setModifyChat] = useState({type: '', value: false})


    //FUNCTION FOR DISPLAY MEMEBER OPTIONS (showChatOptions, mousePosition)
    const displayChatOptions = (e) => {
        setShowChatOptions(!showChatOptions)
        setMousePosition({x: e.pageX, y: e.pageY})
    }


    //FUNCTION TO ACTIVATE CHAT MODIFICATION
    const activeChatModification = (type) => {
        setModifyChat({type: type, value: true})
        setShowChatOptions(!showChatOptions)
        const editableElement = document.getElementById(`${type}_${chat.code}`)
        setTimeout(() => {
            editableElement.focus()
        }, 100);
    }


    //FUNCTION TO HANDLE KEYPRESSDOWN WHEN CHAT MODIFICATION
    const handleKeyPressDown = async(e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            let data = {}
            if (modifyChat.type == 'chat') {
                data = {community: chat.community, code: chat.code, name: e.target.innerText, description: chat.description, type: 'community'}
            } else {
                data = {community: chat.community, code: chat.code, name: chat.name, description: e.target.innerText, type: 'community'}
            }
            await axios({method: "PUT", 
                        url: "http://127.0.0.1:8000/api/community/chat/",
                        data: data,
                        headers: { "Content-Type": "application/json" }})
                    .then(() => {
                        setModifyChat({type: '', value: false})
                        getCommunityChats()
                    })
        }
    }


    return (
        <div className="settings-item flex-v-alings">
            <i className="fas fa-inbox svg-icon"></i>
            <div>
                <p id={`chat_${chat.code}`} className='title' contentEditable={modifyChat.value && modifyChat.type === 'chat' ? true : false} 
                   suppressContentEditableWarning={true} onKeyDown={(e) => handleKeyPressDown(e)}>
                       {chat.name}
                </p>
                <p id={`desc_${chat.code}`} className='subtitle' contentEditable={modifyChat.value && modifyChat.type === 'desc' ? true : false} 
                   suppressContentEditableWarning={true} onKeyDown={(e) => handleKeyPressDown(e)}>
                       {chat.description}
                </p>
            </div>

            <i onClick={(e) => displayChatOptions(e)} className="fas fa-ellipsis-v options clickable"></i>
            <div style={{top: mousePosition.y, left: mousePosition.x}} className={`settingsmenu contextual-menu ${showChatOptions ? 'visible' : ''}`}>
                <ul className="menu">
                    <li onClick={() => activeChatModification('chat')} className="item">Rename chat</li>
                    <li onClick={() => activeChatModification('desc')} className="item">Change description</li>            
                    {!isUnique ? 
                        <li onClick={() => displayAlertMessage(chat.code)} className="item highlight">Delete chat</li>
                    : null}
                </ul>
            </div>
        </div>
    )
}

export default ChatItem