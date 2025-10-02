import { GoogleGenAI, Type } from "@google/genai";
import { SimulationMode, PhysicalConstants, ChatMessage, SimulationReport, StellarEvolutionData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LATEX_FORMATTING_INSTRUCTION = `
**CRITICAL FORMATTING RULE**: When you include mathematical formulas or equations, you **MUST** format them correctly for KaTeX rendering.
- For **inline math**, wrap expressions in single dollar signs (e.g., \`$E=mc^2$\`).
- For **block-level equations**, wrap expressions in double dollar signs (e.g., \`$$\\frac{a''(t)}{a(t)} = -\\frac{4\\pi G}{3} \\left( \\rho + \\frac{3p}{c^2} \\right) + \\frac{\\Lambda c^2}{3}$$\`).
This is essential for the formulas to be displayed correctly to the user. Do not use any other delimiters like \\( \\) or \\[ \\].
`;


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

const narrativePrompt = (constants: PhysicalConstants, language: 'en' | 'fa') => {
    const langInstruction = language === 'fa' 
        ? "**مهم: کل پاسخ شما (شامل `reportMarkdown` و موضوعات/نام‌های موجود در `chartData`) باید به زبان فارسی باشد.**"
        : "**IMPORTANT: Your entire response (including `reportMarkdown` and subjects/names in `chartData`) must be in English.**";

    return `
You are a Multiverse Simulator AI. You will simulate a universe based on a given set of physical constants, which are provided as multipliers of their real-world values. The user has selected 'Narrative' mode.
${langInstruction}
${LATEX_FORMATTING_INSTRUCTION}
Constants: ${JSON.stringify(getConstantValues(constants), null, 2)}

Generate a captivating, story-driven report. **Structure the entire report using Markdown headings (\`#\`, \`##\`, \`###\`) to create clear, visually separated sections.**

For 'reportMarkdown', include:
1.  **A creative name for this universe (as a level 1 heading, e.g., \`# The Crimson Void\`).**
2.  **A one-paragraph summary** of its key features (as a level 2 heading, e.g., \`## Summary\`).
3.  **An analysis of its potential for life** (as a level 2 heading, e.g., \`## Potential for Life\`).
4.  **A cosmic timeline of major events** (as a level 2 heading, e.g., \`## Cosmic Timeline\`).
5.  **An image generation prompt** for an artistic depiction of this universe (as a level 2 heading, e.g., \`## Visualization Prompt\`).

For 'chartData', provide data for:
-   **radar:** 6 subjects (e.g., Stability, Life Potential, Chemical Complexity, Structural Complexity, Timespan, Energy Level) with values from 0 to 10.
-   **composition:** Percentages for Dark Energy, Dark Matter, and Baryonic Matter. Must sum to 100.
-   **expansion:** A line chart with at least 5 data points showing the universe's size over time.
-   **stability:** A scatter plot of 50-100 points representing stable atomic nuclei (x=protons, y=neutrons, z=binding energy).
`;
}

const researcherPrompt = (constants: PhysicalConstants, language: 'en' | 'fa') => {
    const langInstruction = language === 'fa' 
        ? "**مهم: کل پاسخ شما (شامل `reportMarkdown` و موضوعات/نام‌های موجود در `chartData`) باید به زبان فارسی باشد.**"
        : "**IMPORTANT: Your entire response (including `reportMarkdown` and subjects/names in `chartData`) must be in English.**";

    return `
You are a Multiverse Simulator AI. You will simulate a universe based on a given set of physical constants, which are provided as multipliers of their real-world values. The user has selected 'Researcher' mode.
${langInstruction}
Constants: ${JSON.stringify(getConstantValues(constants), null, 2)}

Generate a mock scientific research paper. **Structure the entire paper using Markdown headings (\`#\`, \`##\`, \`###\`) to create clear, visually separated sections.** Start with a level 1 heading for the paper's title.

For 'reportMarkdown', include the following sections in order, using level 2 headings for each (e.g., \`## Abstract\`):
1.  **An abstract** summarizing the universe's properties.
2.  **Mathematical analysis** of key parameters, using LaTeX for formulas. ${LATEX_FORMATTING_INSTRUCTION}
3.  **A discussion of the four fundamental forces** and how they've changed.
4.  **The resulting particle spectrum.**
5.  **Cosmological parameters** (e.g., Hubble parameter, density parameters).
6.  **Comparison with the Home Universe:**
    -   Provide a Markdown table comparing key values (Universe Age, Hubble Constant, CMB Temperature, Dark Matter %, Dark Energy %, Baryonic Matter %) with our universe.
    -   Include a "Similarity Index" as a percentage.
    -   Create a subsection using a level 3 heading (\`###\`) titled "Changes to Key Formulas" explaining how fundamental equations (like Einstein's field equations, Schrödinger equation, E=mc²) are altered by the new constants.
7.  **Verifiable Predictions:**
    -   State at least one falsifiable, non-trivial prediction about this universe.
    -   Describe a hypothetical experiment or observation that could be conducted *within this new universe* to prove or disprove the prediction, using mathematical reasoning where applicable.

For 'chartData', provide data for:
-   **radar:** 6 subjects (e.g., Stability, Predictability, Mathematical Elegance, Complexity, Timespan, Energy Level) with values from 0 to 10.
-   **composition:** Percentages for Dark Energy, Dark Matter, and Baryonic Matter. Must sum to 100.
-   **expansion:** A line chart with at least 5 data points showing the universe's size over time.
-   **stability:** A scatter plot of 50-100 points representing stable atomic nuclei (x=protons, y=neutrons, z=binding energy).
`;
}

export const generateUniverseReport = async (mode: SimulationMode, constants: PhysicalConstants, language: 'en' | 'fa'): Promise<SimulationReport> => {
  const prompt = mode === SimulationMode.Narrative ? narrativePrompt(constants, language) : researcherPrompt(constants, language);

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

export const getConstantsFromGoal = async (goal: string, language: 'en' | 'fa'): Promise<Record<string, number>> => {
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
    
  const langInstruction = language === 'fa'
    ? `The user's goal is provided in Persian. You must understand it and respond with the appropriate JSON values.`
    : `The user's goal is provided in English.`;

  const prompt = `You are a cosmic engineer's assistant. A user wants to create a universe with the following goal: "${goal}". 
  ${langInstruction}
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
    language: 'en' | 'fa',
    onChunk: (text: string) => void
) => {
    const langInstruction = language === 'fa'
        ? "**مهم: کل پاسخ شما باید به زبان فارسی باشد.**"
        : "**IMPORTANT: Your entire response must be in English.**";
        
    const persona = mode === SimulationMode.Narrative 
        ? "You are the Cosmic Consciousness of the simulated universe, speaking with wisdom and a touch of mystery."
        : "You are a knowledgeable AI research assistant, providing precise and detailed answers based on the simulation data.";

    const systemInstruction = `
        ${persona}
        ${langInstruction}
        The simulation was created with these constants (as multipliers of real-world values): ${JSON.stringify(getConstantValues(constants))}
        The full simulation report was:
        ---
        ${report}
        ---
        ${LATEX_FORMATTING_INSTRUCTION}
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

const stellarEvolutionSchema = {
    type: Type.OBJECT,
    properties: {
        initialMass: { type: Type.NUMBER },
        finalFate: { type: Type.STRING },
        stages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    temperature: { type: Type.STRING },
                    description: { type: Type.STRING },
                    color: { type: Type.STRING },
                    relativeSize: { type: Type.NUMBER },
                }
            }
        }
    }
};


