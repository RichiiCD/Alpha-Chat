import { useField } from "formik"

function FileInput({label, error, ...props}) {
    const [field, meta] = useField(props)

    return (
        <div className="input-container">
            {label ? 
                <div>
                    <label>{label}</label>
                    <br/>
                </div>
            : null}
            <input id="image" className="styled-input-file" type="file" {...field} {...props}/>
            <div className="fake-input-file"></div>
            {props.noValidation != true ? 
                meta.touched && meta.error ? meta.error : null : null}
        </div>
    )
}

export default FileInput