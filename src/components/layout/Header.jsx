/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

export default function Header({ darkMode }) {
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
        >
            <div className="relative mb-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        delay: 0.2, 
                        type: "spring", 
                        stiffness: 300,
                        damping: 10
                    }}
                    className="absolute -right-3 -top-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full transform rotate-12 shadow-lg z-10"
                >
                    AI-Powered
                </motion.div>
                
                <div className="flex items-center justify-center p-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/10 shadow-xl">
                    <motion.div 
                        whileHover={{ 
                            rotate: [0, -10, 10, -10, 0],
                            scale: 1.05
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md -z-10" />
                        <img 
                            src="chef.png" 
                            alt="Chef's Mate Logo" 
                            className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-lg"
                        />
                    </motion.div>
                    
                    <div className="pl-5">
                        <motion.h1 
                            className={`text-4xl sm:text-5xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md`}
                        >
                            Chef&apos;s Mate
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className={`text-sm sm:text-base mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                            Turn your ingredients into delicious meals
                        </motion.p>
                    </div>
                </div>
            </div>
            
            <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ 
                    duration: 0.7, 
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="w-3/4 h-1.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent rounded-full my-2 relative overflow-hidden"
            >
                <motion.div 
                    animate={{
                        x: ["-100%", "100%", "-100%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                />
            </motion.div>
        </motion.div>
    );
}