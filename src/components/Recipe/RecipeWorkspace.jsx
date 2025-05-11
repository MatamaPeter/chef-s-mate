/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiSettings, FiX } from 'react-icons/fi';

import Form from '../form/Form'
import NutritionInfo from "../ui/NutritionInfo";
import PreferencesPanel from "../layout/PreferencesPanel";

const RecipeWorkspace = ({ 
  darkMode, 
  ingredientProps, 
  preferenceProps, 
  recipeProps 
}) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const { ingredients, onAdd, onRemove, onClear, error } = ingredientProps;
  
  function handleSubmit(formData) {
    const newIngredient = formData.get('ingredient').trim();
    onAdd(newIngredient);
  }

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
        onClick={() => onRemove(ingredient)}
        className={`${darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} opacity-0 group-hover:opacity-100 transition-all duration-300`}
        aria-label={`Remove ${ingredient}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </button>
    </motion.li>
  ));

  return (
    <div className="space-y-6">
      {/* Ingredient Input Panel */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Add Ingredients
          </h2>
          <button 
            onClick={() => setShowPreferences(!showPreferences)}
            className={`flex items-center py-1 px-3 rounded-full text-sm ${darkMode 
              ? 'bg-gray-700 text-amber-400 hover:bg-gray-600' 
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'} transition-colors`}
          >
            {showPreferences ? (
              <>
                <FiX className="mr-1" />
                Hide Preferences
              </>
            ) : (
              <>
                <FiSettings className="mr-1" />
                Preferences
              </>
            )}
          </button>
        </div>

        <Form darkMode={darkMode} submit={handleSubmit} />
        
        <div className="mt-4 flex justify-between items-center">
          {ingredients.length > 0 && (
            <button 
              onClick={onClear}
              className={`text-sm flex items-center ${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
              aria-label="Clear all ingredients and preferences"
            >
              <FiTrash2 className="mr-1" />
              Clear All
            </button>
          )}
        </div>
        
        {/* Preferences Panel */}
        <AnimatePresence>
          {showPreferences && (
            <PreferencesPanel darkMode={darkMode} preferenceProps={preferenceProps} />
          )}
        </AnimatePresence>
        
        {/* Error Message */}
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

      {/* Ingredients List Panel */}
      <AnimatePresence>
        {ingredients.length > 0 && !recipeProps.loading && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
            ref={recipeProps.recipeRef}
          >
            <div className="mb-4">
              <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3`}>
                Your Ingredients
              </h2>
              
              {ingredients.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {ingredientsList}
                </ul>
              ) : (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No ingredients added yet. Add some ingredients to get started!
                </p>
              )}
              
              {ingredients.length > 0 && (
                <button 
                  onClick={recipeProps.onGetRecipe}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl shadow-sm hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                >
                  Generate Recipe
                </button>
              )}
            </div>
            
            {/* Nutrition Info Panel */}
            {ingredients.length > 0 && (
              <NutritionInfo ingredients={ingredients} darkMode={darkMode} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeWorkspace;