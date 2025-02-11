import { useState } from "react";
export default function Form() {

    const [ingredients, setIngredients]  = useState([]);

    const ingredientsList = ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>);

    function handleSubmit(formData) {
        const newIngredient = formData.get('ingredient')
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        
    }    
    return (
        <main>
        <form action={handleSubmit} className="form">
            <input
                type="text"
                className="input-field" 
                aria-label="Add ingredient"
                placeholder="e.g. oregano"
                name='ingredient'
            />
            <button>+ Add ingredient</button>  
        </form>
        <ul className="ingredient-list">
            {ingredientsList}
        </ul>
        </main>
    )
}
