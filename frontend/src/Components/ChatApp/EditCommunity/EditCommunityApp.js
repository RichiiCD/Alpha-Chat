import { useState } from "react"
import GeneralAppearance from './GeneralAppearance'
import CommunityMembers from './CommunityMembers/CommunityMembers'
import ChatManagement from './ChatManagement/ChatManagement'
import InvitationManagement from "./InvitationManagement/InvitationManagement"
import DeleteCommunity from './DeleteCommunity'


function EditCommunityApp({getCommunityChats, currentCommunity, getCommunities, setEditCommunity}) {
    
    //COMPONENT STATE FOR CHANGES EDIT OPTION MENU
    const [editOption, setEditOption] = useState("1")


    //FUNCTION FOR CHANGE CONFIG OPTION
    const hanldeEditOptionChanges = (e) => {
        setEditOption(e.target.value)
    }

    return (
        <div className="editconfig-app">
            <div className="leftpanel-editcommunity">
                <div className="menu flex-vh-alings flex-column-direction">
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="1" type="radio" name="community-opt" value="1" defaultChecked={true} />
                    <label className="item" htmlFor="1">General appearance</label>
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="2" type="radio" name="community-opt" value="2" />
                    <label className="item" htmlFor="2">Chat management</label>
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="3" type="radio" name="community-opt" value="3" />
                    <label className="item" htmlFor="3">Community members</label>
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="4" type="radio" name="community-opt" value="4" />
                    <label className="item" htmlFor="4">Invitation management</label>
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="5" type="radio" name="community-opt" value="5" />
                    <label className="item highlight" htmlFor="5">Delete community</label>
                </div>
            </div>
            <div className="rightpanel-editcommunity">
                <div className="rightpanel-container">
                    {editOption === "1" ?
                        <GeneralAppearance currentCommunity={currentCommunity} 
                                           setEditCommunity={setEditCommunity}
                                           getCommunities={getCommunities} />
                    : editOption === "2" ?
                        <ChatManagement currentCommunity={currentCommunity}
                                        getCommunityChats={getCommunityChats} />
                    : editOption === "3" ?
                        <CommunityMembers currentCommunity={currentCommunity}
                                          getCommunities={getCommunities}
                                          setEditCommunity={setEditCommunity} />
                    : editOption === "4" ?
                        <InvitationManagement currentCommunity={currentCommunity} />
                    : 
                        <DeleteCommunity currentCommunity={currentCommunity}
                                         setEditCommunity={setEditCommunity}
                                         getCommunities={getCommunities} />
                    }
                </div>

                <button onClick={() => setEditCommunity(false)} className="closeedit">
                    <i className="fas fa-times clickable"></i>
                </button>
                
            </div>
        </div>
    )
}

export default EditCommunityApp