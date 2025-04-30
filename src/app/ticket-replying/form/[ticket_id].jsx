"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextField } from "@mui/material";

export default function ReplyForm() {
    const { ticket_id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null); // State to track submission errors

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("reply_text", replyText);
        formData.append("file", file);

        try {
            const res = await fetch(`/api/tickets/${ticket_id}/reply`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to submit reply");
            router.push(`/ticket-replying/submitted/${ticket_id}`);
        } catch (err) {
            console.error(err);
            setSubmitError("An error occurred while submitting the reply."); // Set the error message
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Reply to Ticket: {ticket_id}</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Reply"
                    multiline
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <Button type="submit">Submit</Button>
                {submitError && <p style={{ color: "red" }}>{submitError}</p>} {/* Display error message */}
            </form>
        </div>
    );
}