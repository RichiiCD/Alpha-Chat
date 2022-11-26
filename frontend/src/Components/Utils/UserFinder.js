import {useState} from 'react'
import axios from 'axios'
import SubmitButton from './SubmitButton'
import { API_ADDRESS } from '../apiConfig'



function UserFinder({userFunction, cancelFindUser}) {

    //COMPONENT STATE FOR STORAGE FINDED USERS
    const [usersFound, setUserFound] = useState([])

    //COMPONENT STATE IF NO USERS ARE FOUND
    const [notFound, setNotFound] = useState(false)

    //COMPONENT STATE IF INPUT IS EMPTY
    const [isEmpty, setIsEmpty] = useState(true)


    //API FUNCTION TO FIND USER WHEN INPUT CHANGES (usersFound, notFound, isEmpty)
    const findUser = async (username) => {
        if (username) {
            setIsEmpty(false)
            await axios.get(`${API_ADDRESS}/api/user/profile/`, {params: {username: username}})
                  .then((res) => {
                    setUserFound(res.data)
                    setNotFound(false)
                  })
                  .catch((error) => {
                    if (error.response.status === 404) {
                      setNotFound(true)
                    }
                   })
        } else {
            setIsEmpty(true)
        }
    }

    return (
        <div className='finduser-container flex-vh-alings flex-column-direction'>
            <input id='userfinderinput'
                   className='styled-input'
                   placeholder='Write the username...'
                   onChange={(e) => findUser(e.currentTarget.value)} />

            <SubmitButton label="Cancel"
                          type="alert"
                          onClick={() => cancelFindUser(false)} />
            
            {!isEmpty ? 
                <div className='usersfound-list'>
                    {notFound ? 
                        <p>User not found :(</p>
                    :
                        usersFound.map(user => (
                            <div onClick={() => userFunction(user)} key={user.userprofile.code} className='settings-item flex-v-alings'>
                                <div className="userprofile-img" style={{'backgroundImage': `url(${API_ADDRESS + user.userprofile.image})`}} ></div>
                                <div className='user'>
                                    <p className='title'>{user.username}</p>
                                    <p className='subtitle'>#{user.userprofile.code}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            : null}
        </div>
    )
}

export default UserFinder