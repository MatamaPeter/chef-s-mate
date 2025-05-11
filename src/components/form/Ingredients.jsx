/*eslint-disable react/prop-types*/
import { forwardRef } from 'react';
import { FiStar, FiClock, FiShoppingCart } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import { motion } from 'framer-motion';

const Ingredients = forwardRef((props, ref) => {
    return (
        props.list.length > 0 && (
            <section className="w-full max-w-3xl mx-auto">
                {/* Ingredients Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-3 mb-6"
                >
                    <motion.span 
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        className={`flex items-center justify-center p-2 rounded-xl ${
                            props.darkMode 
                                ? 'bg-gray-700/80 backdrop-blur-sm shadow-lg' 
                                : 'bg-amber-100/80 backdrop-blur-sm shadow'
                        }`}
                    >
                        <FiShoppingCart className={`h-6 w-6 ${
                            props.darkMode ? 'text-amber-400' : 'text-amber-600'
                        }`} />
                    </motion.span>
                    <div className="flex items-center flex-wrap gap-2">
                        <h3 className={`text-2xl font-bold ${
                            props.darkMode ? 'text-gray-100' : 'text-gray-800'
                        }`}>
                            Your Ingredients
                        </h3>
                        <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className={`text-sm px-3 py-1 rounded-full ${
                                props.darkMode 
                                    ? 'bg-gray-700 text-amber-400 border border-gray-600' 
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                            } shadow-inner`}
                        >
                            {props.list.length} {props.list.length === 1 ? 'item' : 'items'}
                        </motion.span>
                    </div>
                </motion.div>
                    
                {/* Ingredients List */}
                <motion.ul 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
                >
                    {props.list}
                </motion.ul>
                
                {/* Minimum Ingredients Notice */}
                {props.list.length > 0 && props.list.length < 3 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`p-4 rounded-xl mb-8 backdrop-blur-sm ${
                            props.darkMode 
                                ? 'bg-gray-700/50 border border-gray-600/30 shadow-lg' 
                                : 'bg-amber-50/70 border border-amber-200/50 shadow'
                        }`}
                    >
                        <div className="flex items-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <FiClock className={`h-5 w-5 mr-3 ${
                                    props.darkMode ? 'text-amber-400' : 'text-amber-500'
                                }`} />
                            </motion.div>
                            <p className={`text-sm ${
                                props.darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Add <strong className="font-semibold">at least 3 ingredients</strong> to unlock delicious recipe recommendations.
                            </p>
                        </div>
                    </motion.div>
                )}
                
                {/* Recipe Generation CTA */}
                {props.list.length >= 3 && (
                    <div 
                        ref={ref}
                        className={`mt-8 pt-6 border-t ${
                            props.darkMode ? 'border-gray-700/50' : 'border-gray-100'
                        }`}
                    >
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                            className={`p-6 rounded-2xl backdrop-blur-sm ${
                                props.darkMode 
                                    ? 'bg-gradient-to-br from-gray-700/70 to-gray-800/70 border border-gray-600/30 shadow-xl' 
                                    : 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200/30 shadow-lg'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <motion.div
                                            whileHover={{ rotate: 15 }}
                                            className={`p-2 rounded-lg mr-3 ${
                                                props.darkMode 
                                                    ? 'bg-gray-600/50 text-amber-400' 
                                                    : 'bg-amber-100 text-amber-600'
                                            }`}
                                        >
                                            <MdRestaurant className="h-6 w-6" />
                                        </motion.div>
                                        <h3 className={`text-2xl font-bold ${
                                            props.darkMode ? 'text-gray-100' : 'text-gray-800'
                                        }`}>
                                            Ready to Cook?
                                        </h3>
                                    </div>
                                    <p className={`text-sm ${
                                        props.darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        Our AI chef will create a personalized recipe using your {props.list.length} ingredients.
                                    </p>
                                </div>
                                <motion.button 
                                    whileHover={{ 
                                        scale: 1.03,
                                        background: props.darkMode
                                            ? 'linear-gradient(to right, #f59e0b, #f97316)'
                                            : 'linear-gradient(to right, #f59e0b, #f97316)',
                                        boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)'
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={props.getRecipe}
                                    className={`px-8 py-4 rounded-xl font-semibold flex items-center justify-center whitespace-nowrap ${
                                        props.darkMode
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                            : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md'
                                    } transition-all`}
                                >
                                    <FiStar className="mr-2 h-5 w-5" />
                                    Generate Recipe
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </section>
        )
    );
});

Ingredients.displayName = 'Ingredients';

export default Ingredients;