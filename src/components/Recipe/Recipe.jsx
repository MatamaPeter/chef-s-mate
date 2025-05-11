/* eslint-disable react/prop-types */
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { FiPrinter, FiCopy, FiShare2, FiBookmark, FiCheck } from 'react-icons/fi';

export default function Recipe({ recipe, darkMode }) {
    const [copied, setCopied] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const recipeRef = useRef(null);

    const copyToClipboard = () => {
        const text = recipeRef.current?.innerText || recipe;
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                alert('Failed to copy recipe.');
                console.error(err);
            });
    };

    const saveToLocal = () => {
        try {
            localStorage.setItem(`chefmate-recipe-${Date.now()}`, recipe);
            setBookmarked(true);
            setTimeout(() => setBookmarked(false), 2000);
        } catch (err) {
            alert('Could not save recipe locally.');
            console.error(err);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Recipe</title>
                    <style>
                        body { font-family: sans-serif; padding: 2rem; }
                        h1, h2, h3 { color: #d97706; }
                        p, li { font-size: 1rem; line-height: 1.5; }
                    </style>
                </head>
                <body>${recipeRef.current.innerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Chef's Mate Recipe",
                    text: recipe,
                    url: window.location.href
                });
            } catch (error) {
                console.error('Sharing failed:', error);
            }
        } else {
            copyToClipboard();
            alert('Sharing not supported. Recipe copied instead.');
        }
    };

    return recipe ? (
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="recipe-container" 
            aria-live="polite"
        >
            {/* Header */}
            <div className="flex items-center space-x-2 mb-6 relative">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </div>
                <div>
                    <h3 className={`text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        Chef&apos;s Creation
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Made with your ingredients
                    </p>
                </div>
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute right-0 bg-gradient-to-r from-green-400 to-green-500 px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg"
                >
                    Ready to cook!
                </motion.div>
            </div>

            {/* Recipe content */}
            <div ref={recipeRef} className={`prose ${darkMode ? 'prose-invert' : 'prose-amber'} max-w-none ${darkMode ? 'text-gray-300' : ''}`}>
                <ReactMarkdown>{recipe}</ReactMarkdown>
            </div>

            {/* Action buttons */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-amber-50'} flex flex-wrap gap-3 justify-end`}
            >
                <button 
                    onClick={handlePrint} 
                    className={`flex items-center px-3 py-2 rounded-lg ${
                        darkMode 
                            ? 'bg-gray-600 text-white hover:bg-gray-500' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors shadow-sm`}
                >
                    <FiPrinter className="mr-2" />
                    Print
                </button>

                <button 
                    onClick={copyToClipboard} 
                    className={`flex items-center px-3 py-2 rounded-lg ${
                        copied 
                            ? 'bg-green-500 text-white' 
                            : darkMode 
                                ? 'bg-gray-600 text-white hover:bg-gray-500' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-all duration-300 shadow-sm`}
                >
                    {copied ? <FiCheck className="mr-2" /> : <FiCopy className="mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>

                <button 
                    onClick={saveToLocal}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                        bookmarked
                            ? 'bg-amber-500 text-white'
                            : darkMode 
                                ? 'bg-gray-600 text-white hover:bg-gray-500' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors shadow-sm`}
                >
                    <FiBookmark className={`mr-2 ${bookmarked ? 'fill-white' : ''}`} />
                    {bookmarked ? 'Saved!' : 'Save'}
                </button>

                <button 
                    onClick={handleShare} 
                    className={`flex items-center px-3 py-2 rounded-lg ${
                        darkMode 
                            ? 'bg-gray-600 text-white hover:bg-gray-500' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors shadow-sm`}
                >
                    <FiShare2 className="mr-2" />
                    Share
                </button>
            </motion.div>
        </motion.section>
    ) : null;
}
