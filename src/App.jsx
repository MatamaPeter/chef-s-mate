import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import RecipeWorkspace from "./components/Recipe/RecipeWorkspace";
import RecipeResults from "./components/Recipe/RecipeResults";
import Sidebar from "./components/layout/Sidebar";
import DarkModeToggle from "./components/ui/DarkModeToggle";
import FloatingActionButton from "./components/ui/FloatingActionButton";

// Utilities & State Management
import { getRecipeFromGemini } from "./assets/data/ai";

export default function App() {
  // Core Application State
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // User Preferences
  const [cuisine, setCuisine] = useState("Any");
  const [mealType, setMealType] = useState("Any");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Refs for scrolling
  const topRef = useRef(null);
  const recipeSection = useRef(null);
  
  // Initialize dark mode from system preference
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

  // Scroll to recipe when generated
  useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({behavior:"smooth"})
    }
  }, [recipe]);
  
  // Core Functions
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
      
      const recipeMarkdown = await getRecipeFromGemini(ingredients, preferences);
      setRecipe(recipeMarkdown);
      
      // Save recipe to localStorage with timestamp
      const timestamp = Date.now();
      localStorage.setItem(`chefmate-recipe-${timestamp}`, recipeMarkdown);
      
      // Dispatch storage event to update history
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      setError("Error fetching recipe. Please try again.");
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
  
  function handleLoadRecipe(recipeText) {
    setRecipe(recipeText);
    
    // Try to extract ingredients from recipe
    try {
      // Look for ingredients section - common pattern in recipe markdown
      const ingredientsSection = recipeText.match(/#+\s*ingredients\s*[\r\n]+([\s\S]*?)(?=#+|$)/i);
      
      if (ingredientsSection && ingredientsSection[1]) {
        // Extract items that look like ingredients (lines starting with - or *)
        const extractedIngredients = ingredientsSection[1]
          .split('\n')
          .filter(line => /^\s*[-*]\s+/.test(line))
          .map(line => line.replace(/^\s*[-*]\s+/, '').trim())
          .filter(Boolean);
        
        if (extractedIngredients.length > 0) {
          setIngredients(extractedIngredients);
        }
      }
    } catch (e) {
      console.error("Error extracting ingredients:", e);
      // If extraction fails, don't change ingredients
    }
    
    // Scroll to recipe section
    if (recipeSection.current) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleAddIngredient(newIngredient) {
    if (!newIngredient) {
      setError("Ingredient cannot be blank");
      return false;
    }
    if (ingredients.includes(newIngredient)) {
      setError("Duplicate ingredient");
      return false;
    }

    setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    setError("");
    return true;
  }

  function handleRemoveIngredient(ingredientToRemove) {
    setIngredients(prevIngredients => 
      prevIngredients.filter(ingredient => ingredient !== ingredientToRemove)
    );
  }

  // Props collection for components
  const preferenceProps = {
    cuisine,
    setCuisine,
    mealType,
    setMealType,
    dietaryRestrictions,
    setDietaryRestrictions
  };
  
  const ingredientProps = {
    ingredients,
    onAdd: handleAddIngredient,
    onRemove: handleRemoveIngredient,
    onClear: clearAll,
    error
  };
  
  const recipeProps = {
    recipe,
    loading,
    onGetRecipe: getRecipe,
    recipeRef: recipeSection
  };

  return (
    <div 
      ref={topRef}
      className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-amber-50 via-gray-50 to-amber-50'
      }`}
    >
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar - Hidden on Mobile by Default */}
        <div className="hidden lg:block lg:w-80 border-l border-gray-200 dark:border-gray-700">
          <Sidebar 
            darkMode={darkMode}
            onLoadRecipe={handleLoadRecipe}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            {/* Header Section with App Controls */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-full ${
                    darkMode 
                      ? 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80' 
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  } shadow-md backdrop-blur-sm transition-all md:hidden`}
                  aria-label="Open sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Recipe Workspace (Form, Ingredients, Controls) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl ${
                darkMode 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/80 border-gray-200'
              } border backdrop-blur-sm shadow-xl overflow-hidden mb-8`}
            >
              <RecipeWorkspace 
                darkMode={darkMode}
                ingredientProps={ingredientProps}
                preferenceProps={preferenceProps}
                recipeProps={recipeProps}
              />
            </motion.div>

            {/* Recipe Results Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`rounded-3xl ${
                darkMode 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/80 border-gray-200'
              } border backdrop-blur-sm shadow-xl overflow-hidden`}
            >
              <RecipeResults 
                darkMode={darkMode}
                recipe={recipe}
                loading={loading}
                recipeRef={recipeSection}
              />
            </motion.div>
          </div>
        </div>

        {/* Mobile Sidebar (Slide-in) */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-30"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`fixed right-0 top-0 h-full w-80 z-40 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-2xl`}
              >
                <div className="p-4 flex justify-end">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`p-2 rounded-full ${
                      darkMode 
                        ? 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80' 
                        : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                    } backdrop-blur-sm transition-all`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <Sidebar 
                  darkMode={darkMode}
                  onLoadRecipe={(recipe) => {
                    handleLoadRecipe(recipe);
                    setSidebarOpen(false);
                  }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        showScrollTop={showScrollTop}
        scrollToTop={scrollToTop}
        darkMode={darkMode}
      />

      {/* Animated Background Elements */}
      {!darkMode && (
        <>
          <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-amber-100/30 blur-3xl -z-10"></div>
          <div className="fixed bottom-40 right-20 w-40 h-40 rounded-full bg-amber-200/20 blur-3xl -z-10"></div>
        </>
      )}
      {darkMode && (
        <>
          <div className="fixed top-1/4 left-1/4 w-48 h-48 rounded-full bg-amber-900/10 blur-3xl -z-10"></div>
          <div className="fixed bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-gray-700/10 blur-3xl -z-10"></div>
        </>
      )}
    </div>
  );
}