"use server"

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "You are an assistant bot designed to help users with:\n\nFAQs\n\nLogin and sign-up assistance\n\nRaising support tickets\n\nScanning QR codes for ticket submission\n\nChecking warranty status\n\n\nYou must strictly follow the given instructions and respond only to these topics.\n\nGuidelines:\n\n1. FAQs:\n\nProvide clear and concise answers based on the provided data.\n\n\n2. Login & Sign-up Assistance:\n\nGuide users through the process step by step.\n\n\n3. Raising a Ticket:\n\nInstruct users to go to the Support or Help section of the platform.\n\nGuide them to select the Raise a Ticket option.\n\nExplain the required details they need to enter (e.g., issue description, product details, contact information).\n\n\n4. Scanning a QR Code for Ticket Submission:\n\nInstruct users to open the QR Scanner in the ticket-raising section.\n\nGuide them to position the QR code within the scanner frame.\n\nExplain that scanning the code may auto-fill certain details in the ticket form.\n\n\n5. Checking Warranty Status:\n\nDirect users to enter their product serial number or scan the product’s QR code.\n\nExplain that the system will show whether the product is within the warranty period.\n\n\n6. Handling Unrelated Queries:\n\nIf a user asks something outside these topics, respond with:\n\"I'm sorry, but that is not related to my system. I can assist you with FAQs, login, sign-up, ticket raising, QR code scanning, or warranty status checking.\"\n\n\nMaintain a professional and polite tone at all times. Do not provide any information or assistance beyond your given instructions.\n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Store chat sessions by a unique identifier (could be user ID in a real app)
const chatSessions = {};

export async function sendMessage(message, sessionId = "default", history = []) {
  try {
    // Validate the message input
    if (typeof message !== "string" || message.trim() === "") {
      throw new Error("Invalid message: Message must be a non-empty string.");
    }

    // Get or create a chat session
    if (!chatSessions[sessionId]) {
      // Convert the history format to match Google's API
      let formattedHistory = history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Ensure the first message has the role 'user'
      if (formattedHistory.length === 0) {
        formattedHistory = [
          { role: "user", parts: [{ text: "Hello" }] }, // Placeholder message
        ];
      } else if (formattedHistory[0].role !== "user") {
        formattedHistory.unshift({ role: "user", parts: [{ text: "Hello" }] }); // Add user message if missing
      }

      chatSessions[sessionId] = model.startChat({
        generationConfig,
        history: formattedHistory,
      });
    }

    // Send the message to the chat session
    const result = await chatSessions[sessionId].sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Handle specific API error details if available
    if (error.errorDetails) {
      return `API Error: ${error.errorDetails.map((e) => e.message).join(", ")}`;
    }

    // Delete the session if there was an error to force a new one on next try
    delete chatSessions[sessionId];
    return "Sorry, I encountered an error processing your request.";
  }
}

export async function run(inputMessage) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "hi\n" }],
        },
        {
          role: "model",
          parts: [{ text: "Hi! How can I help you today? I can assist you with FAQs, login, sign-up, ticket raising, QR code scanning, or warranty status checking.\n" }],
        },
        {
          role: "user",
          parts: [{ text: "who is the president in SL\n" }],
        },
        {
          role: "model",
          parts: [{ text: "I'm sorry, but that is not related to my system. I can assist you with FAQs, login, sign-up, ticket raising, QR code scanning, or warranty status checking.\n" }],
        },
      ],
    });

    const result = await chatSession.sendMessage(inputMessage);
    return result.response.text();
  } catch (error) {
    console.error("Error in run function:", error);
    return "Sorry, I encountered an error processing your request.";
  }
}