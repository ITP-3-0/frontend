"use client";

import { useState } from "react";

export default function AIChat() {
    const [userInput, setUserInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAiResponse(""); 

        try {
            const response = await fetch("/api/gemini", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch AI response");
            }

            const data = await response.json();
            setAiResponse(data.response);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setAiResponse("Error fetching AI response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">AI Support Agent Chat</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-[100px]">
                {loading ? "Thinking..." : aiResponse || "Ask me anything!"}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    {loading ? "Processing..." : "Ask AI"}
                </button>
            </form>
        </div>
    );
}
