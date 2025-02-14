import { useState } from "react";
export default function Form() {

    const [ingredients, setIngredients]  = useState([]);

    const ingredientsList = ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>);

    function handleSubmit(formData) {
        const newIngredient = formData.get('ingredient')
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        
    }    
    return (
        <div>
            
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
            
            {
                ingredientsList.length > 0 &&
                <section>
                    <h3>Ingredients on hand:</h3>
                    
                    <ul className="ingredient-list">
                        {ingredientsList}
                    </ul>
                    {
                        ingredientsList.length > 3 &&
                        < div className="get-recipe-container">
                            <div className="recipe-inst">
                                <h3>Ready for a recipe?</h3>
                                <p>Generate a recipe from your list of ingredients.</p>
                            </div>
                            <button>Get a recipe</button>
                        </div>
                    }
                </section>
            }
        </div>
    )
}
