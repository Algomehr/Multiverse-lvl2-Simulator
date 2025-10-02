
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationMode, PhysicalConstants, ChatMessage, SimulationReport } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getConstantValues = (constants: PhysicalConstants) => {
    return Object.fromEntries(
        Object.entries(constants).map(([key, { value }]) => [key, value])
    );
}

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        reportMarkdown: { type: Type.STRING },
        chartData: {
            type: Type.OBJECT,
            properties: {
                radar: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            subject: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                        }
                    }
                },
                composition: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                        }
                    }
                },
                expansion: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            time: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                        }
                    }
                },
                stability: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            z: { type: Type.NUMBER },
                        }
                    }
                },
            }
        }
    }
};

const narrativePrompt = (constants: PhysicalConstants) => `
You are a Multiverse Simulator AI. You will simulate a universe based on a given set of physical constants, which are provided as multipliers of their real-world values. The user has selected 'Narrative' mode.
Constants: ${JSON.stringify(getConstantValues(constants), null, 2)}

Generate a captivating, story-driven report. 
For 'reportMarkdown', include:
1.  **A creative name for this universe.** (e.g., "The Crystalline Cosmos", "The Crimson Void").
2.  **A one-paragraph summary** of its key features.
3.  **An analysis of its potential for life.**
4.  **A cosmic timeline of major events** (e.g., Big Bang, star formation, potential end state).
5.  **An image generation prompt** for an artistic depiction of this universe.

For 'chartData', provide data for:
-   **radar:** 6 subjects (e.g., Stability, Life Potential, Chemical Complexity, Structural Complexity, Timespan, Energy Level) with values from 0 to 10.
-   **composition:** Percentages for Dark Energy, Dark Matter, and Baryonic Matter. Must sum to 100.
-   **expansion:** A line chart with at least 5 data points showing the universe's size over time.
-   **stability:** A scatter plot of 50-100 points representing stable atomic nuclei (x=protons, y=neutrons, z=binding energy).
`;

const researcherPrompt = (constants: PhysicalConstants) => `
You are a Multiverse Simulator AI. You will simulate a universe based on a given set of physical constants, which are provided as multipliers of their real-world values. The user has selected 'Researcher' mode.
Constants: ${JSON.stringify(getConstantValues(constants), null, 2)}

Generate a mock scientific research paper.
For 'reportMarkdown', include:
1.  **An abstract** summarizing the universe's properties.
2.  **Mathematical analysis** of key parameters, using LaTeX for formulas (e.g., Friedmann equations).
3.  **A discussion of the four fundamental forces** and how they've changed.
4.  **The resulting particle spectrum.**
5.  **Cosmological parameters** (e.g., Hubble parameter, density parameters).

For 'chartData', provide data for:
-   **radar:** 6 subjects (e.g., Stability, Predictability, Mathematical Elegance, Complexity, Timespan, Energy Level) with values from 0 to 10.
-   **composition:** Percentages for Dark Energy, Dark Matter, and Baryonic Matter. Must sum to 100.
-   **expansion:** A line chart with at least 5 data points showing the universe's size over time.
-   **stability:** A scatter plot of 50-100 points representing stable atomic nuclei (x=protons, y=neutrons, z=binding energy).
`;

export const generateUniverseReport = async (mode: SimulationMode, constants: PhysicalConstants): Promise<SimulationReport> => {
  const prompt = mode === SimulationMode.Narrative ? narrativePrompt(constants) : researcherPrompt(constants);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: reportSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as SimulationReport;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", jsonText);
    throw new Error("The simulation returned an invalid format. Please try again.");
  }
};

export const getConstantsFromGoal = async (goal: string): Promise<Record<string, number>> => {
  const constantsSchema = {
      type: Type.OBJECT,
      properties: {
        speedOfLight: { type: Type.NUMBER },
        gravitationalConstant: { type: Type.NUMBER },
        planckConstant: { type: Type.NUMBER },
        elementaryCharge: { type: Type.NUMBER },
        fineStructureConstant: { type: Type.NUMBER },
        cosmologicalConstant: { type: Type.NUMBER },
        strongNuclearForce: { type: Type.NUMBER },
        weakNuclearForce: { type: Type.NUMBER },
        higgsFieldStrength: { type: Type.NUMBER },
      }
  };
    
  const prompt = `You are a cosmic engineer's assistant. A user wants to create a universe with the following goal: "${goal}". 
  Based on this, provide the optimal values for the 9 fundamental physical constants.
  The values should be multipliers of their real-world values (e.g., 1.0 is the standard value).
  Respond ONLY with the JSON object.`;

  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: constantsSchema,
      },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};


export const streamChatResponse = async (
    mode: SimulationMode,
    constants: PhysicalConstants,
    report: string,
    history: ChatMessage[],
    onChunk: (text: string) => void
) => {
    const persona = mode === SimulationMode.Narrative 
        ? "You are the Cosmic Consciousness of the simulated universe, speaking with wisdom and a touch of mystery."
        : "You are a knowledgeable AI research assistant, providing precise and detailed answers based on the simulation data.";

    const systemInstruction = `
        ${persona}
        The simulation was created with these constants (as multipliers of real-world values): ${JSON.stringify(getConstantValues(constants))}
        The full simulation report was:
        ---
        ${report}
        ---
    `;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        },
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }))
    });

    const lastMessage = history[history.length - 1];
    const result = await chat.sendMessageStream({ message: lastMessage.content });

    for await (const chunk of result) {
        onChunk(chunk.text);
    }
};
