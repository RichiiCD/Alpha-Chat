import { useState } from 'react'
import {Formik, Form} from 'formik'
import axios from 'axios'
import Input from '../../Utils/Input'
import SubmitButton from '../../Utils/SubmitButton'
import AlertMessage from '../../Utils/AlertMessage'
import { API_ADDRESS } from '../../apiConfig'



function DeleteCommunity({currentCommunity, setEditCommunity, getCommunities}) {

    //COMPONENT STATE TO SHOW/HIDDE ALERT MESSAGE
    const [showAlertMessage, setShowAlertMessage] = useState(false)


    //FUNCTION TO CHECK IF THE NAME IS CORRECT (showAlertMessage)
    const displayAlertMessage = (values) => {
        if (values.name === currentCommunity.name) {
            setShowAlertMessage(true)
        }
    }


    //API FUNCTION TO DELETE THE CURRENT CUMMNITY
    const handleSubmit = async () => {
        await axios({method: "DELETE", 
                url: `${API_ADDRESS}/api/community/`, 
                data: {code: currentCommunity.code},
                headers: { "Content-Type": "application/json"}})
        .catch((error) => console.log(error))
        .then(() => setTimeout(() => {
                        setEditCommunity(false)
                        getCommunities()
                    }, 200))
    }


    return (
        <div className="deletecommunity rightpanel-animation">
            <h2>Delete community</h2>
            <p>Warning, the community will be deleted PERMANENTLY, once deleted it cannot be recovered. Think it over before proceeding.</p>
            
            <Formik initialValues={{name: ''}}
                    onSubmit= {(values) => displayAlertMessage(values)} >
                <Form>
                    <Input name="name"
                            type="text"
                            placeholder="Name"
                            label="Type the community name for delete it" />  
                    <SubmitButton label="Delete community permanently"
                                  type="alert"/>
                </Form>
            </Formik>

            {showAlertMessage ? 
                <AlertMessage accept={handleSubmit} cancel={setShowAlertMessage}>
                    <p>Are you sure you want to delete the community?</p>
                </AlertMessage>
            : null}
        </div>
    )
}

export default DeleteCommunity