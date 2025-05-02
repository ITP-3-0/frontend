"use client";

import { useState, useEffect } from "react";
import ReplyForm from "./ReplyForm";

export default function TicketDetails({ ticketId }) {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await fetch(`http://localhost:5000/tickets/${ticketId}`);
                if (!response.ok) throw new Error("Failed to fetch ticket details");

                const data = await response.json();
                setTicket(data.ticket);
            } catch (error) {
                console.error("Error fetching ticket:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [ticketId]);

    const handleReplySuccess = () => {
        // Optionally refetch ticket details to update replies
        setLoading(true);
        fetchTicket();
    };

    if (loading) return <p>Loading...</p>;
    if (!ticket) return <p>Ticket not found</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
            <p className="mb-4">{ticket.description}</p>

            <h2 className="text-xl font-semibold mb-2">Replies</h2>
            <ul className="space-y-2 mb-4">
                {ticket.responses?.map((response, index) => (
                    <li key={index} className="p-2 border rounded">
                        <p>{response.reply}</p>
                        <small className="text-gray-500">{new Date(response.replied_at).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-2">Add a Reply</h2>
            <ReplyForm ticketId={ticketId} onReplySuccess={handleReplySuccess} />
        </div>
    );
}
