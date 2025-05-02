import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { userInput } = await req.json();

        if (!userInput) {
            return new Response(JSON.stringify({ error: "No input provided" }), { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userInput);
        const responseText = await result.response.text(); // Ensure response is awaited properly

        return new Response(JSON.stringify({ response: responseText }), { status: 200 });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch AI response" }), { status: 500 });
    }
}
