

function SubmitButton({label, type, ...props}) {
    return (
        <button className={`${type ? 'alert-button' : 'submit-button'}`} type='submit' {...props}>{label}</button>
    )
}

export default SubmitButton