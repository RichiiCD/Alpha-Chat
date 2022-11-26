import { useState } from 'react'
import {Formik, Form} from 'formik'
import axios from 'axios'
import Input from '../Utils/Input'
import SubmitButton from '../Utils/SubmitButton'
import '../Login/LoginStyles.css'
import './SignupStyles.css'
import { API_ADDRESS } from '../apiConfig'



function Signup() {

    //COMPONENT STATE FOR STORAGE SIGNUP ERRORS
    const [signupError, setSignupError] = useState('')


    //API FUNCTION FOR CREATE NEW USER ACCOUNT
    const handleSignupSubmit = async (values) => {
        let data = {data: {username: values.username, 
                           password: values.password, 
                           email: values.email,
                           userprofile: {
                               birthdate: values.birthdate
                           }}}
        await axios({method: 'POST', 
                     url: `${API_ADDRESS}/api/user/profile/`, 
                     data: data, 
                     headers: { "Content-Type": "application/json"}})
                .catch((error) => {
                    setSignupError(error.response.data[Object.keys(error.response.data)[0]])
                })
                .then(() => {
                    window.location.href = '/login'
                })
    }
    

    return (
        <div className='signup-app'>
            <div className='entry-container'>
                <div className='entry-img-container'>
                    <img src={process.env.PUBLIC_URL + "/img/logo.svg"} />
                </div>
                <Formik
                    initialValues={{username: '', email: '', birthdate: '', password: ''}}
                    onSubmit= {(values) => handleSignupSubmit(values)}>
                    <Form>
                        <Input name="username"
                                type="text"
                                placeholder="Username"
                                label={null}/>
                        <Input name="email"
                                type="email"
                                placeholder="Email"
                                label={null}/>
                        <Input name="birthdate"
                                type="date"
                                placeholder="Birthdate"
                                label={null}/>
                        <Input name="password"
                                type="password"
                                placeholder="Password"
                                label={null}/>
                        
                        <SubmitButton label="Signup" />
                        <div className={`login-error ${signupError ? "visible" : ""}`}>
                            <p>{signupError ? signupError : null}</p> 
                        </div>
                    </Form>
                </Formik>
                <a className='login-redirect' href='/login/'>Do you already have an account? Login.</a>
            </div>
        </div>
    )
}

export default Signup