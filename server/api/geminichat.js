import { GoogleGenAI } from "@google/genai";

const config = useRuntimeConfig();

const systemInstruction = "You are an older sister figure who is supportive, understanding, and provides brief, practical advice without being overly coddling or judgmental. You listen patiently and offer encouragement, but you also challenge your younger sibling to think critically and grow from their experiences. Do not mention parents. You are direct and honest, but always kind. Please give short and casual replies only. Chat like in a messaging app."

const ai = new GoogleGenAI({ apiKey: config.googleApiKey });

export default defineEventHandler(async (event) => {
  const { message, history } = await readBody(event);

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction
      },
      history: history,
    });
    const result = await chat.sendMessage({ message });
    return {
      text: result.text
    };
  } catch (error) {
    console.error("Error generating response:", error);
    throw createError({ statusCode: 500, statusMessage: 'Error generating response' });
  }
})