"use client";

import { useState } from "react";
import axios from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ReplyForm = ({ existingReply }) => {
    const [description, setDescription] = useState(existingReply?.description || "");
    const [creator, setCreator] = useState(existingReply?.creator || "");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const replyData = { description, creator };

        try {
            if (existingReply) {
                await axios.put(`/replies/${existingReply._id}`, replyData);
            } else {
                await axios.post("/replies", replyData);
            }
            window.location.href = "/replies"; 
        } catch (err) {
            console.error("Error saving reply:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input type="text" placeholder="Creator" value={creator} onChange={(e) => setCreator(e.target.value)} required />
            <Button type="submit">{existingReply ? "Update Reply" : "Add Reply"}</Button>
        </form>
    );
};

export default ReplyForm;
