"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ReplyDetails() {
    const { replyId } = useParams();
    const router = useRouter();
    const [reply, setReply] = useState({ creator: "", description: "", relatedTickets: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!replyId) {
            setLoading(false);
            return;
        }

        fetch(`/api/replies/${replyId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Reply Details:", data);
                setReply(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching reply details:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [replyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReply((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let updatedReply = { ...reply };

            if (!replyId) {
                // Remove _id field when creating a new reply
                delete updatedReply._id;
            }

            const response = await fetch(`/api/replies/${replyId || ""}`, {
                method: replyId ? "PUT" : "POST", // Use PUT for updates and POST for new replies
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedReply),
            });

            const text = await response.text();

            try {
                const responseData = JSON.parse(text);
                console.log("API Response:", responseData);
                if (!response.ok) {
                    throw new Error(responseData?.message || "Failed to submit reply");
                }
            } catch (jsonError) {
                throw new Error("Server returned invalid JSON: " + text);
            }

            router.push("/replies");
        } catch (err) {
            console.error("Error:", err.message);
            setError(err.message);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{replyId ? "Edit Reply" : "Create Reply"}</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-4">
                    <label className="block text-gray-700">Creator</label>
                    <input
                        type="text"
                        name="creator"
                        value={reply.creator}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={reply.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Related Ticket</label>
                    <input
                        type="text"
                        name="relatedTickets"
                        value={reply.relatedTickets}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="flex gap-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                    <button type="button" onClick={() => router.push("/replies")} className="bg-gray-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