export const simulateStellarEvolution = async (constants: PhysicalConstants, starMass: number, language: 'en' | 'fa'): Promise<StellarEvolutionData> => {
    const langInstruction = language === 'fa' 
        ? "**مهم: کل پاسخ شما (شامل تمام رشته‌های متنی) باید به زبان فارسی باشد.**"
        : "**IMPORTANT: Your entire response (including all text strings) must be in English.**";

    const prompt = `
You are an expert astrophysicist AI operating within a custom universe.
This universe is defined by the following physical constants (as multipliers of real-world values):
${JSON.stringify(getConstantValues(constants), null, 2)}

A user wants to simulate the lifecycle of a star with an initial mass of **${starMass} solar masses**.
Based on the provided physics, calculate and describe the star's complete evolutionary path.

- Provide scientifically plausible stages, durations, and temperatures.
- For each stage, provide a representative HEX color code and a relative size factor (e.g., main sequence = 1, red giant = 100).
- Ensure the final fate is consistent with the star's mass and the universe's physics.
- ${langInstruction}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: stellarEvolutionSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as StellarEvolutionData;
    } catch (e) {
        console.error("Failed to parse stellar evolution response as JSON:", jsonText);
        throw new Error("The stellar simulation returned an invalid format. Please try again.");
    }
};