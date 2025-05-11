/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiChevronRight, FiTrash2 } from 'react-icons/fi';

export default function RecipeHistory({ darkMode, onLoadRecipe }) {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // Load saved recipes from localStorage on component mount
    useEffect(() => {
        const loadSavedRecipes = () => {
            const recipes = [];
            // Get all keys from localStorage
            const keys = Object.keys(localStorage);
            
            // Filter keys that start with "chefmate-recipe-"
            const recipeKeys = keys.filter(key => key.startsWith('chefmate-recipe-'));
            
            // Sort by timestamp (newest first)
            recipeKeys.sort((a, b) => {
                const timeA = parseInt(a.split('-').pop());
                const timeB = parseInt(b.split('-').pop());
                return timeB - timeA;
            });
            
            // Get recipes from localStorage (limit to 5 most recent)
            recipeKeys.slice(0, 5).forEach(key => {
                const recipeText = localStorage.getItem(key);
                
                // Extract title from markdown (assuming first line is # Title)
                let title = recipeText.split('\n')[0].replace(/^#\s+/, '');
                if (!title || title === recipeText) {
                    title = "Untitled Recipe";
                }
                
                recipes.push({
                    id: key,
                    title: title,
                    text: recipeText,
                    timestamp: parseInt(key.split('-').pop())
                });
            });
            
            setSavedRecipes(recipes);
        };
        
        loadSavedRecipes();
        
        // Set up event listener for storage changes
        window.addEventListener('storage', loadSavedRecipes);
        
        return () => {
            window.removeEventListener('storage', loadSavedRecipes);
        };
    }, []);

    // Function to format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };
    
    // Function to delete a recipe
    const deleteRecipe = (e, id) => {
        e.stopPropagation();
        localStorage.removeItem(id);
        setSavedRecipes(prev => prev.filter(recipe => recipe.id !== id));
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center text-sm font-medium ${
                        darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'
                    } transition-colors focus:outline-none`}
                    aria-expanded={showHistory}
                >
                    <FiClock className="mr-2" />
                    {savedRecipes.length > 0 
                        ? `Recently Generated Recipes (${savedRecipes.length})` 
                        : "No Recent Recipes"}
                    <motion.div
                        animate={{ rotate: showHistory ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FiChevronRight className="ml-1" />
                    </motion.div>
                </button>
            </div>
            
            <AnimatePresence>
                {showHistory && savedRecipes.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                    >
                        <ul className={`space-y-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {savedRecipes.map((recipe) => (
                                <motion.li
                                    key={recipe.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    whileHover={{ scale: 1.01 }}
                                    className={`px-4 py-3 ${
                                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-50 hover:bg-amber-100'
                                    } rounded-lg cursor-pointer flex justify-between items-center group`}
                                    onClick={() => onLoadRecipe(recipe.text)}
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{recipe.title}</div>
                                        <div className={`text-xs ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {formatTime(recipe.timestamp)}
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={(e) => deleteRecipe(e, recipe.id)}
                                        className={`${
                                            darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                                        } opacity-0 group-hover:opacity-100 transition-all duration-300`}
                                        aria-label={`Delete ${recipe.title}`}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}