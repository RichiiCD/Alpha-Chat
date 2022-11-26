import {Formik, Form} from 'formik'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Input from '../../../Utils/Input'
import FileInput from '../../../Utils/FileInput'
import SubmitButton from '../../../Utils/SubmitButton'
import { API_ADDRESS } from '../../../apiConfig'



function ProfileConfiguration() {

    //COMPONENT STATE FOR SAVE DEFAULT USER CONFIG
    const [defaultValues, setDefaultValues] = useState({
        id: null,
        username: "",
        email: "",
        userprofile: {
            id: null,
            code: "",
            description: "",
            birthdate: "",
            image: ""
        }
    })

    //COMPONENT STATE FOR SET IF API IS FETCHED
    const [fetchedAPI, setFetchedAPI] = useState(false)

    //COMPONENT STATE FOR USERNAME INPUT ERROR
    const [submitUserError, setSubmitUserError] = useState('')


    //API FUNCTION TO GET CURRENT USER VALUES
    const getUserProfile = async () => {
        await axios({method: "GET", 
                    url: `${API_ADDRESS}/api/user/profile/`, 
                    headers: { "Content-Type": "application/json" },
                    params: {username: localStorage.getItem('username')}})
              .then((res) => {
                    setDefaultValues(res.data[0])
                    setFetchedAPI(true)
              })
    }


    //FUNCTION TO CALL THE USER PROFILE API WHEN THE COMPONENT IS RENDERED (communities)
    useEffect(() => {
        getUserProfile()
    }, [])


    //FUNCTION TO SUBMIT USER INFO TO API 
    const handleSubmit = async (values) => {
        let data = {username: values.username,
                            email: values.email,
                            userprofile: {
                                description: values.description,
                                birthdate: values.birthdate
                           }}
        const formData = new FormData();
        formData.append('data', JSON.stringify(data))
        if (values.image) {
            const imagefile = document.querySelector('#image');
            formData.append("image", imagefile.files[0]);
        } 
        await axios({method: "PUT", 
                    url: `${API_ADDRESS}/api/user/profile/`, 
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data"}})
                .catch((error) => {
                    if (error.response.data) {
                        setSubmitUserError(error.response.data)
                    }
                })
                .then((res) => {
                    console.log(res)
                    localStorage.setItem('username', values.username)
                    localStorage.setItem('image', res.data.userprofile.image)
                    window.location.href = '/'
                })
    }


    return (
        <div className='rightpanel-animation'>
            <h2>Profile configuration</h2>
            <p>Customize your profile to distinguish you from other users.</p>
            {fetchedAPI ?
                <Formik initialValues={{username: defaultValues.username, 
                                        email: defaultValues.email, 
                                        description: defaultValues.userprofile.description, 
                                        birthdate: defaultValues.userprofile.birthdate,
                                        image: ''}}
                        onSubmit= {(values) => handleSubmit(values)}>
                    <Form>
                        <div className='row'>
                            <div className='column-2'>
                                <Input name="username"
                                        type="text"
                                        placeholder="Username"
                                        label="Username"
                                        error={submitUserError}/>
                                <Input name="email"
                                        type="email"
                                        placeholder="Email"
                                        label="Email"/>
                                <Input name="description"
                                        type="text"
                                        placeholder="Description"
                                        maxLength="100"
                                        label="Description"/>
                                <Input name="birthdate"
                                        type="date"
                                        placeholder={null}
                                        label="Birthdate"/>
                            </div>
                            <div className='column-2'>
                                <FileInput name="image"
                                            label="Profile image"/>
                            </div>
                        </div>
                        <SubmitButton label="Save configuration" />
                    </Form>
                </Formik>
            : null}
        </div>
    )
}

export default ProfileConfiguration