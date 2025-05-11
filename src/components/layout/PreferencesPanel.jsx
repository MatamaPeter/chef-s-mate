/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { cuisineOptions, mealTypes } from "../../assets/data/options";

const PreferencesPanel = ({ darkMode, preferenceProps }) => {
  const { 
     
    cuisine, 
    setCuisine, 
    mealType, 
    setMealType, 
    dietaryRestrictions, 
    setDietaryRestrictions 
  } = preferenceProps;

  return (
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
  );
};

export default PreferencesPanel;