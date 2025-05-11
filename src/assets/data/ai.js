import { GoogleGenerativeAI } from "@google/generative-ai";

// Prompt for Gemini system role
const SYSTEM_PROMPT = `
You are a helpful recipe assistant. A user will give you a list of available ingredients, and you will suggest a recipe they can make using some or most of them. You may include a few reasonable additional ingredients as needed.

**Instructions:**
- Format your output in **Markdown**.
- Include a bolded recipe title, a list of ingredients, and clear preparation steps.
- Emphasize the **main dish** name by making it bold and using a heading.
- If user provides preferences (e.g., cuisine, meal type, or dietary restrictions), incorporate them intelligently.
- Keep your tone friendly and enthusiastic, like you're excited to help cook!
`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("❌ Missing Gemini API Key! Please set VITE_GEMINI_API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Get a recipe suggestion based on ingredients and optional preferences.
 * @param {string[]} ingredientsArr - List of available ingredients.
 * @param {{ cuisine?: string, mealType?: string, dietaryRestrictions?: string }} preferences
 * @returns {Promise<string>} - A recipe formatted in Markdown.
 */
export async function getRecipeFromGemini(ingredientsArr = [], preferences = {}) {
  if (!Array.isArray(ingredientsArr) || ingredientsArr.length === 0) {
    throw new Error("Please provide a list of ingredients.");
  }

  const ingredients = ingredientsArr.map(i => i.trim()).filter(Boolean).join(", ");

  let userPrompt = `I have the following ingredients: ${ingredients}.\n`;

  if (preferences.cuisine) {
    userPrompt += `My preferred cuisine is ${preferences.cuisine}.\n`;
  }

  if (preferences.mealType) {
    userPrompt += `I'm looking for a ${preferences.mealType.toLowerCase()} recipe.\n`;
  }

  if (preferences.dietaryRestrictions) {
    userPrompt += `Please consider these dietary restrictions: ${preferences.dietaryRestrictions}.\n`;
  }

  userPrompt += `What recipe can I make? Format the answer in markdown with a bold title, ingredients list, and numbered steps.`;

  // Implementation with retry logic and proper model names
  const models = [
    "gemini-1.5-flash", // Start with a model with higher quota limits
    "gemini-pro",       // Correct name for fallback model
  ];
  
  let lastError = null;
  
  for (const modelName of models) {
    try {
      console.log(`Attempting to use ${modelName}...`);
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });

      // Add exponential backoff retry logic
      const maxRetries = 3;
      let retryCount = 0;
      let retryDelay = 1000; // Start with 1 second
      
      while (retryCount < maxRetries) {
        try {
          const result = await model.generateContent(userPrompt);
          return (await result.response).text();
        } catch (retryErr) {
          if (retryErr.message.includes("429") && retryCount < maxRetries - 1) {
            // Rate limit error, retry with backoff
            console.log(`Rate limit hit, retrying in ${retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay *= 2; // Exponential backoff
            retryCount++;
          } else {
            // Different error or max retries reached, throw to outer catch
            throw retryErr;
          }
        }
      }
    } catch (err) {
      console.warn(`⚠️ ${modelName} failed: ${err.message}`);
      lastError = err;
      // Continue to next model in the array
    }
  }

  // If we get here, all models have failed
  console.error("❌ All models failed:", lastError?.message);
  return `**Error:** Unable to generate recipe. The API rate limit has been reached. Please try again in a few minutes or check your Gemini API key configuration.`;
}