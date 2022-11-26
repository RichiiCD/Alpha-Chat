import {Formik, Form} from 'formik'
import axios from 'axios'
import Input from '../../Utils/Input'
import FileInput from '../../Utils/FileInput'
import SubmitButton from '../../Utils/SubmitButton'
import { API_ADDRESS } from '../../apiConfig'



function GeneralAppearance({currentCommunity, setEditCommunity, getCommunities}) {

    const handleSumbit = async (values) => {
        const formData = new FormData();
        formData.append('code', currentCommunity.code)
        if (values.name) {
            formData.append('name', values.name)
        } else {
            formData.append('name', currentCommunity.name)
        }
        if (values.image) {
            const imagefile = document.querySelector('#image');
            formData.append("image", imagefile.files[0]);
        } 
        await axios({method: "put", 
                    url: `${API_ADDRESS}/api/community/`, 
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data"}})
            .catch((error) => console.log(error))
            .then(() => setTimeout(() => {
                                            setEditCommunity(false)
                                            getCommunities()
                                        }, 200))
    }

    return (
        <div className="generalappearance rightpanel-animation">
            <h2>General appearance</h2>
            <p>Customize your community to your liking and that of your members.</p>
            <p>Community code: {currentCommunity.code}</p>
            <Formik initialValues={{name: '', image: ''}}
                    onSubmit= {(values) => handleSumbit(values)}>
                <Form>
                    <Input name="name"
                            type="text"
                            placeholder="Name"
                            label="Community name"/>  
                    <div className='generalappearance-image'>
                        <FileInput name="image"
                                    label="Community image"/>
                        <p>Change the icon of your community to your liking to give it much more personality and appearance.</p>
                    </div>
                    <SubmitButton label="Save changes" />
                </Form>
            </Formik>
        </div>
    )
}

export default GeneralAppearance