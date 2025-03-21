"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { sendMessage } from "@/app/actions";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionId] = useState(`session-${Date.now()}`);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(input, sessionId, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="mb-2 flex w-80 sm:w-96 flex-col rounded-2xl border border-gray-300 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-white">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="AI Assistant" />
                <AvatarFallback className="bg-white text-blue-500 font-semibold">AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "350px", backgroundColor: "#f9f9f9" }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-xl px-4 py-2 text-sm shadow-md border border-white",
                  message.role === "user"
                    ? "ml-auto bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                )}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <form onSubmit={handleSendMessage} className="border-t p-3 bg-gray-100 rounded-b-2xl">
            <div className="flex gap-3 items-center">
              <Textarea
                placeholder="Type your message..."
                className="min-h-9 flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button onClick={() => setIsOpen(true)} className="h-14 w-14 rounded-full border-2 border-amber-50 bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out">
          <MessageCircle className="h-7 w-7" />
        </Button>
      )}
    </div>
  );
}
