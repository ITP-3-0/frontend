"use client";

import { useState } from "react";

export default function SupportForm() {
    const [formData, setFormData] = useState({ name: "", email: "", issue: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/sendForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Your request has been sent! Our support team will contact you soon.");
        } else {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Support Request Form</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <textarea
                    name="issue"
                    placeholder="Describe your issue"
                    value={formData.issue}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Submit Request
                </button>
            </form>
        </div>
    );
}
