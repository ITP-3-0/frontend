"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import AIChat from "@/components/ui/AIChat"; 
import SupportForm from "@/components/ui/SupportForm"; 

export default function TicketPage() {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
            {!selectedOption ? (
                <div className="text-center">
                    <div className="flex flex-col gap-4">
                        <Button onClick={() => setSelectedOption("ai")} className="w-80 h-12 bg-blue-500 rounded-full text-white hover:bg-blue-600">
                            Get support from AI Agent
                        </Button>
                        <Button
                            onClick={() => setSelectedOption("person")}
                            className="w-80 h-12 bg-white rounded-full text-blue-600 hover:bg-blue-50 outline"
                        >
                            Get support from an Actual Agent
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-lg p-5">{selectedOption === "ai" ? <AIChat /> : <SupportForm />}</div>
            )}
        </div>
    );
}
