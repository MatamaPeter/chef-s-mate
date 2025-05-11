/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Form({ submit, darkMode }) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Common ingredients for suggestions
    const commonIngredients = [
        "Chicken", "Rice", "Pasta", "Tomatoes", "Onion", 
        "Garlic", "Avocado", "Cheese", "Eggs", "Potatoes",
        "Beef", "Spinach", "Mushrooms", "Bell Peppers", "Carrots",
        "Broccoli", "Olive Oil", "Butter", "Salmon", "Shrimp"
    ];
    
    useEffect(() => {
        if (inputValue.length > 1) {
            const filtered = commonIngredients.filter(item => 
                item.toLowerCase().includes(inputValue.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [inputValue]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        const formData = new FormData();
        formData.append('ingredient', inputValue);
        submit(formData);
        setInputValue(''); // Clear input after submission
        setShowSuggestions(false);
    };
    
    const handleSuggestionClick = (suggestion) => {
        const formData = new FormData();
        formData.append('ingredient', suggestion);
        submit(formData);
        setInputValue(''); // Clear input after submission
        setShowSuggestions(false);
    };

    return (
        <div>          
            <motion.form 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="relative flex-grow">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiSearch size={18} />
                    </div>
                    <motion.input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false);
                            // Delay hiding suggestions for better UX
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        animate={{
                            boxShadow: isFocused 
                                ? `0 0 0 2px ${darkMode ? '#f59e0b' : '#f59e0b'}, 0 4px 12px rgba(245, 158, 11, 0.2)` 
                                : `0 1px 3px rgba(0,0,0,${darkMode ? '0.3' : '0.1'})`
                        }}
                        className={`w-full pl-10 pr-4 py-3 border ${
                            darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                        } rounded-xl focus:outline-none transition-all`}
                        aria-label="Add ingredient"
                        placeholder="e.g. Avocado, Chicken, Pasta..."
                        name="ingredient"
                        autoComplete="off"
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={() => setInputValue('')}
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                            aria-label="Clear input"
                        >
                            <FiX size={18} />
                        </button>
                    )}
                    
                    {/* Suggestions dropdown */}
                    <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`absolute z-10 left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden ${
                                    darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                                }`}
                            >
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onMouseDown={() => handleSuggestionClick(suggestion)}
                                        className={`px-4 py-2 cursor-pointer ${
                                            darkMode 
                                                ? 'hover:bg-gray-600 text-gray-200' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl hover:from-amber-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                >
                    <FiPlus className="mr-2" />
                    Add Ingredient
                </motion.button>  
            </motion.form>
            
            {/* Quick add popular ingredients */}
            <div className="mt-4">
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quick Add:</p>
                <div className="flex flex-wrap gap-2">
                    {["Chicken", "Pasta", "Rice", "Eggs", "Potatoes"].map((item, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(item)}
                            className={`text-xs px-3 py-1 rounded-full ${
                                darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors`}
                        >
                            {item}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}