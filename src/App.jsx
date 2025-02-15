import Header from "./components/Header";
import './App.css';
import Form from "./components/Form";
import { useState } from "react";
import Recipe from "./components/Recipe";
import Ingredients from "./components/Ingredients";
import { getRecipeFromMistral } from "./assets/ai";

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Track loading state

  const ingredientsList = ingredients.map((ingredient) => (
    <li key={ingredient}>{ingredient}</li>
  ));

  function handleSubmit(formData) {
    const newIngredient = formData.get('ingredient').trim();

    if (!newIngredient) {
      setError("Ingredient Cannot be blank");
      return;
    }
    if (ingredients.includes(newIngredient)) {
      setError("Duplicate Ingredient");
      return;
    }

    setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    setError("");
  }

  async function getRecipe() {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient before generating a recipe!");
      return;
    }

    setLoading(true); 
    setError("");

    try {
      const recipeMarkdown = await getRecipeFromMistral(ingredients);
      setRecipe(recipeMarkdown);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      setRecipe("Error fetching recipe. Please try again.");
    } finally {
      setLoading(false); 
    }
  }

  return (
    <>
      <div className="components">
        <Header />
        <Form submit={handleSubmit} />
        {error && <p className="error"><span>x</span> {error}</p>}

        <Ingredients getRecipe={getRecipe} list={ingredientsList} />

        {}
        {loading ? (
          <div className="loader"></div>
        ) : (
          <Recipe recipe={recipe} />
        )}
      </div>
    </>
  );
}
