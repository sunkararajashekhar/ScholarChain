import { GoogleGenAI, Type } from "@google/genai";
import { AcademicRecord, AIAnalysisResult, RecordType } from "../types";

// Initialize Gemini Client
// In a real production app, you might proxy this through a backend to protect the key,
// but for this client-side demo, we use the env variable directly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = "gemini-3-flash-preview";

export const analyzeRecord = async (record: AcademicRecord): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      Analyze the following academic record for a student named ${record.studentName}.
      
      Record Data:
      ${JSON.stringify(record, null, 2)}
      
      Provide a structured analysis including:
      1. A brief professional summary of their academic performance.
      2. 3 potential career paths based on their program and GPA.
      3. A list of key academic strengths inferred from the data.
      
      Keep the tone professional and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            careerPath: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing record:", error);
    return {
      summary: "Analysis unavailable due to service interruption.",
      careerPath: ["N/A"],
      strengths: ["N/A"]
    };
  }
};

export const generateSampleData = async (): Promise<AcademicRecord> => {
    try {
        const response = await ai.models.generateContent({
            model: ANALYSIS_MODEL,
            contents: "Generate a realistic dummy academic record for a university student. Include a mix of computer science and math courses.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        studentId: { type: Type.STRING },
                        studentName: { type: Type.STRING },
                        institution: { type: Type.STRING },
                        program: { type: Type.STRING },
                        graduationYear: { type: Type.INTEGER },
                        gpa: { type: Type.NUMBER },
                        courses: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    code: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    grade: { type: Type.STRING },
                                    credits: { type: Type.NUMBER },
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const text = response.text;
        if(!text) throw new Error("Failed to generate sample");
        const data = JSON.parse(text);
        return { ...data, type: RecordType.TRANSCRIPT } as AcademicRecord;
    } catch (e) {
        // Fallback if API fails
        return {
            studentId: "12345678",
            studentName: "Jane Doe",
            institution: "Tech University",
            program: "B.S. Computer Science",
            graduationYear: 2024,
            gpa: 3.8,
            courses: [
                { code: "CS101", name: "Intro to CS", grade: "A", credits: 4 },
                { code: "MA202", name: "Calculus II", grade: "B+", credits: 3 }
            ],
            type: RecordType.TRANSCRIPT
        }
    }
}