import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, OracleResult, LibraryLocation } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const getBookRecommendations = async (prefs: UserPreferences): Promise<OracleResult> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const modelId = "gemini-2.5-flash"; // Using flash for efficiency with structured text tasks

  const prompt = `
    Act as "The Literary Oracle", a compassionate librarian and sharp book critic.
    Analyze the following user profile and recommend 5 books.
    
    User Profile:
    - Favorite Book: "${prefs.favoriteBook}"
    - Preferred Genres: ${prefs.preferredGenres.join(', ')}
    - Reading Speed: ${prefs.readingSpeed}
    - Current Mood: "${prefs.currentMood}"
    - Age Group: "${prefs.ageGroup || 'Not specified'}"

    Your response must be a JSON object containing exactly 5 book recommendations and one motivational message.
    For each book, determine the best format (Audiobook/Novel/E-Book) based on their reading speed (Slow readers often benefit from Audiobooks or short Novels, Fast readers might like E-books or long Novels).
    The 'difficulty' should range from Beginner to Advanced based on the book's complexity.
    The 'matchReason' should explain why it fits their personality and mood.
    The 'motivationalMessage' should be inspirational and polished.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  matchReason: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                  formatSuggestion: { type: Type.STRING, enum: ['Audiobook', 'Novel', 'E-Book'] },
                },
                required: ['title', 'author', 'summary', 'matchReason', 'difficulty', 'formatSuggestion'],
              },
            },
            motivationalMessage: { type: Type.STRING },
          },
          required: ['recommendations', 'motivationalMessage'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received empty response from the Oracle.");
    }

    const result = JSON.parse(text) as OracleResult;
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The Oracle is currently silent. Please try again later.");
  }
};

export const findNearbyLibraries = async (lat: number, lng: number): Promise<LibraryLocation[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find the 3 nearest public libraries to this location.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract map data from grounding chunks
    const libraries: LibraryLocation[] = [];
    const seenUris = new Set<string>();

    chunks.forEach((chunk: any) => {
      if (chunk.maps && chunk.maps.uri && chunk.maps.title) {
        if (!seenUris.has(chunk.maps.uri)) {
          libraries.push({
            name: chunk.maps.title,
            uri: chunk.maps.uri
          });
          seenUris.add(chunk.maps.uri);
        }
      } else if (chunk.web && chunk.web.uri && chunk.web.title) {
         // Fallback to web chunks if map chunks aren't perfectly structured but look like places
         if (!seenUris.has(chunk.web.uri)) {
           libraries.push({
             name: chunk.web.title,
             uri: chunk.web.uri
           });
           seenUris.add(chunk.web.uri);
         }
      }
    });

    return libraries;
  } catch (error) {
    console.error("Library Search Error:", error);
    return [];
  }
};