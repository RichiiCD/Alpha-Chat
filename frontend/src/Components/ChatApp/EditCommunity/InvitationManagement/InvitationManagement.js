import {useEffect, useState} from 'react'
import axios from 'axios'
import InvitationItem from './InvitationItem'
import AlertMessage from '../../../Utils/AlertMessage'
import { API_ADDRESS } from '../../../apiConfig'



function InvitationManagement({currentCommunity}) {

    //COMPONENT STATE FOR STORAGE THE COMMUNITY INVITATIONS
    const [communityInvitations, setCommuntiyInvitations] = useState([])

    //COMPONENT STATE FOR SELECTED INVITATION
    const [selectedInvitation, setSelectedInvitation] = useState('')

    //COMPONENT STATE FOR DISPLAY ALERT MESSAGE
    const [showAlertMessage, setShowAlertMessage] = useState(false)


    //API FUNCTION TO GET ALL THE COMMUNITY INVITATIONS (communityInvitations)
    const getCommunityInvitations = async () => {
        await axios.get(`${API_ADDRESS}/api/community/invitations/`, {params: {code: currentCommunity.code, type: 'community'}})
                .then((res) => setCommuntiyInvitations(res.data))
    }


    //FUNCTION TO CALL THE COMMUNITY INVITATIONS API WHEN THE COMPONENT IS RENDERED (communityInvitations)
    useEffect(() => {
        getCommunityInvitations()
    }, [])


    //FUNCTION TO SHOW ALERT MESSAGE (selectedInvitation, showAlertMessage)
    const displayAlertMessage = (chat) => {
        setShowAlertMessage(true)
        setSelectedInvitation(chat)
    }


    //API FUNCTION TO DELETE THE SELECTED INVITATION
    const handleDeleteInvitation = async () => {
        await axios({method: "DELETE", 
                     url: `${API_ADDRESS}/api/community/invitations/`,
                     data: {code: selectedInvitation},
                     headers: { "Content-Type": "application/json" }})
              .then(() => {
                  setCommuntiyInvitations(communityInvitations.filter(invitation => invitation.code !== selectedInvitation))
                  setShowAlertMessage(false)
                })
    }


    return (
        <div className="invitationmanagement rightpanel-animation">
            <h2>Invitation Management</h2>
            <p>View or remove any invitations for a user to this community.</p>
            <div className='settings-list'>
                {communityInvitations.map(invitation => (
                    <InvitationItem key={invitation.code}
                                    invitation={invitation}
                                    displayAlertMessage={displayAlertMessage} />
                ))}
            </div>
            
            {showAlertMessage ? 
                <AlertMessage accept={handleDeleteInvitation} cancel={setShowAlertMessage} >
                    <p>Are you sure you want to delete this invitation?</p>
                </AlertMessage>
            : null}
        </div>
    )
}

export default InvitationManagement