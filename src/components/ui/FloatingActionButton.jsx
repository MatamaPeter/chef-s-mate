import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronUp } from 'react-icons/fi';

const FloatingActionButton = ({ showScrollTop, scrollToTop, darkMode }) => {
  return (
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
    </div>
  );
};

export default FloatingActionButton;