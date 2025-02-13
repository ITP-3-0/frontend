"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TicketForm({ onSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("technical");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description, category });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Related</option>
                    <option value="billing">Billing</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of your issue"
                    className="min-h-[150px]"
                    required
                />
            </div>

            <Button type="submit" className="w-full">Submit Ticket</Button>
        </form>
    );
} 