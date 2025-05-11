import { motion, AnimatePresence } from "framer-motion";
import Recipe from "./Recipe";

const RecipeResults = ({ darkMode, recipe, loading, recipeRef }) => {
  return (
    <>
      {/* Loading Spinner */}
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

      {/* Recipe Display */}
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
    </>
  );
};

export default RecipeResults;