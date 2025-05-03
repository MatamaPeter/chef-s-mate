import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe
they could make with some or all of those ingredients. You don't need to use every ingredient
they mention in your recipe. The recipe can include additional ingredients they didn't mention,
but try not to include too many extra ingredients. Make the main dish bold. Format your response in markdown to make it
easier to render to a web page.

If the user specifies cuisine preferences, meal type, or dietary restrictions, make sure to incorporate those into your recipe recommendation.
`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("Missing Gemini API Key! Please set VITE_GEMINI_API_KEY.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getRecipeFromGemini(ingredientsArr, preferences = {}) {
  const ingredientsString = ingredientsArr.join(", ");

  let userPrompt = `I have these ingredients: ${ingredientsString}.`;

  if (preferences.cuisine) {
    userPrompt += ` I prefer ${preferences.cuisine} cuisine.`;
  }

  if (preferences.mealType) {
    userPrompt += ` I want a ${preferences.mealType.toLowerCase()} recipe.`;
  }

  if (preferences.dietaryRestrictions) {
    userPrompt += ` Dietary restrictions: ${preferences.dietaryRestrictions}.`;
  }

  userPrompt += " Suggest a recipe I could make with these.";

  try {
    // Use the correct model name (current as of June 2024)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      systemInstruction: SYSTEM_PROMPT
    });
    
    // Simple prompt format that works with current SDK
    const result = await model.generateContent(userPrompt);
    
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API Error:", err);
    
    // Fallback to alternative model if primary fails
    try {
      const fallbackModel = genAI.getGenerativeModel({ 
        model: "gemini-1.0-pro",
        systemInstruction: SYSTEM_PROMPT
      });
      const result = await fallbackModel.generateContent(userPrompt);
      return (await result.response).text();
    } catch (fallbackErr) {
      return `Error: ${fallbackErr.message || "Unable to generate recipe. Please try different ingredients."}`;
    }
  }
}