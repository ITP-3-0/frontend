"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReplyList() {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/replies/")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch replies");
                }
                return res.json();
            })
            .then((data) => {
                console.log("API Response:", data);
                setReplies(data.replies || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching replies:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const getTicketId = (relatedTicketId) => {
        return relatedTicketId.slice(0, 6);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Forum Replies</h1>
            {replies.length > 0 ? (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Creator</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            <th className="py-2 px-4 border-b">Ticket ID</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {replies.map((reply) => (
                            <tr key={reply._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{reply.creator}</td>
                                <td className="py-2 px-4">{reply.description}</td>
                                <td className="py-2 px-4">{getTicketId(reply.relatedTickets)}</td>
                                <td className="py-2 px-4">
                                    <Link href={`/replies/${reply._id}`} className="text-blue-500 hover:underline">
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No replies found.</p>
            )}
        </div>
    );
}
