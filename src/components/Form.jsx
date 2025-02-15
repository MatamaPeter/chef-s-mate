/* eslint-disable react/prop-types*/
export default function Form(props) {

    
    return (
        <div>          
            <form action={props.submit} className="form">
                <input
                    type="text"
                    className="input-field" 
                    aria-label="Add ingredient"
                    placeholder="e.g. Tomatoes"
                    name='ingredient'
                />
                <button>+ Add ingredient</button>  
            </form>
        </div>
    )
}
