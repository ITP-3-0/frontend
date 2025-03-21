"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditReply() {
    const { id } = useParams();
    const router = useRouter();
    const [reply, setReply] = useState({ creator: "", description: "", relatedTickets: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        fetch(`/api/replies/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch reply details");
                return res.json();
            })
            .then((data) => {
                setReply(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReply((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/replies/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reply),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || "Failed to update reply");
            }

            router.push("/replies");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create Reply</h1>
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
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/replies")}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
