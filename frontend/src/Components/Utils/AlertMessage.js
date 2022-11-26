

function AlertMessage({children, accept, cancel}) {
    return (
        <div className="alert-message">
            <div className="alert-icon flex-vh-alings">
                <i className="fas fa-exclamation-triangle"></i>
            </div>
            {children}
            <div className="alert-buttons-container flex-vh-alings">
                <button onClick={accept} className="alert-button">Accept</button>
                <button onClick={() => cancel(false)} className="submit-button">Cancel</button>
            </div>
        </div>
    )
}

export default AlertMessage