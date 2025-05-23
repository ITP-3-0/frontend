"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/Firebase/AuthContext";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";
import NavBar from "../_Components/NavBar";

export default function ReplyList() {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // const { user, loading, setLoading } = useAuth();

    // if (!user && !loading) {
    //     redirect("/login");
    // }

    useEffect(() => {
        fetch("api/replies/")
            .then((res) => {
                if (!res.ok) {
                }
                return res.json();
                throw new Error("Failed to fetch replies");
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

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this reply?")) return;

        try {
            const response = await fetch(`api/replies/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete reply");

            setReplies(replies.filter((reply) => reply._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (id) => {
        router.push(`/replies/edit/${id}`);
    };

    if (loading) return <LoadingComponent />;
    // if (error) return <p>Error: {error}</p>;

    return (
        <>
            <NavBar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Forum Replies</h1>
                <Link href="/replies/new" className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block">
                    Create New Reply
                </Link>
                {replies.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Creator</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Ticket ID</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {replies.map((reply) => (
                                <tr key={reply._id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{reply.creator}</td>
                                    <td className="py-2 px-4">{reply.description}</td>
                                    <td className="py-2 px-4">{reply.relatedTickets}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <Button onClick={() => handleEdit(reply._id)} className="text-yellow-500 hover:underline">
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(reply._id)} className="text-red-500 hover:underline">
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No replies found.</p>
                )}
            </div>
        </>
    );
}
