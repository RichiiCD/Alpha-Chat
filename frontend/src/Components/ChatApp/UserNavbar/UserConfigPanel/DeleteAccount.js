import {Formik, Form} from 'formik'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Input from '../../../Utils/Input'
import SubmitButton from '../../../Utils/SubmitButton'
import AlertMessage from '../../../Utils/AlertMessage'
import { API_ADDRESS } from '../../../apiConfig'



function DeleteAccount() {

    //COMPONENT STATE FOR SHOW/HIDDE INPUT ERROR
    const [passwordError, setPasswordError] = useState(false)

    //COMPONENT STATE FOR ENABLE/DISABLE SUBMIT BUTTON
    const [disabledButton, setDisabledButton] = useState(true)

    //COMPONENT STATE FOR SHOW/HIDDE ALERT MESSAGE
    const [displayAlert, setDisplayAlert] = useState(false)

    //COMPONENT STATE FOR STORAGE USER SUBMITED PASSWORD
    const [accountPassword, setAccountPassword] = useState('')


    //FUNCTION CALLED WHEN THE USER SUBMIT THE FORM (passwordError, displayAlert, accountPassword)
    const handleSubmit = (values) => {
        if (values.password) {
            setAccountPassword(values.password)
            setDisplayAlert(true)
            setPasswordError(false)
        } else {
            setPasswordError(true)
        }
    }


    //API FUNCTION TO DELETE THE USER ACCOUNT
    const submitDeleteAccount = async () => {
            await axios({method: "DELETE", 
                    url: `${API_ADDRESS}/api/user/profile/`, 
                    data: {password: accountPassword},
                    headers: { "Content-Type": "application/json"}})
            .then(() => {
                localStorage.setItem('token', '')
                localStorage.setItem('username', '')
                localStorage.setItem('image', '')
                localStorage.setItem('isAuthenticated', 'false')
                window.location.href = '/login'
            })
            .catch(() => {
                setPasswordError(true)
                setDisplayAlert(false)
            })
    }


    return (
        <div className="rightpanel-animation">
            <h2>Delete Account</h2>
            <p>If you proceed your account will be PERMANENTLY deleted, with no option to recover it.</p>
            <Formik initialValues={{password: ''}}
                    onSubmit= {(values) => handleSubmit(values)}>
                <Form>
                    <Input name="password"
                            type="password"
                            placeholder="Account password..."
                            label="Write yout password for proceed"
                            error={passwordError}
                            onInput={() => setDisabledButton(false)}/>
                    <SubmitButton label="Delete account"
                                  type="alert"
                                  disabled={disabledButton} />
                </Form>
            </Formik>

            {displayAlert ? 
                <AlertMessage accept={submitDeleteAccount} cancel={setDisplayAlert}>
                    <p>Are you sure you want to delete your account?</p>
                </AlertMessage>
            : null}
        </div>
    )
}

export default DeleteAccount