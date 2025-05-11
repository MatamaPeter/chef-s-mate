/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import RecipeHistory from "../Recipe/RecipeHistory"
import CookingTimer from "../ui/CookingTimer";
import Header from './Header.jsx';

const Sidebar = ({ darkMode, onLoadRecipe }) => {
  const [activeTab, setActiveTab] = useState("history");
  
  return (

    <div className={`h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col p-5`}>
      <Header />
      {/* Tabs */}
      <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-3 text-center transition-colors ${
            activeTab === "history"
              ? darkMode 
                ? "border-b-2 border-amber-500 text-amber-400" 
                : "border-b-2 border-amber-500 text-amber-600"
              : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Recipe History
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`flex-1 py-3 text-center transition-colors ${
            activeTab === "tools"
              ? darkMode 
                ? "border-b-2 border-amber-500 text-amber-400" 
                : "border-b-2 border-amber-500 text-amber-600"
              : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cooking Tools
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            <RecipeHistory darkMode={darkMode} onLoadRecipe={onLoadRecipe} />
          </motion.div>
        )}
        
        {activeTab === "tools" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            <div className="space-y-4">
              <CookingTimer darkMode={darkMode} />
              <MeasurementConverter darkMode={darkMode} />
              <TemperatureGuide darkMode={darkMode} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Additional cooking tools components
const MeasurementConverter = ({ darkMode }) => {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cup");
  const [toUnit, setToUnit] = useState("ml");
  const [result, setResult] = useState("");
  
  const conversions = {
    cup: {
      ml: 236.588,
      tsp: 48,
      tbsp: 16,
      oz: 8
    },
    tbsp: {
      ml: 14.787,
      tsp: 3,
      cup: 0.0625,
      oz: 0.5
    },
    tsp: {
      ml: 4.929,
      tbsp: 0.333,
      cup: 0.0208,
      oz: 0.1667
    },
    oz: {
      ml: 29.574,
      tsp: 6,
      tbsp: 2,
      cup: 0.125
    },
    ml: {
      cup: 0.00423,
      tsp: 0.203,
      tbsp: 0.0676,
      oz: 0.0338
    }
  };
  
  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Please enter a valid number");
      return;
    }
    
    if (fromUnit === toUnit) {
      setResult(`${value} ${fromUnit}`);
      return;
    }
    
    const conversionFactor = conversions[fromUnit][toUnit];
    const convertedValue = (value * conversionFactor).toFixed(2);
    setResult(`${value} ${fromUnit} = ${convertedValue} ${toUnit}`);
  };
  
  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Measurement Converter</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Amount"
            className={`w-full px-3 py-2 rounded-md ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-700'
            } border`}
          />
          
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className={`px-3 py-2 rounded-md ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-700'
            } border`}
          >
            <option value="cup">Cup</option>
            <option value="tbsp">Tbsp</option>
            <option value="tsp">Tsp</option>
            <option value="oz">Oz</option>
            <option value="ml">ml</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <span className={`mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>to</span>
        </div>
        
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className={`w-full px-3 py-2 rounded-md ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-700'
          } border`}
        >
          <option value="cup">Cup</option>
          <option value="tbsp">Tbsp</option>
          <option value="tsp">Tsp</option>
          <option value="oz">Oz</option>
          <option value="ml">ml</option>
        </select>
        
        <button
          onClick={handleConvert}
          className="w-full py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Convert
        </button>
        
        {result && (
          <div className={`mt-2 p-2 text-center rounded ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

const TemperatureGuide = ({ darkMode }) => {
  const temperatures = [
    { name: "Low heat", fahrenheit: "250-300°F", celsius: "120-150°C", uses: "Slow cooking, simmering stews" },
    { name: "Medium-low", fahrenheit: "300-350°F", celsius: "150-175°C", uses: "Slow pan-frying, gentle simmering" },
    { name: "Medium", fahrenheit: "350-400°F", celsius: "175-205°C", uses: "Most sautéing, baking cookies" },
    { name: "Medium-high", fahrenheit: "400-450°F", celsius: "205-230°C", uses: "Browning meat, stir-frying" },
    { name: "High", fahrenheit: "450-500°F+", celsius: "230-260°C+", uses: "Searing, quick browning" }
  ];
  
  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Cooking Temperature Guide</h3>
      
      <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
            <tr>
              <th className={`py-2 px-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Heat Level</th>
              <th className={`py-2 px-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Temperature</th>
              <th className={`py-2 px-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden sm:table-cell`}>Best For</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {temperatures.map((temp, index) => (
              <tr key={index} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className={`py-2 px-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{temp.name}</td>
                <td className={`py-2 px-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {temp.fahrenheit}<br />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{temp.celsius}</span>
                </td>
                <td className={`py-2 px-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} hidden sm:table-cell`}>{temp.uses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sidebar;