import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe
they could make with some or all of those ingredients. You don't need to use every ingredient
they mention in your recipe. The recipe can include additional ingredients they didn't mention,
but try not to include too many extra ingredients. Make the main dish bold. Format your response in markdown to make it
easier to render to a web page.

If the user specifies cuisine preferences, meal type, or dietary restrictions, make sure to incorporate those into your recipe recommendation.
`;

const HF_ACCESS_TOKEN = import.meta.env.VITE_HF_ACCESS_TOKEN;

if (!HF_ACCESS_TOKEN) {
    throw new Error("Missing Hugging Face API Key! Please set HF_ACCESS_TOKEN.");
}

const hf = new HfInference(HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr, preferences = {}) {
    const ingredientsString = ingredientsArr.join(", ");
    
    // Build a prompt that includes any preferences
    let userPrompt = `I have ${ingredientsString}.`;
    
    // Add cuisine preference if specified
    if (preferences.cuisine) {
        userPrompt += ` I would like to make ${preferences.cuisine} cuisine.`;
    }
    
    // Add meal type preference if specified
    if (preferences.mealType) {
        userPrompt += ` I'm looking for a ${preferences.mealType.toLowerCase()} recipe.`;
    }
    
    // Add dietary restrictions if specified
    if (preferences.dietaryRestrictions) {
        userPrompt += ` I have the following dietary restrictions: ${preferences.dietaryRestrictions}.`;
    }
    
    userPrompt += " Please give me a recipe you'd recommend I make!";
    
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            max_tokens: 1024,
        });

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error("Invalid API response");
        }

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Hugging Face API Error:", err);
        return `Error: ${err.message || "Unable to generate a recipe at this time."}`;
    }
}