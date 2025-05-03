import Header from "./components/Header";
import Form from "./components/Form";
import { useEffect, useRef, useState } from "react";
import Recipe from "./components/Recipe";
import Ingredients from "./components/Ingredients";
import { getRecipeFromMistral } from "./assets/ai";
import { cuisineOptions, mealTypes } from "./assets/options";
import { FiTrash2, FiSettings, FiX, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cuisine, setCuisine] = useState("Any");
  const [mealType, setMealType] = useState("Any");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const recipeSection = useRef(null);
  const topRef = useRef(null);

  // Check for user's preferred color scheme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Add scroll listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ingredientsList = ingredients.map((ingredient) => (
    <motion.li
      key={ingredient}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg shadow-sm flex justify-between items-center group hover:shadow-md transition-all duration-300 transform hover:scale-102`}
    >
      <span className={darkMode ? "text-gray-200" : "text-gray-700"}>{ingredient}</span>
      <button 
        onClick={() => removeIngredient(ingredient)}
        className={`${darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} opacity-0 group-hover:opacity-100 transition-all duration-300`}
        aria-label={`Remove ${ingredient}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </button>
    </motion.li>
  ));

  function removeIngredient(ingredientToRemove) {
    setIngredients(prevIngredients => 
      prevIngredients.filter(ingredient => ingredient !== ingredientToRemove)
    );
  }

  function handleSubmit(formData) {
    const newIngredient = formData.get('ingredient').trim();

    if (!newIngredient) {
      setError("Ingredient cannot be blank");
      return;
    }
    if (ingredients.includes(newIngredient)) {
      setError("Duplicate ingredient");
      return;
    }

    setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    setError("");
  }

  useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({behavior:"smooth"})
    }
  },[recipe])
  
  async function getRecipe() {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient before generating a recipe!");
      return;
    }

    setLoading(true); 
    setError("");

    try {
      // Pass preferences to the API
      const preferences = {
        cuisine: cuisine !== "Any" ? cuisine : null,
        mealType: mealType !== "Any" ? mealType : null,
        dietaryRestrictions: dietaryRestrictions.trim() || null
      };
      
      const recipeMarkdown = await getRecipeFromMistral(ingredients, preferences);
      setRecipe(recipeMarkdown);
      
    
      
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      setRecipe("Error fetching recipe. Please try again.");
    } finally {
      setLoading(false); 
    }
  }
  
  function clearAll() {
    setIngredients([]);
    setRecipe("");
    setCuisine("Any");
    setMealType("Any");
    setDietaryRestrictions("");
    setError("");
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div 
      ref={topRef}
      className={`min-h-screen ${darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800'}`}
    >

      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-md`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
        
        <Header darkMode={darkMode} />
        
        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 z-10 flex flex-col space-y-3">
          <AnimatePresence>
            {showScrollTop && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-white'} text-amber-500 rounded-full shadow-lg hover:text-amber-600 transition-all transform hover:scale-110`}
                aria-label="Scroll to top"
              >
                <FiChevronUp size={24} />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPreferences(!showPreferences)}
            className={`p-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all`}
            aria-label={showPreferences ? "Hide cooking preferences" : "Show cooking preferences"}
          >
            {showPreferences ? <FiX size={24} /> : <FiSettings size={24} />}
          </motion.button>
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <Form darkMode={darkMode} submit={handleSubmit} />
          
          <div className="mt-4 flex justify-between items-center">
            
            
            {ingredients.length > 0 && (
              <button 
                onClick={clearAll}
                className={`text-sm flex items-center ${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                aria-label="Clear all ingredients and preferences"
              >
                <FiTrash2 className="mr-1" />
                Clear All
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {showPreferences && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl border ${darkMode ? 'border-gray-600' : 'border-gray-200'} overflow-hidden`}
              >
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3`}>Recipe Preferences</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cuisine" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Cuisine Type
                    </label>
                    <select
                      id="cuisine"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                    >
                      {cuisineOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="mealType" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Meal Type
                    </label>
                    <select
                      id="mealType"
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                    >
                      {mealTypes.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="restrictions" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Dietary Restrictions
                  </label>
                  <input
                    id="restrictions"
                    type="text"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="e.g. vegetarian, gluten-free, dairy-free"
                    className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 placeholder-gray-400'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-3 ${darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-50 border-red-500 text-red-700'} border-l-4 rounded-lg flex items-center`}
              >
                <FiX className="mr-2" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {ingredients.length > 0 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <Ingredients 
                ref={recipeSection} 
                getRecipe={getRecipe} 
                list={ingredientsList} 
                darkMode={darkMode} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-col items-center justify-center"
            >
              <div className="relative w-20 h-20">
                <div className={`absolute inset-0 rounded-full border-4 ${darkMode ? 'border-t-amber-400 border-r-amber-400' : 'border-t-amber-500 border-r-amber-500'} border-b-transparent border-l-transparent animate-spin`}></div>
                <div className={`absolute inset-3 rounded-full border-4 ${darkMode ? 'border-t-amber-300 border-l-amber-300' : 'border-t-amber-400 border-l-amber-400'} border-r-transparent border-b-transparent animate-spin-reverse`}></div>
                <div className="absolute inset-6 rounded-full border-4 border-t-amber-300 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '0.8s' }}></div>
              </div>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Crafting your culinary masterpiece...</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Finding the perfect ingredients combination</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {recipe && !loading && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <Recipe recipe={recipe} darkMode={darkMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}