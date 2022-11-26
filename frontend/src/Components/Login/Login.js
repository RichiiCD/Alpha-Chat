import {Formik, Form} from 'formik'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import Input from '../Utils/Input'
import SubmitButton from '../Utils/SubmitButton'
import '../Utils/UtilsStyles.css'
import './LoginStyles.css'
import { API_ADDRESS } from '../apiConfig'



function Login() {

    //COMPONENT NAVIGATE FOR CHANGE CURRENT PAGE URL
    const navigate = useNavigate()

    //COMPONENT STATE FOR STORAGE USER OR PASSWORD ERROR
    const [submitError, setSubmitError] = useState({username: false, password: false})

    //COMPONENT STATE FOR SET IF THE LOGIN FALIED
    const [loginFailed, setLoginFailed] = useState(false)


    //API FUNCTION FOR USER LOGIN
    const handleLogin = async (values) => {
        if (values.username && values.password) {
            setSubmitError({username: false, password: false})
            let data = {username: values.username, password: values.password}
            let response = await axios({method: "post", 
                                         url: `${API_ADDRESS}/api/login/`, 
                                         data: data,
                                         headers: { "Content-Type": "application/json"}}).catch((error) => setLoginFailed(true))
            
            if (response.status === 200 || response.status === 201) {
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('userid', response.data.user.id)
                localStorage.setItem('username', response.data.user.username)
                localStorage.setItem('image', response.data.user.userprofile.image)
                localStorage.setItem('userobj', JSON.stringify(response.data.user))
                localStorage.setItem('isAuthenticated', 'true')
                navigate('/')
            } 
        } else {
            console.log(values)
            if (!values.username) {
                if (!values.password) {
                    setSubmitError({username: true, password: true})
                } else {
                    setSubmitError({username: true, password: false})
                }
            } else if (!values.password) {
                setSubmitError({username: false, password: true})
            }

        }

    }
    
    
    return (
        <div className='login-app'>
            <div className='entry-container'>
                <div className='entry-img-container'>
                    <img src={process.env.PUBLIC_URL + "/img/logo.svg"} />
                </div>
                <Formik
                    initialValues={{username: '', password: ''}}
                    onSubmit= {(values) => handleLogin(values)}>
                    <Form>
                        <Input name="username"
                                type="text"
                                placeholder="Username"
                                label={null}
                                error={submitError.username} />
                        <Input name="password"
                                type="password"
                                placeholder="Password"
                                label={null}
                                error={submitError.password} />
                        
                        <SubmitButton label="Login" />
                        <div className={`login-error ${loginFailed ? "visible" : ""}`}>
                            <p>Username or password incorrect</p> 
                        </div>
                    </Form>
                </Formik>
                <a className='registration-redirect' href='/signup/'>You don't have account? Register now.</a>
            </div>
        </div>
    )
}

export default Login