import {useState, useEffect} from 'react'
import axios from 'axios'
import MemberItem from './MemberItem'
import SubmitButton from '../../../Utils/SubmitButton'
import AlertMessage from '../../../Utils/AlertMessage'
import { API_ADDRESS } from '../../../apiConfig'



function CommunityMembers({currentCommunity, getCommunities, setEditCommunity}) {

    //COMPONENT STATE FOR SET ALL THE COMMUNITY MEMBERS
    const [communityMembers, setCommunityMembers] = useState([])

    //COMPONENT STATE FOR STORAGE KICKED MEMBERS
    const [kickedMembers, setKickedMembers] = useState([])

    //COMPONENT STATE FOR DISPLAY ALERT MESSAGE
    const [showAlertMessage, setShowAlertMessage] = useState(false)


    //API FUNCTION TO GET ALL THE COMMUNITY MEMBERS (communityMembers)
    const getCommunityMembers = async () => {
        await axios({method: "GET", 
                url: `${API_ADDRESS}/api/community/members/`,
                params: {code: currentCommunity.code}, 
                headers: { "Content-Type": "application/json" }}).then((res) => setCommunityMembers(res.data.members))
    }


    //FUNCTION TO CALL THE COMMUNITY MEMBERS API WHEN THE COMPONENT IS RENDERED (communityMembers)
    useEffect(() => {
        getCommunityMembers()
    }, [])


    //FUNCTION TO ADD KICKED MEMBER (kickedMembers)
    const addKickedMembers = (member) => {
        setKickedMembers([...kickedMembers, member.id])
        setCommunityMembers(communityMembers.filter(item => item.username !== member.username))
    }


    //API FUNCTION TO KICK THE SELECTED MEMBERS (kickedMembers)
    const handleSubmitMembers = async () => {
        await axios({method: "PUT", 
                     url: `${API_ADDRESS}/api/community/members/`,
                     data: {code: currentCommunity.code, members: kickedMembers},
                     headers: { "Content-Type": "application/json" }})
              .then(() => setTimeout(() => {
                        setEditCommunity(false)
                        getCommunities()
                    }, 200))
    }


    return (
        <div className="communitymembers rightpanel-animation">
            <h2>Community members</h2>
            <p>Manage or kick any user member of the community.</p>
            <div className='settings-list'>
                {communityMembers.map(member => (
                    <MemberItem key={member.id} member={member} addKickedMembers={addKickedMembers} />
                ))}
            </div>
            <SubmitButton label="Save changes" onClick={() => setShowAlertMessage(true)} disabled={kickedMembers.length > 0 ? false : true} />
                    
            {showAlertMessage ? 
                <AlertMessage accept={handleSubmitMembers} cancel={setShowAlertMessage} >
                    <p>Are you sure you want to kick these members?</p>
                </AlertMessage>
            : null}
        </div>
    )
}

export default CommunityMembers