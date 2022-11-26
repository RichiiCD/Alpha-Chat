import Message from "../../Utils/Message";
import Spinner from "../../Utils/Spinner";



function CurrentFriendsChat({chat, currentChatMessages, handleKeyPressDown, handleKeyPressUp, sendMessage, isLoading}) {

    //FUNCTION TO SHOW THE COMMUNITY CHAT LIST DOM OBJECT
    const showCommunityChats = () => {
        document.getElementsByClassName('friends-chats')[0].style.width = "280px";
        document.getElementsByClassName('current-chat-container')[0].style.width = 'calc(100% - 280px)';
        document.querySelector('.open-menu-container').style.display = "none";
        document.querySelector('#desplegable').style.display = "block";
    }


    //FUNCTION TO DELETE MESSAGE
    const deleteMessage = (message) => {
        sendMessage(JSON.stringify({
            'type': 'deletemesssage',
            'id': message.id,
            'group': message.chat.code
        }));
    }


    return (
        <div className="current-chat-container">
                <div className="current-chat-bar">
                    <div className="open-menu-container flex-vh-alings">
                        <button onClick={showCommunityChats} className="btn-displaymenu">
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div className="current-chat-info flex-v-alings">
                        <p>{chat.friends[0].username == localStorage.getItem('username') ? chat.friends[1].username : chat.friends[0].username}</p>
                    </div>
                </div>

                {false ? 

                    <Spinner />

                : 
                
                    <div className="messages-container">
                        <div id="messages-list" className="messages-list">
                            {currentChatMessages.map(message => (
                                <Message key={message.id} 
                                        message={message}
                                        deleteMessage={deleteMessage} />
                            ))}
                        </div>
                        <div className="new-message-container flex-vh-alings">
                            <div className="write-message-container flex-vh-alings">
                                <i className="fas fa-plus-circle"></i>
                                <div styles={{"white-space": "pre-wrap"}} placeholder="Write some message..." id="btn-message" className="input" aria-multiline="true" contentEditable="true" onKeyDown={handleKeyPressDown} onKeyUp={handleKeyPressUp}></div>
                            </div>
                        </div>
                    </div>
                
                }
                
        </div>
    )
}

export default CurrentFriendsChat