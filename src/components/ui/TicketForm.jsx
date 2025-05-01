"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/TextArea";
import { Label } from "../ui/label";

export default function TicketForm() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        creator: "",
        priority: "low",
        supportType: "human",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Ticket submitted successfully!");
            setFormData({ title: "", description: "", creator: "", priority: "low", supportType: "human" });
        } else {
            alert("Failed to submit ticket.");
        }
    };

    return (
        <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={handleSubmit}>
            <Label>Title</Label>
            <Input name="title" value={formData.title} onChange={handleChange} required />

            <Label>Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} required />

            <Label>Your Name</Label>
            <Input name="creator" value={formData.creator} onChange={handleChange} required />

            <Label>Priority</Label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <Label>Support Type</Label>
            <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                    <input type="radio" name="supportType" value="ai" checked={formData.supportType === "ai"} onChange={handleChange} />
                    <span>AI Support</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input type="radio" name="supportType" value="human" checked={formData.supportType === "human"} onChange={handleChange} />
                    <span>Human Support</span>
                </label>
            </div>

            <Button type="submit" className="w-full bg-blue-500 text-white">Submit Ticket</Button>
        </form>
    );
}
