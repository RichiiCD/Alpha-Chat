


function NewActionMessage({children}) {
    return (
        <div>
            <div className="backgroundhide"></div>

            <div className="newaction-message">
                <div className="newaction-icon flex-vh-alings">
                    <i className="fas fa-plus-square"></i>
                </div>
                {children}
            </div>       
        </div>
    )
}


export default NewActionMessage