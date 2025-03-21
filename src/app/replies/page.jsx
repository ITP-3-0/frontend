"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReplyList() {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // THIS IS THE URL FORMAT FOR THE API.
        // DO NOT USE URL AS http://localhost:5000/api/replies
        // INSTEAD USE /api/replies
        fetch("/api/replies")
            .then((res) => res.json())
            .then((data) => {
                console.log("API Response:", data);
                setReplies(data.replies || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching replies:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Forum Replies</h1>
            {replies.length > 0 ? (
                <div className="space-y-4">
                    {replies.map((reply) => (
                        <div key={reply._id} className="p-4 border rounded-md shadow">
                            <p className="font-semibold">{reply.creator}:</p>
                            <p>{reply.description}</p>
                            <Link href={`/replies/${reply._id}`} className="text-blue-500 hover:underline">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No replies found. Make sure your backend is working!</p>
            )}
        </div>
    );
}
