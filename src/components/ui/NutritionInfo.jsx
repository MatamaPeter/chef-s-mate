/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiActivity } from 'react-icons/fi';
import { CgNotes } from 'react-icons/cg';

// Placeholder function for nutrition analysis 
// (In a real app, this would call a proper nutrition API)
const analyzeNutrition = (ingredients) => {
    // Simple placeholder implementation
    const baseCalories = 300 + Math.floor(Math.random() * 400);
    const baseProtein = 15 + Math.floor(Math.random() * 20);
    const baseCarbs = 30 + Math.floor(Math.random() * 30);
    const baseFat = 10 + Math.floor(Math.random() * 15);
    
    // Factor in the number of ingredients
    const factor = 1 + (ingredients.length * 0.1);
    
    return {
        calories: Math.floor(baseCalories * factor),
        protein: Math.floor(baseProtein * factor),
        carbs: Math.floor(baseCarbs * factor),
        fat: Math.floor(baseFat * factor),
        fiber: Math.floor((baseCarbs * 0.2) * factor),
        sugar: Math.floor((baseCarbs * 0.3) * factor)
    };
};

export default function NutritionInfo({ ingredients, darkMode }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!ingredients || ingredients.length === 0) return null;
    
    const nutrition = analyzeNutrition(ingredients);

    return (
        <div className={`mt-6 rounded-xl overflow-hidden shadow-sm ${
            darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
        }`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full p-4 flex items-center justify-between ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                } transition-colors`}
                aria-expanded={isExpanded}
            >
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                        darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
                    }`}>
                        <FiActivity className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-medium text-lg">Estimated Nutrition Info</h3>
                        <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            Based on your ingredients
                        </p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </motion.div>
            </button>
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0">
                            <div className="flex flex-wrap gap-4 my-2">
                                <div className={`basis-full md:basis-[calc(33.33%-1rem)] p-4 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-amber-50'
                                }`}>
                                    <div className="text-center">
                                        <div className={`text-2xl font-semibold mb-1 ${
                                            darkMode ? 'text-amber-400' : 'text-amber-600'
                                        }`}>
                                            {nutrition.calories}
                                        </div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Calories
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`basis-[calc(50%-0.5rem)] md:basis-[calc(33.33%-1rem)] p-4 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-amber-50'
                                }`}>
                                    <div className="text-center">
                                        <div className={`text-xl font-semibold mb-1 ${
                                            darkMode ? 'text-amber-400' : 'text-amber-600'
                                        }`}>
                                            {nutrition.protein}g
                                        </div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Protein
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`basis-[calc(50%-0.5rem)] md:basis-[calc(33.33%-1rem)] p-4 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-amber-50'
                                }`}>
                                    <div className="text-center">
                                        <div className={`text-xl font-semibold mb-1 ${
                                            darkMode ? 'text-amber-400' : 'text-amber-600'
                                        }`}>
                                            {nutrition.carbs}g
                                        </div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Carbs
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`basis-[calc(33.33%-0.67rem)] p-4 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-amber-50'
                                }`}>
                                    <div className="text-center">
                                        <div className={`text-xl font-semibold mb-1 ${
                                            darkMode ? 'text-amber-400' : 'text-amber-600'
                                        }`}>
                                            {nutrition.fat}g
                                        </div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Fat
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`basis-[calc(33.33%-0.67rem)] p-4 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-amber-50'
                                }`}>
                                    <div className="text-center">
                                        <div className={`text-xl font-semibold mb-1 ${
                                            darkMode ? 'text-amber-400' : 'text-amber-600'
                                        }`}>
                                            {nutrition.fiber}g
                                        </div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Fiber
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`basis-[calc(33.33%-0.67rem)] p-4 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-amber-50'
                                }`}>
                                    <div className="text-center">
                                        <div className={`text-xl font-semibold mb-1 ${
                                            darkMode ? 'text-amber-400' : 'text-amber-600'
                                        }`}>
                                            {nutrition.sugar}g
                                        </div>
                                        <div className={`text-sm ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            Sugar
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`mt-4 p-3 rounded-lg flex items-start ${
                                darkMode ? 'bg-gray-800' : 'bg-amber-50'
                            }`}>
                                <CgNotes className={`mr-2 mt-1 flex-shrink-0 ${
                                    darkMode ? 'text-amber-400' : 'text-amber-600'
                                }`} />
                                <p className={`text-sm ${
                                    darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    This nutrition information is estimated based on your ingredient list. 
                                    Values may vary depending on exact quantities and preparation methods.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}