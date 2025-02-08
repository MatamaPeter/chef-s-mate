export default function Form() {
    
    function handleClick() {
        console.log('clicked');
        
    }

    return (
        <div className="form">
            <input type="text" className="input-field" placeholder="e.g. oregano"/>
            <input onClick={handleClick} type="submit" className="submit-btn" value="+ Add ingredient" />
        </div>
    )
}