import Header from "./components/Header"
import './App.css'
import Form from "./components/Form"
import { useState } from "react";
import Recipe from "./components/Recipe"
import Ingredients from "./components/Ingredients";
import { getRecipeFromMistral } from "./assets/ai";


export default function App() {

    const [ingredients, setIngredients]  = useState(["all the main spices", "pasta", "ground beef", "tomato paste"]);

    const ingredientsList = ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>);

    const [recipeShown, setRecipeShown] = useState(false);


    function handleSubmit(formData) {
        const newIngredient = formData.get('ingredient')
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        
    }  

    async function getRecipe() {
      const recipeMarkdown = await getRecipeFromMistral(ingredients)   
      console.log(recipeMarkdown);
      
    }
 
  return (
    <>
      <div className="components">
        <Header />
        <Form submit={handleSubmit} />
        <Ingredients getRecipe={ getRecipe } list={ ingredientsList } />
        <Recipe shown={recipeShown}/>
      </div>
      
    </>

  )
}