import {Formik, Form} from 'formik'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Input from '../../../Utils/Input'
import SubmitButton from '../../../Utils/SubmitButton'
import { API_ADDRESS } from '../../../apiConfig'



function ChangePassword() {

    //COMPONENT STATE FOR SHOW/HIDDE INPUT ERROR
    const [submitPasswordError, setSubmitPasswordError] = useState(false)

    //COMPONENT STATE FOR ENABLE/DISABLE SUBMIT BUTTON
    const [disabledSubmit, setDisabledSubmit] = useState(true)


    //API FUNCTION FOR CHANGE THE ACCOUNT PASSWORD CALLED WHEN THE FORM IS SUBMITED
    const handleSubmit = async (values) => {
        if ((values.password1 === values.password2) && values.password1 && values.password2) {
            await axios({method: "PUT", 
                        url: `${API_ADDRESS}/api/user/changepassword/`, 
                        data: {password: values.password1},
                        headers: { "Content-Type": "application/json"}})
                    .then(() => {
                        setSubmitPasswordError(false)
                        window.location.href = '/'
                    })
        } else {
            setSubmitPasswordError(true)
        }
    }


    //FUNCTION FOR ENABLE/DISABLE THE SUBMIT BUTTON
    const enableButton = () => {
        let password1Element = document.getElementById('password1');
        let password2Element = document.getElementById('password2');
        if (password1Element.value && password2Element.value) {
            setDisabledSubmit(false)
        }
    }


    return (
        <div className="rightpanel-animation">
            <h2>Change Password</h2>
            <p>Change your account password.</p>
            <Formik initialValues={{password1: '', password2: ''}}
                    onSubmit= {(values) => handleSubmit(values)}>
                <Form>
                    <Input id="password1"
                            name="password1"
                            type="password"
                            placeholder="Password here..."
                            label="Write the new password"
                            error={submitPasswordError}
                            onInput={() => enableButton()}/>
                    <Input id="password2"
                            name="password2"
                            type="password"
                            placeholder="Password here..."
                            label="Repeat the password"
                            error={submitPasswordError}
                            onInput={() => enableButton()}/>
                    <SubmitButton label="Change password" disabled={disabledSubmit} />
                </Form>
            </Formik>
        </div>
    )
}

export default ChangePassword