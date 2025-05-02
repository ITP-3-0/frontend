"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ReplyForm({ ticketId, onReplySuccess }) {
    const [reply, setReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:5000/tickets/${ticketId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit reply");
            }

            toast({
                title: "Success",
                description: "Reply submitted successfully",
                variant: "success",
            });

            setReply("");
            if (onReplySuccess) onReplySuccess();
        } catch (error) {
            console.error("Error submitting reply:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to submit reply",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply here..."
                required
                className="min-h-[100px]"
            />
            <Button type="submit" disabled={isSubmitting || !reply.trim()} className="bg-blue-500 hover:bg-blue-600">
                {isSubmitting ? "Submitting..." : "Submit Reply"}
            </Button>
        </form>
    );
}
