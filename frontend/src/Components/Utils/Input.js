import { useField } from "formik"

function Input({label, error, ...props}) {
    const [field, meta] = useField(props)

    return (
        <div className="input-container">
            {label ? 
                <div>
                    <label>{label}</label>
                    <br/>
                </div>
            : null}
            <input className={`styled-input ${error ? "error" : ""}`} {...field} {...props}/>
            {props.noValidation != true ? 
                meta.touched && meta.error ? meta.error : null : null}
        </div>
    )
}

export default Input