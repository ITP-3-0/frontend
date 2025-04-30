"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SubmittedDetails() {
    const { ticket_id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/tickets/${ticket_id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch ticket details");
                return res.json();
            })
            .then((data) => {
                setTicket(data.ticket);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [ticket_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Submitted Reply for Ticket: {ticket_id}</h1>
            <p>Reply: {ticket.reply_text}</p>
            {ticket.attachment_url && (
                <a href={ticket.attachment_url} target="_blank" rel="noopener noreferrer">
                    View Attachment
                </a>
            )}
            <p>Status: {ticket.status}</p>
        </div>
    );
}