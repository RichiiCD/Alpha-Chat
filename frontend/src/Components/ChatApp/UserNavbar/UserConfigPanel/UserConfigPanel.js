import {useState} from 'react'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import ProfileConfiguration from './ProfileConfiguration'


function UserConfigPanel({setShowUserConfig}) {

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
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="1" type="radio" name="user-opt" value="1" defaultChecked={true} />
                    <label className="item" htmlFor="1">Profile configuration</label>
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="2" type="radio" name="user-opt" value="2" />
                    <label className="item" htmlFor="2">Change password</label>
                    <input onChange={(e) => hanldeEditOptionChanges(e)} id="3" type="radio" name="user-opt" value="3" />
                    <label className="item highlight" htmlFor="3">Delete account</label>
                </div>
            </div>
            <div className="rightpanel-editcommunity">
                <div className="rightpanel-container">
                    {editOption === "1" ?
                        <ProfileConfiguration  />
                    : editOption === "2" ?
                        <ChangePassword />
                    : editOption === "3" ? 
                        <DeleteAccount />
                    : null}
                </div> 

                <button onClick={() => setShowUserConfig(false)} className="closeedit">
                    <i className="fas fa-times clickable"></i>
                </button>
            </div>
        </div>
    )
}

export default UserConfigPanel