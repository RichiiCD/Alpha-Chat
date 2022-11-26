import { useState } from 'react'
import UserProfile from './UserProfile'


function Message({message, deleteMessage, editMessage, setReplayedMessage}) {

    //COMPONENT STATE TO EDIT MESSAGE
    const [isEditable, setIsEditable] = useState(false)


    //FUNCTION TO DISPLAY CONTENT EDITABLE MESSAGE
    const displayEditMessage = () => {
        setIsEditable(true)
        const editableElement = document.getElementById(`message_${message.id}`)
        setTimeout(() => {
            editableElement.focus()
        }, 100);
    }


    //FUNCTION TO HANDLE KEY DOWN IN CONTENT EDITABLE MESSAGE
    const handleKeyDown = (e) => {
        const editableElement = document.getElementById(`message_${message.id}`)
        if (e.key == 'Enter') {
            editMessage(message, editableElement.innerText)
            setIsEditable(false)
        }
    }

    
    return (
        <div key={message.id} className="message-item">
            {message.replayed ?
                <div className='replayed-message flex-v-alings'>
                    <i className="fas fa-reply" ></i>
                    <p>{message.replayed.sender.username}</p>
                    <p>{message.replayed.content}</p>
                </div>
            : null}

            <div className="message-user-img flex-h-alings">
                <UserProfile user={message.sender} />
            </div>
            <div className="message-content">
                <div className='message-info flex-vh-alings'>
                    <p className='message-sender'><strong>{message.sender.username}</strong></p>
                    <p className='message-date'>{message.datetime}</p>
                    {message.edited ?
                        <i className="fas fa-pen message-edited"></i>
                    : null}
                </div>
                {message.content.split('\r').map((str, index) => 
                    <p id={`message_${message.id}`} 
                       key={index} 
                       contentEditable={isEditable}
                       suppressContentEditableWarning={true}
                       onKeyDown={(e) => handleKeyDown(e)} >
                        {str}
                    </p>
                )}
            </div>
            <div className='message-actions flex-vh-alings gap-15'>
                <i onClick={() => setReplayedMessage(message)} className="fas fa-reply clickable" ></i>
                {message.sender.id == localStorage.getItem('userid') ? 
                    <>
                        <i onClick={() => displayEditMessage(true)} className="fas fa-pen clickable"></i>
                        <i onClick={() => deleteMessage(message)} className="fas fa-trash-alt clickable"></i>
                    </>
                : null}
            </div>
        </div>
    )
}

export default Message