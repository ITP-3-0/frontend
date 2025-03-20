// app/tickets/[id]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditTicketPage({ params }) {
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deviceName: '',
        distributionDate: '',
        warrantyPeriod: '',
        agentName: '',
        priority: 'medium',
    });

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await fetch(`/api/tickets/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch ticket');
                }

                const data = await response.json();
                setFormData({
                    title: data.ticket.title,
                    description: data.ticket.description,
                    deviceName: data.ticket.deviceName || '',
                    distributionDate: data.ticket.distributionDate || '',
                    warrantyPeriod: data.ticket.warrantyPeriod || '',
                    agentName: data.ticket.agentName || '',
                    priority: data.ticket.priority,
                });
            } catch (error) {
                console.error('Error fetching ticket:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update ticket');
            }

            router.push('/tickets');
        } catch (error) {
            console.error('Error updating ticket:', error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="container mx-auto py-10 px-4 text-center">Loading ticket...</div>;
    }

    if (error) {
        return <div className="container mx-auto py-10 px-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Ticket</h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter ticket title"
                            required
                        />
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
                                    checked={formData.priority === 'low'}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="low" className="cursor-pointer">Low</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="medium"
                                    name="priority"
                                    value="medium"
                                    checked={formData.priority === 'medium'}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="high"
                                    name="priority"
                                    value="high"
                                    checked={formData.priority === 'high'}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="high" className="cursor-pointer">High</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/tickets')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Ticket'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
