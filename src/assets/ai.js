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

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(userPrompt);
    return (await result.response).text();

  } catch (err) {
    console.warn("⚠️ Gemini 1.5 failed, attempting fallback...", err.message);

    // Optional fallback model
    try {
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-1.0-pro",
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await fallbackModel.generateContent(userPrompt);
      return (await result.response).text();
    } catch (fallbackErr) {
      console.error("❌ Fallback model failed too:", fallbackErr.message);
      return `**Error:** Unable to generate recipe. Please check your internet connection or try different ingredients.`;
    }
  }
}
