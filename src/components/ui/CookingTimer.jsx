/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiPause, FiPlay, FiRotateCcw, FiVolume2, FiVolumeX } from 'react-icons/fi';

const DEFAULT_TIMERS = [
    { id: 1, name: "Quick Timer", minutes: 5, seconds: 0 },
    { id: 2, name: "Pasta", minutes: 10, seconds: 0 },
    { id: 3, name: "Rice", minutes: 15, seconds: 0 }
];

export default function CookingTimer({ darkMode }) {
    const [showTimer, setShowTimer] = useState(false);
    const [timers, setTimers] = useState(DEFAULT_TIMERS);
    const [activeTimer, setActiveTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const timerRef = useRef(null);
    const alarmSound = useRef(null);

    // Initialize the alarm sound
    useEffect(() => {
        // Creating audio element programmatically
        alarmSound.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        alarmSound.current.volume = 0.5;
        
        return () => {
            if (alarmSound.current) {
                alarmSound.current.pause();
                alarmSound.current = null;
            }
        };
    }, []);

    // Timer tick function
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) {
            setIsRunning(false);
            playAlarm();
        }
        
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isRunning, timeLeft]);
    
    // Play alarm sound
    const playAlarm = () => {
        if (soundEnabled && alarmSound.current) {
            alarmSound.current.play();
        }
    };

    // Start timer with specific duration
    const startTimer = (minutes, seconds, name) => {
        // If there's already a running timer, clear it
        if (timerRef.current) clearTimeout(timerRef.current);
        
        const totalSeconds = minutes * 60 + seconds;
        setTimeLeft(totalSeconds);
        setActiveTimer(name);
        setIsRunning(true);
    };
    
    // Pause/resume timer
    const toggleTimer = () => {
        setIsRunning(prev => !prev);
    };
    
    // Reset timer
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setActiveTimer(null);
        if (alarmSound.current) {
            alarmSound.current.pause();
            alarmSound.current.currentTime = 0;
        }
    };
    
    // Format time for display
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Create a custom timer
    const handleCreateTimer = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.elements.name.value.trim() || "Custom Timer";
        const minutes = parseInt(form.elements.minutes.value) || 0;
        const seconds = parseInt(form.elements.seconds.value) || 0;
        
        if (minutes === 0 && seconds === 0) return;
        
        const newTimer = {
            id: Date.now(),
            name,
            minutes,
            seconds
        };
        
        setTimers(prev => [...prev, newTimer]);
        form.reset();
    };

    return (
        <div className="w-full">
            <button
                onClick={() => setShowTimer(!showTimer)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                    darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                } transition-colors`}
                aria-expanded={showTimer}
            >
                <FiClock className="mr-2" />
                Cooking Timer
                {activeTimer && isRunning && (
                    <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                        darkMode ? 'bg-amber-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                        {formatTime(timeLeft)}
                    </span>
                )}
            </button>
            
            <AnimatePresence>
                {showTimer && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`mt-4 p-4 rounded-xl ${
                            darkMode ? 'bg-gray-700' : 'bg-white'
                        } shadow-md overflow-hidden`}
                    >
                        {/* Current Timer Display */}
                        <div className={`flex justify-between items-center p-4 rounded-lg mb-4 ${
                            darkMode ? 'bg-gray-800' : 'bg-amber-50'
                        }`}>
                            <div>
                                <h3 className={`text-lg font-medium ${
                                    darkMode ? 'text-gray-200' : 'text-gray-800'
                                }`}>
                                    {activeTimer || "No Active Timer"}
                                </h3>
                                <div className={`text-3xl font-bold ${
                                    darkMode 
                                        ? timeLeft === 0 ? 'text-amber-400' : 'text-gray-200'
                                        : timeLeft === 0 ? 'text-amber-600' : 'text-gray-800'
                                }`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {/* Sound toggle button */}
                                <button
                                    onClick={() => setSoundEnabled(prev => !prev)}
                                    className={`p-3 rounded-full ${
                                        darkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600' 
                                            : 'bg-white hover:bg-gray-100'
                                    } text-amber-500`}
                                    aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
                                >
                                    {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
                                </button>
                                
                                {/* Reset button */}
                                <button
                                    onClick={resetTimer}
                                    disabled={!activeTimer}
                                    className={`p-3 rounded-full ${
                                        darkMode 
                                            ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:text-gray-500' 
                                            : 'bg-white hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-300'
                                    } text-amber-500 disabled:cursor-not-allowed transition-colors`}
                                    aria-label="Reset timer"
                                >
                                    <FiRotateCcw />
                                </button>
                                
                                {/* Play/Pause button */}
                                <button
                                    onClick={toggleTimer}
                                    disabled={!activeTimer || timeLeft === 0}
                                    className={`p-3 rounded-full ${
                                        isRunning
                                            ? darkMode 
                                                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                                            : darkMode 
                                                ? 'bg-gray-700 hover:bg-gray-600 text-amber-500 disabled:text-gray-500' 
                                                : 'bg-white hover:bg-gray-100 text-amber-500 disabled:text-gray-300'
                                    } disabled:cursor-not-allowed transition-colors`}
                                    aria-label={isRunning ? "Pause timer" : "Start timer"}
                                >
                                    {isRunning ? <FiPause /> : <FiPlay />}
                                </button>
                            </div>
                        </div>
                        
                        {/* Preset Timers */}
                        <div className="mb-4">
                            <h4 className={`text-sm font-medium mb-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Preset Timers
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {timers.map(timer => (
                                    <button
                                        key={timer.id}
                                        onClick={() => startTimer(timer.minutes, timer.seconds, timer.name)}
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            darkMode 
                                                ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                        } transition-colors`}
                                    >
                                        {timer.name} ({timer.minutes}:{timer.seconds.toString().padStart(2, '0')})
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Create Custom Timer */}
                        <div>
                            <h4 className={`text-sm font-medium mb-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Create Custom Timer
                            </h4>
                            <form onSubmit={handleCreateTimer} className="flex flex-wrap gap-2">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Timer Name"
                                    className={`px-3 py-1 text-sm rounded-lg ${
                                        darkMode 
                                            ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500' 
                                            : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                                    } border`}
                                />
                                <input
                                    type="number"
                                    name="minutes"
                                    min="0"
                                    max="120"
                                    placeholder="Min"
                                    className={`w-16 px-3 py-1 text-sm rounded-lg ${
                                        darkMode 
                                            ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500' 
                                            : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                                    } border`}
                                    required
                                />
                                <input
                                    type="number"
                                    name="seconds"
                                    min="0"
                                    max="59"
                                    placeholder="Sec"
                                    className={`w-16 px-3 py-1 text-sm rounded-lg ${
                                        darkMode 
                                            ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500' 
                                            : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                                    } border`}
                                />
                                <button
                                    type="submit"
                                    className={`px-3 py-1 text-sm rounded-lg ${
                                        darkMode 
                                            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    } transition-colors`}
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}