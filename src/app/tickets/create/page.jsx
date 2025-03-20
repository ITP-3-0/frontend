// app/tickets/create/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import QrScanner from "@/components/ticket-raising/QrScanner";

export default function CreateTicketPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deviceName: "",
        distributionDate: "",
        warrantyPeriod: 0,
        agentName: "",
        priority: "medium",
        creator: "User", // This would come from auth context in a real app
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleQrScan = (deviceData) => {
        setFormData((prev) => ({
            ...prev,
            deviceName: deviceData.deviceName || "",
            distributionDate: deviceData.distributionDate || "",
            warrantyPeriod: deviceData.warrantyPeriod || "",
            agentName: deviceData.agentName || "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                let errorMessage = `Failed to create ticket: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData?.message) {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // Response is not JSON, keep the default error message
                }
                throw new Error(errorMessage);
            }

            // Success - redirect to tickets list
            router.push("/tickets");
        } catch (error) {
            console.error("Error creating ticket:", error);
            setErrorMessage(error.message || "Failed to create ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create New Ticket</h1>

                {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorMessage}</div>}

                <div className="flex justify-end mb-4">
                    <QrScanner onScanSuccess={handleQrScan} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter ticket title" required />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail"
                            className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 min-h-[120px]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="deviceName">Device Name</Label>
                            <Input
                                id="deviceName"
                                name="deviceName"
                                value={formData.deviceName}
                                onChange={handleChange}
                                placeholder="Device Name"
                                disabled={!!formData.deviceName}
                            />
                        </div>

                        <div>
                            <Label htmlFor="distributionDate">Distribution Date</Label>
                            <Input
                                id="distributionDate"
                                name="distributionDate"
                                value={formData.distributionDate}
                                onChange={handleChange}
                                placeholder="Distribution Date"
                                disabled={!!formData.distributionDate}
                            />
                        </div>

                        <div>
                            <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                            <Input
                                id="warrantyPeriod"
                                name="warrantyPeriod"
                                value={formData.warrantyPeriod}
                                onChange={handleChange}
                                placeholder="Warranty Period"
                                disabled={!!formData.warrantyPeriod}
                            />
                        </div>
                        <div>
                            <Label htmlFor="agentName">Agent Name</Label>
                            <Input
                                id="agentName"
                                name="agentName"
                                value={formData.agentName}
                                onChange={handleChange}
                                placeholder="Agent Name"
                                disabled={!!formData.agentName}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="priority">Priority</Label>
                        <div className="flex space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="low"
                                    name="priority"
                                    value="low"
                                    checked={formData.priority === "low"}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="low" className="cursor-pointer">
                                    Low
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="medium"
                                    name="priority"
                                    value="medium"
                                    checked={formData.priority === "medium"}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="medium" className="cursor-pointer">
                                    Medium
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="high"
                                    name="priority"
                                    value="high"
                                    checked={formData.priority === "high"}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="high" className="cursor-pointer">
                                    High
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => router.push("/tickets")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Ticket"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
